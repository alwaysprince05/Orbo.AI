"""
Fast evaluation framework for Orbo Beauty AI Recommendation System.

Runs a single pass through test profiles and computes key metrics.
"""

import json
import time
import numpy as np
import pandas as pd
from pathlib import Path
from typing import List, Dict, Any, Set
import logging
import sys

# Suppress logging during evaluation
logging.disable(logging.WARNING)

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app.recommender import build_recommender


def precision_at_k(recommended: List[str], relevant: Set[str], k: int = 5) -> float:
    recommended_k = recommended[:k]
    if not recommended_k:
        return 0.0
    return sum(1 for r in recommended_k if r in relevant) / len(recommended_k)


def recall_at_k(recommended: List[str], relevant: Set[str], k: int = 5) -> float:
    if not relevant:
        return 0.0
    recommended_k = recommended[:k]
    return sum(1 for r in recommended_k if r in relevant) / len(relevant)


def ndcg_at_k(recommended_ids: List[str], relevant: Set[str], k: int = 5) -> float:
    relevances = [1.0 if pid in relevant else 0.0 for pid in recommended_ids[:k]]
    dcg = sum(rel / np.log2(i + 2) for i, rel in enumerate(relevances))
    ideal_dcg = sum(1.0 / np.log2(i + 2) for i in range(min(len(relevant), k)))
    return dcg / ideal_dcg if ideal_dcg > 0 else 0.0


def average_precision(recommended: List[str], relevant: Set[str]) -> float:
    if not relevant:
        return 0.0
    score = 0.0
    hits = 0
    for i, rec in enumerate(recommended):
        if rec in relevant:
            hits += 1
            score += hits / (i + 1)
    return score / len(relevant)


def compute_diversity(products_df: pd.DataFrame, product_ids: List[str]) -> float:
    if len(product_ids) < 2:
        return 1.0
    
    products = products_df[products_df['product_id'].isin(product_ids)]
    items = products['ingredients_normalized'].tolist()
    
    similarities = []
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if isinstance(items[i], list) and isinstance(items[j], list):
                set_i = set(str(x).lower() for x in items[i])
                set_j = set(str(x).lower() for x in items[j])
                if set_i or set_j:
                    union = len(set_i | set_j)
                    intersection = len(set_i & set_j)
                    similarities.append(intersection / union if union > 0 else 0)
    
    return 1.0 - np.mean(similarities) if similarities else 1.0


def get_relevant_products(products_df: pd.DataFrame, profile: Dict[str, Any]) -> Set[str]:
    relevant_ids = set()
    
    category = profile.get('category')
    budget = profile.get('budget')
    skin_type = profile.get('skin_type')
    concerns = profile.get('concerns', [])
    expected_ingredients = profile.get('expected_relevant_ingredients', [])
    
    for _, row in products_df.iterrows():
        # Category filter
        if category and row['category'] != category:
            continue
        
        # Budget filter
        if budget is not None and row['price_usd'] > budget:
            continue
        
        product_ingredients = [str(i).lower() for i in row['ingredients_normalized']] if isinstance(row['ingredients_normalized'], list) else []
        
        ingredient_match = any(
            expected in ingredient 
            for expected in expected_ingredients 
            for ingredient in product_ingredients
        )
        
        skin_types = row['skin_types'] if isinstance(row['skin_types'], list) else []
        skin_type_match = skin_type in skin_types or 'all' in skin_types
        
        product_concerns = row['skin_concerns'] if isinstance(row['skin_concerns'], list) else []
        concern_match = any(c in product_concerns for c in concerns)
        
        if ingredient_match or (skin_type_match and concern_match):
            relevant_ids.add(row['product_id'])
    
    return relevant_ids


def load_products_with_lists(products_path: str):
    """Load products from Parquet (preferred) or CSV, parsing list columns correctly."""
    import ast

    if products_path.endswith('.parquet'):
        products_df = pd.read_parquet(products_path)
        # Parquet may store lists as numpy arrays — normalise back to Python lists
        for col in ('ingredients_normalized', 'skin_types', 'skin_concerns'):
            if col in products_df.columns:
                def to_list(x):
                    if isinstance(x, list):
                        return x
                    if hasattr(x, 'tolist'):   # numpy array
                        return x.tolist()
                    try:
                        if pd.isna(x):
                            return []
                    except Exception:
                        pass
                    return []
                products_df[col] = products_df[col].apply(to_list)
        return products_df

    # CSV fallback
    products_df = pd.read_csv(products_path)

    def parse_list(col):
        if pd.isna(col) or col == '':
            return []
        try:
            result = ast.literal_eval(col)
            return result if isinstance(result, list) else []
        except Exception:
            return []

    products_df['ingredients_normalized'] = products_df['ingredients_normalized'].apply(parse_list)
    products_df['skin_types']    = products_df['skin_types'].apply(parse_list)
    products_df['skin_concerns'] = products_df['skin_concerns'].apply(parse_list)
    return products_df


