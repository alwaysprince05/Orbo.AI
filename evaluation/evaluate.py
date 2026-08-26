"""
Evaluation framework for Orbo Beauty AI Recommendation System.

Computes:
- Precision@K
- Recall@K
- NDCG@K
- MAP@K
- Coverage
- Diversity
- Latency (average and P95)
"""

import json
import sys
import time
import numpy as np
import pandas as pd
from pathlib import Path
from typing import List, Dict, Any, Optional, Set
import logging

# Ensure project root is on sys.path for app imports
_PROJECT_ROOT = str(Path(__file__).resolve().parent.parent)
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

from app.recommender import build_recommender

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def precision_at_k(recommended: List[str], relevant: Set[str], k: int = 5) -> float:
    """Compute Precision@K."""
    recommended_k = recommended[:k]
    if not recommended_k:
        return 0.0
    relevant_count = sum(1 for r in recommended_k if r in relevant)
    return relevant_count / len(recommended_k)


def recall_at_k(recommended: List[str], relevant: Set[str], k: int = 5) -> float:
    """Compute Recall@K."""
    recommended_k = recommended[:k]
    if not relevant:
        return 0.0
    relevant_count = sum(1 for r in recommended_k if r in relevant)
    return relevant_count / len(relevant)


def dcg_at_k(relevances: List[float], k: int) -> float:
    """Compute DCG@K."""
    relevances = relevances[:k]
    dcg = sum(rel / np.log2(i + 2) for i, rel in enumerate(relevances))
    return dcg


def ndcg_at_k(recommended_relevances: List[float], k: int) -> float:
    """Compute NDCG@K."""
    actual_dcg = dcg_at_k(recommended_relevances, k)
    ideal_dcg = dcg_at_k(sorted(recommended_relevances, reverse=True), k)
    if ideal_dcg == 0:
        return 0.0
    return actual_dcg / ideal_dcg


def average_precision(recommended: List[str], relevant: Set[str]) -> float:
    """Compute Average Precision."""
    if not relevant:
        return 0.0
    
    score = 0.0
    hits = 0
    for i, rec in enumerate(recommended):
        if rec in relevant:
            hits += 1
            score += hits / (i + 1)
    
    if hits == 0:
        return 0.0
    return score / len(relevant)


def compute_diversity_score(products_df: pd.DataFrame, product_ids: List[str]) -> float:
    """Compute diversity based on ingredient Jaccard similarity."""
    if len(product_ids) < 2:
        return 1.0
    
    products = products_df[products_df['product_id'].isin(product_ids)]
    
    # Compute pairwise ingredient similarity
    similarities = []
    items = products['ingredients_normalized'].tolist()
    
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if isinstance(items[i], list) and isinstance(items[j], list):
                set_i = set(str(x).lower() for x in items[i])
                set_j = set(str(x).lower() for x in items[j])
                if set_i or set_j:
                    union = len(set_i | set_j)
                    intersection = len(set_i & set_j)
                    similarity = intersection / union if union > 0 else 0
                    similarities.append(similarity)
    
    if not similarities:
        return 1.0
    
    # Lower similarity = higher diversity
    avg_similarity = np.mean(similarities)
    return 1.0 - avg_similarity


def get_relevant_products(products_df: pd.DataFrame, profile: Dict[str, Any]) -> Set[str]:
    """
    Get set of relevant product IDs for a profile.
    
    A product is considered relevant if:
    - It matches the category (if specified)
    - It contains at least one expected relevant ingredient
    - OR it matches the skin type/concerns
    """
    relevant_ids = set()
    
    for _, row in products_df.iterrows():
        is_relevant = True
        
        # Category filter
        if profile.get('category'):
            if row['category'] != profile['category']:
                continue
        
        # Budget filter
        if profile.get('budget') is not None:
            if row['price_usd'] > profile['budget']:
                continue
        
        # Ingredient match
        expected_ingredients = profile.get('expected_relevant_ingredients', [])
        product_ingredients = [str(i).lower() for i in row['ingredients_normalized']] if isinstance(row['ingredients_normalized'], list) else []
        
        ingredient_match = any(
            expected in ingredient 
            for expected in expected_ingredients 
            for ingredient in product_ingredients
        )
        
        # Skin type/concern match
        skin_types = row['skin_types'] if isinstance(row['skin_types'], list) else []
        skin_type_match = profile.get('skin_type') in skin_types or 'all' in skin_types
        
        concerns = row['skin_concerns'] if isinstance(row['skin_concerns'], list) else []
        concern_match = any(c in concerns for c in profile.get('concerns', []))
        
        if ingredient_match or (skin_type_match and concern_match):
            relevant_ids.add(row['product_id'])
    
    return relevant_ids


