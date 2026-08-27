import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';

const articles = [
  {
    id: 1,
    title: 'How Can AI Be Used in the Beauty Industry? Steps to Implement',
    excerpt: 'Beauty brands are competing in a market where consumer preferences shift fast. Discover the technical and commercial roadmap to deploying Visual AI in 2026.',
    category: 'Industry Trends',
    readTime: '10 min read',
    date: 'Aug 14, 2026',
    author: 'Team Orbo',
    featured: true,
    href: 'https://blog.orbo.ai/',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'How to Integrate a Skincare API for Modern D2C Brands',
    excerpt: 'A comprehensive engineering guide on leveraging computer vision endpoints to diagnose skin hydration, texture, and acne severity directly inside your mobile application.',
    category: 'Developer Guide',
    readTime: '7 min read',
    date: 'Jul 30, 2026',
    author: 'Danish Jamil',
    href: 'https://blog.orbo.ai/',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'Why Virtual Makeup SDK Is a Must for E-Commerce Conversion',
    excerpt: 'Analyzing real-world e-commerce metrics: how photorealistic AR try-on reduced lipstick return rates by 42% and boosted Average Order Value across 50+ cosmetics stores.',
    category: 'Case Study',
    readTime: '6 min read',
    date: 'Jul 10, 2026',
    author: 'Manoj Shinde',
    href: 'https://blog.orbo.ai/',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 4,
    title: 'Smart Beauty Mirror with Skin Analyzer: The Future of In-Store Retail',
    excerpt: 'How brick-and-mortar retail stores are reinventing the cosmetic counter with touchless smart mirror kiosks that bridge offline testing with digital mobile checkouts.',
    category: 'Retail Tech',
    readTime: '8 min read',
    date: 'Jun 18, 2026',
    author: 'Abhit Sinha',
    href: 'https://blog.orbo.ai/',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 5,
    title: 'The Science of Sub-Strand Hair Segmentation in AR',
    excerpt: 'Deep dive into convolutional neural networks and spatial edge detection algorithms that isolate individual hair strands without face-boundary bleeding.',
    category: 'AI Research',
    readTime: '12 min read',
    date: 'May 22, 2026',
    author: 'Team Orbo',
    href: 'https://blog.orbo.ai/',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 6,
    title: 'Green AI: Why On-Device Vision Outperforms Cloud Infrastructure',
    excerpt: 'Eliminating recurring GPU server costs and prioritizing edge inference creates faster experiences, reduces carbon emissions, and ensures strict GDPR compliance.',
    category: 'Sustainability',
    readTime: '5 min read',
    date: 'Apr 9, 2026',
    author: 'Team Orbo',
    href: 'https://blog.orbo.ai/',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&q=80'
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
            <a
              href={featured.href}
              target="_blank"
              rel="noopener noreferrer"
              className="featured-card"
              style={{ textDecoration: 'none', display: 'flex' }}
            >
              <div className="featured-card__graphic">
                <div className="featured-badge">Featured Story</div>
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="featured-real-img"
                />
              </div>
              <div className="featured-card__content">
                <span className="blog-cat">{featured.category}</span>
                <h2 className="featured-title">{featured.title}</h2>
                <p className="featured-desc">{featured.excerpt}</p>
                <div className="blog-meta">
                  <span>{featured.author}</span>
                  <span>•</span>
                  <span>{featured.date}</span>
                  <span>•</span>
                  <span>{featured.readTime}</span>
                </div>
                <span className="featured-read-link">Read Article →</span>
              </div>
            </a>
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
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="article-card"
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
              >
                <div className="article-card__img">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
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
                <span className="article-read-more">Read more →</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