def run_fast_evaluation(
    products_path: str,
    model_path: str,
    profiles_path: str,
    output_dir: str,
    k: int = 5
) -> Dict[str, Any]:
    print("Loading recommender...")
    recommender = build_recommender(products_path, model_path)
    
    # Load products for relevance checking (supports both parquet and csv)
    products_df = load_products_with_lists(products_path)
    
    with open(profiles_path) as f:
        profiles = json.load(f)
    
    print(f"Running evaluation with {len(profiles)} profiles...")
    
    all_results = []
    all_recommended_ids = []
    all_latencies = []
    
    for profile in profiles:
        start_time = time.time()
        result = recommender.recommend(
            skin_type=profile.get('skin_type'),
            concerns=profile.get('concerns'),
            category=profile.get('category'),
            budget=profile.get('budget'),
            preferred_ingredients=profile.get('preferred_ingredients'),
            avoid_ingredients=profile.get('avoid_ingredients'),
            top_k=k
        )
        latency = time.time() - start_time
        all_latencies.append(latency)
        
        recommended_ids = [rec['product_id'] for rec in result['recommendations']]
        all_recommended_ids.extend(recommended_ids)
        
        relevant_ids = get_relevant_products(products_df, profile)
        
        precision = precision_at_k(recommended_ids, relevant_ids, k)
        recall = recall_at_k(recommended_ids, relevant_ids, k)
        ndcg = ndcg_at_k(recommended_ids, relevant_ids, k)
        ap = average_precision(recommended_ids, relevant_ids)
        diversity = compute_diversity(products_df, recommended_ids)
        
        profile_result = {
            'profile_id': profile['profile_id'],
            'profile_name': profile['name'],
            'precision_at_k': precision,
            'recall_at_k': recall,
            'ndcg_at_k': ndcg,
            'average_precision': ap,
            'diversity': diversity,
            'latency_ms': latency * 1000,
            'num_recommended': len(recommended_ids),
            'is_fallback': result.get('is_fallback', False),
            'num_relevant': len(relevant_ids)
        }
        all_results.append(profile_result)
        
        print(f"  {profile['name']}: P@{k}={precision:.3f}, NDCG@{k}={ndcg:.3f}, Div={diversity:.3f}")
    
    # Aggregate metrics
    coverage = len(set(all_recommended_ids)) / len(products_df) if len(products_df) > 0 else 0
    
    aggregate = {
        'k': k,
        'num_profiles': len(profiles),
        'avg_precision_at_k': float(np.mean([r['precision_at_k'] for r in all_results])),
        'avg_recall_at_k': float(np.mean([r['recall_at_k'] for r in all_results])),
        'avg_ndcg_at_k': float(np.mean([r['ndcg_at_k'] for r in all_results])),
        'avg_map_at_k': float(np.mean([r['average_precision'] for r in all_results])),
        'avg_diversity': float(np.mean([r['diversity'] for r in all_results])),
        'catalog_coverage': coverage,
        'avg_latency_ms': float(np.mean(all_latencies) * 1000),
        'p95_latency_ms': float(np.percentile(all_latencies, 95) * 1000),
        'num_fallbacks_used': sum(1 for r in all_results if r['is_fallback'])
    }
    
    report = {
        'aggregate_metrics': aggregate,
        'profile_results': all_results
    }
    
    # Save results
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    with open(output_path / 'evaluation_results.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    # Human-readable report
    with open(output_path / 'evaluation_report.txt', 'w') as f:
        f.write("=" * 60 + "\n")
        f.write("ORBO BEAUTY AI - RECOMMENDATION EVALUATION REPORT\n")
        f.write("=" * 60 + "\n\n")
        f.write("AGGREGATE METRICS\n")
        f.write("-" * 40 + "\n")
        f.write(f"Number of test profiles: {aggregate['num_profiles']}\n")
        f.write(f"Top-K recommendations: {k}\n\n")
        f.write(f"Precision@{k}:    {aggregate['avg_precision_at_k']:.4f}\n")
        f.write(f"Recall@{k}:    {aggregate['avg_recall_at_k']:.4f}\n")
        f.write(f"NDCG@{k}:    {aggregate['avg_ndcg_at_k']:.4f}\n")
        f.write(f"MAP@{k}:    {aggregate['avg_map_at_k']:.4f}\n")
        f.write(f"Diversity:    {aggregate['avg_diversity']:.4f}\n")
        f.write(f"Coverage:    {aggregate['catalog_coverage']:.4f}\n\n")
        f.write(f"Avg Latency:  {aggregate['avg_latency_ms']:.2f} ms\n")
        f.write(f"P95 Latency:  {aggregate['p95_latency_ms']:.2f} ms\n\n")
        f.write(f"Fallbacks used in {aggregate['num_fallbacks_used']} profiles\n\n")
        f.write("PER-PROFILE RESULTS\n")
        f.write("-" * 40 + "\n")
        for result in all_results:
            f.write(f"\nProfile: {result['profile_name']}\n")
            f.write(f"  Precision@{k}: {result['precision_at_k']:.3f}\n")
            f.write(f"  Recall@{k}:    {result['recall_at_k']:.3f}\n")
            f.write(f"  NDCG@{k}:      {result['ndcg_at_k']:.3f}\n")
            f.write(f"  Diversity:    {result['diversity']:.3f}\n")
            f.write(f"  Fallback:     {'Yes' if result['is_fallback'] else 'No'}\n")
    
    print(f"\nResults saved to {output_path}/evaluation_report.txt")
    return report


if __name__ == '__main__':
    report = run_fast_evaluation(
        'data/processed/products_processed.parquet',
        'data/processed/content_model.joblib',
        'evaluation/test_profiles.json',
        'evaluation/results',
        k=5
    )
    
    print("\n" + "=" * 50)
    print("EVALUATION SUMMARY")
    print("=" * 50)
    for key, value in report['aggregate_metrics'].items():
        if isinstance(value, float):
            print(f"{key}: {value:.4f}")
        else:
            print(f"{key}: {value}")