def evaluate_profile(
    recommender,
    products_df: pd.DataFrame,
    profile: Dict[str, Any],
    k: int = 5
) -> Dict[str, float]:
    """Evaluate a single user profile."""
    # Get recommended products
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
    
    recommended_ids = [rec['product_id'] for rec in result['recommendations']]
    
    # Get relevant products
    relevant_ids = get_relevant_products(products_df, profile)
    
    # Compute metrics
    precision = precision_at_k(recommended_ids, relevant_ids, k)
    recall = recall_at_k(recommended_ids, relevant_ids, k)
    ap = average_precision(recommended_ids, relevant_ids)
    
    # Compute relevances for NDCG
    relevances = [1.0 if pid in relevant_ids else 0.0 for pid in recommended_ids]
    ndcg = ndcg_at_k(relevances, k)
    
    # Compute diversity
    diversity = compute_diversity_score(products_df, recommended_ids)
    
    return {
        'precision_at_k': precision,
        'recall_at_k': recall,
        'ndcg_at_k': ndcg,
        'average_precision': ap,
        'diversity': diversity,
        'latency': latency,
        'num_recommended': len(recommended_ids),
        'is_fallback': result.get('is_fallback', False)
    }


def compute_coverage(products_df: pd.DataFrame, all_recommended_ids: List[str]) -> float:
    """Compute catalog coverage."""
    total_products = len(products_df)
    unique_recommended = len(set(all_recommended_ids))
    return unique_recommended / total_products if total_products > 0 else 0


