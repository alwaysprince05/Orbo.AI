import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';

const articles = [
  {
    id: 1,
    title: 'How Can AI Be Used in the Beauty Industry? Steps to Implement',
    excerpt: 'Beauty brands are competing in a market where consumer preferences shift fast, and every click, swipe, or selfie can influence purchase decisions. Discover the technical and commercial roadmap to deploying Visual AI in 2025.',
    category: 'Industry Trends',
    readTime: '10 min read',
    date: 'Dec 8, 2025',
    author: 'Team Orbo',
    featured: true
  },
  {
    id: 2,
    title: 'How to Integrate a Skincare API for Modern D2C Brands',
    excerpt: 'A comprehensive engineering guide on leveraging computer vision endpoints to diagnose skin hydration, texture, and acne severity directly inside your mobile application.',
    category: 'Developer Guide',
    readTime: '7 min read',
    date: 'Nov 24, 2025',
    author: 'Danish Jamil'
  },
  {
    id: 3,
    title: 'Why Virtual Makeup SDK Is a Must for E-Commerce Conversion',
    excerpt: 'Analyzing real-world e-commerce metrics: how photorealistic AR try-on reduced lipstick return rates by 42% and boosted Average Order Value across 50+ cosmetics stores.',
    category: 'Case Study',
    readTime: '6 min read',
    date: 'Nov 12, 2025',
    author: 'Manoj Shinde'
  },
  {
    id: 4,
    title: 'Smart Beauty Mirror with Skin Analyzer: The Future of In-Store Retail',
    excerpt: 'How brick-and-mortar retail stores are reinventing the cosmetic counter with touchless smart mirror kiosks that bridge offline testing with digital mobile checkouts.',
    category: 'Retail Tech',
    readTime: '8 min read',
    date: 'Oct 29, 2025',
    author: 'Abhit Sinha'
  },
  {
    id: 5,
    title: 'The Science of Sub-Strand Hair Segmentation in AR',
    excerpt: 'Deep dive into convolutional neural networks and spatial edge detection algorithms that isolate individual hair strands without face-boundary bleeding.',
    category: 'AI Research',
    readTime: '12 min read',
    date: 'Oct 15, 2025',
    author: 'Team Orbo'
  },
  {
    id: 6,
    title: 'Green AI: Why On-Device Computer Vision Outperforms Cloud Infrastructure',
    excerpt: 'Why eliminating recurring GPU server costs and prioritizing edge inference creates faster user experiences, reduces carbon emissions, and ensures strict GDPR compliance.',
    category: 'Sustainability',
    readTime: '5 min read',
    date: 'Sep 30, 2025',
    author: 'Team Orbo'
  }
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Industry Trends', 'Developer Guide', 'Case Study', 'Retail Tech', 'AI Research', 'Sustainability'];

  const filtered = selectedCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  const featured = articles.find(a => a.featured);

  return (
    <div className="blog-page">
      <section className="blog-hero">
        <div className="container-lg">
          <div className="text-center">
            <span className="blog-badge">Orbo Insights & Research</span>
            <h1 className="blog-hero-title">Beauty AI, AR & Computer Vision Blog</h1>
            <p className="blog-hero-subtitle">
              Deep dives, industry whitepapers, developer tutorials, and market analysis at the intersection of artificial intelligence and global cosmetics.
            </p>
          </div>
        </div>
      </section>

      <section className="section blog-content-section">
        <div className="container">
          {/* Featured Article Card */}
          {featured && selectedCategory === 'All' && (
            <div className="featured-card">
              <div className="featured-card__graphic">
                <div className="featured-badge">Featured Story</div>
                <div className="featured-visual-art">
                  <div className="art-circle"></div>
                  <span className="art-icon">✨ 💄 👁️</span>
                  <h3>How AI Is Reshaping Beauty Retail</h3>
                </div>
              </div>
              <div className="featured-card__content">
                <span className="blog-cat">{featured.category}</span>
                <h2 className="featured-title">{featured.title}</h2>
                <p className="featured-desc">{featured.excerpt}</p>
                <div className="blog-meta">
                  <span>✍️ {featured.author}</span>
                  <span>•</span>
                  <span>📅 {featured.date}</span>
                  <span>•</span>
                  <span>⏱️ {featured.readTime}</span>
                </div>
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="blog-categories">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-btn ${selectedCategory === cat ? 'cat-btn--active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="articles-grid">
            {filtered.map((item) => (
              <div key={item.id} className="article-card">
                <div className="article-card__header">
                  <span className="article-cat">{item.category}</span>
                  <span className="article-read">{item.readTime}</span>
                </div>
                <h3 className="article-title">{item.title}</h3>
                <p className="article-excerpt">{item.excerpt}</p>
                <div className="article-footer">
                  <span className="article-author">{item.author}</span>
                  <span className="article-date">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