def run_evaluation(
    products_path: str,
    model_path: str,
    profiles_path: str,
    output_dir: str,
    k: int = 5,
    num_runs: int = 3
) -> Dict[str, Any]:
    """Run full evaluation."""
    logger.info("Loading recommender...")
    recommender = build_recommender(products_path, model_path)
    products_df = pd.read_parquet(products_path)
    
    logger.info(f"Loading test profiles from {profiles_path}...")
    with open(profiles_path) as f:
        profiles = json.load(f)
    
    logger.info(f"Running evaluation with {len(profiles)} profiles, {num_runs} runs each...")
    
    all_results = []
    all_recommended_ids = []
    all_latencies = []
    
    for profile in profiles:
        profile_metrics = []
        
        for run in range(num_runs):
            metrics = evaluate_profile(recommender, products_df, profile, k)
            profile_metrics.append(metrics)
            all_recommended_ids.extend([
                rec['product_id'] 
                for rec in recommender.recommend(
                    skin_type=profile.get('skin_type'),
                    concerns=profile.get('concerns'),
                    category=profile.get('category'),
                    budget=profile.get('budget'),
                    preferred_ingredients=profile.get('preferred_ingredients'),
                    avoid_ingredients=profile.get('avoid_ingredients'),
                    top_k=k
                )['recommendations']
            ])
            all_latencies.append(metrics['latency'])
        
        # Average metrics for this profile
        avg_metrics = {
            key: np.mean([m[key] for m in profile_metrics])
            for key in ['precision_at_k', 'recall_at_k', 'ndcg_at_k', 'average_precision', 'diversity', 'latency']
        }
        avg_metrics['profile_id'] = profile['profile_id']
        avg_metrics['profile_name'] = profile['name']
        avg_metrics['is_fallback'] = any(m['is_fallback'] for m in profile_metrics)
        
        all_results.append(avg_metrics)
        logger.info(f"Profile: {profile['name']} - Precision@{k}: {avg_metrics['precision_at_k']:.3f}, NDCG@{k}: {avg_metrics['ndcg_at_k']:.3f}")
    
    # Compute aggregate metrics
    coverage = compute_coverage(products_df, all_recommended_ids)
    avg_latency = np.mean(all_latencies)
    p95_latency = np.percentile(all_latencies, 95)
    
    aggregate_metrics = {
        'k': k,
        'num_profiles': len(profiles),
        'num_runs': num_runs,
        'avg_precision_at_k': np.mean([r['precision_at_k'] for r in all_results]),
        'avg_recall_at_k': np.mean([r['recall_at_k'] for r in all_results]),
        'avg_ndcg_at_k': np.mean([r['ndcg_at_k'] for r in all_results]),
        'avg_map_at_k': np.mean([r['average_precision'] for r in all_results]),
        'avg_diversity': np.mean([r['diversity'] for r in all_results]),
        'catalog_coverage': coverage,
        'avg_latency_ms': avg_latency * 1000,
        'p95_latency_ms': p95_latency * 1000,
        'num_fallbacks_used': sum(1 for r in all_results if r['is_fallback'])
    }
    
    evaluation_report = {
        'aggregate_metrics': aggregate_metrics,
        'profile_results': all_results
    }
    
    # Save results
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    with open(output_path / 'evaluation_results.json', 'w') as f:
        json.dump(evaluation_report, f, indent=2)
    
    # Save human-readable report
    with open(output_path / 'evaluation_report.txt', 'w') as f:
        f.write("=" * 60 + "\n")
        f.write("ORBO BEAUTY AI - RECOMMENDATION EVALUATION REPORT\n")
        f.write("=" * 60 + "\n\n")
        
        f.write("AGGREGATE METRICS\n")
        f.write("-" * 40 + "\n")
        f.write(f"Number of test profiles: {aggregate_metrics['num_profiles']}\n")
        f.write(f"Number of runs per profile: {aggregate_metrics['num_runs']}\n")
        f.write(f"Top-K recommendations: {k}\n\n")
        
        f.write(f"Precision@{k}:    {aggregate_metrics['avg_precision_at_k']:.4f}\n")
        f.write(f"Recall@{k}:    {aggregate_metrics['avg_recall_at_k']:.4f}\n")
        f.write(f"NDCG@{k}:    {aggregate_metrics['avg_ndcg_at_k']:.4f}\n")
        f.write(f"MAP@{k}:    {aggregate_metrics['avg_map_at_k']:.4f}\n")
        f.write(f"Diversity:    {aggregate_metrics['avg_diversity']:.4f}\n")
        f.write(f"Coverage:    {aggregate_metrics['catalog_coverage']:.4f}\n\n")
        
        f.write(f"Avg Latency:  {aggregate_metrics['avg_latency_ms']:.2f} ms\n")
        f.write(f"P95 Latency:  {aggregate_metrics['p95_latency_ms']:.2f} ms\n\n")
        
        f.write(f"Fallbacks used in {aggregate_metrics['num_fallbacks_used']} profiles\n\n")
        
        f.write("PER-PROFILE RESULTS\n")
        f.write("-" * 40 + "\n")
        for result in all_results:
            f.write(f"\nProfile: {result['profile_name']}\n")
            f.write(f"  Precision@{k}: {result['precision_at_k']:.3f}\n")
            f.write(f"  Recall@{k}:    {result['recall_at_k']:.3f}\n")
            f.write(f"  NDCG@{k}:      {result['ndcg_at_k']:.3f}\n")
            f.write(f"  Diversity:    {result['diversity']:.3f}\n")
            f.write(f"  Fallback:     {'Yes' if result['is_fallback'] else 'No'}\n")
    
    logger.info(f"Evaluation complete. Results saved to {output_path}")
    return evaluation_report


if __name__ == '__main__':
    import sys
    
    products_path = sys.argv[1] if len(sys.argv) > 1 else 'data/processed/products_processed.parquet'
    model_path = sys.argv[2] if len(sys.argv) > 2 else 'data/processed/content_model.joblib'
    profiles_path = sys.argv[3] if len(sys.argv) > 3 else 'evaluation/test_profiles.json'
    output_dir = sys.argv[4] if len(sys.argv) > 4 else 'evaluation/results'
    
    report = run_evaluation(products_path, model_path, profiles_path, output_dir)
    
    print("\n" + "=" * 50)
    print("EVALUATION SUMMARY")
    print("=" * 50)
    print(json.dumps(report['aggregate_metrics'], indent=2))