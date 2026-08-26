import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const solutionLinks = [
  { name: 'Virtual Makeup',              path: '/virtual-makeup' },
  { name: 'Virtual Hair Color',          path: '/virtual-haircolor' },
  { name: 'Virtual Hair Styling',        path: '/virtual-hairstyle' },
  { name: 'Foundation Shade Finder',     path: '/foundation-shadefinder' },
  { name: 'Smart Skin Analysis',         path: '/smart-skinanalysis' },
  { name: 'Facial Attributes Enhancement', path: '/facial-attributes' },
  { name: 'Smart Beauty Mirror',         path: '/smart-beautymirror' },
  { name: 'BeautyGPT Advisor',           path: '/beautygpt' },
];

const NAVBAR_HEIGHT = 80;

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export default function Navbar() {
  const [isScrolled,      setIsScrolled]      = useState(false);
  const [isMobileOpen,    setIsMobileOpen]    = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const dropdownRef = useRef(null);
  const timeoutRef  = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsSolutionsOpen(false);
  }, [location]);

  // Close mobile menu on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setIsMobileOpen(false); setIsSolutionsOpen(false); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleDropdownEnter = () => { clearTimeout(timeoutRef.current); setIsSolutionsOpen(true); };
  const handleDropdownLeave = () => { timeoutRef.current = setTimeout(() => setIsSolutionsOpen(false), 200); };

  // "Products & SKUs" navigates home then scrolls to #products
  const handleProductsClick = useCallback((e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      scrollToSection('products');
    } else {
      navigate('/');
      // scroll after navigation renders
      setTimeout(() => scrollToSection('products'), 350);
    }
  }, [location.pathname, navigate]);

  // "Request Demo" scrolls to contact form on any page
  const handleRequestDemo = useCallback((e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      scrollToSection('requestDemo');
    } else {
      navigate('/');
      setTimeout(() => scrollToSection('requestDemo'), 350);
    }
  }, [location.pathname, navigate]);

  const isActive = (path) => location.pathname === path;
  const isSolutionActive = solutionLinks.some(s => location.pathname === s.path);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">

        {/* Logo */}
        <Link to="/" className="navbar__logo" aria-label="Orbo AI — home">
          <span className="navbar__logo-bracket">「</span>
          <span className="navbar__logo-text">ORBO</span>
          <span className="navbar__logo-bracket">」</span>
        </Link>

        {/* Product pills */}
        <div className="navbar__pills">
          <a href="https://beautygpt.orbo.ai/" target="_blank" rel="noopener noreferrer"
            className="navbar__pill navbar__pill--default">
            ✨ BeautyGPT
          </a>
          <a href="https://www.orbo.ai/beautygpt-api-for-beauty-brands" target="_blank" rel="noopener noreferrer"
            className="navbar__pill navbar__pill--business">
            Enterprise
          </a>
        </div>

        {/* Desktop links */}
        <div className="navbar__links">
          <Link to="/" className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}>
            Home
          </Link>

          <Link to="/recommend"
            className={`navbar__link navbar__link--recommend ${isActive('/recommend') ? 'navbar__link--active' : ''}`}>
            ✨ AI Recommender
          </Link>

          {/* Products — smooth-scroll, no full-page reload */}
          <a href="/#products" className="navbar__link" onClick={handleProductsClick}>
            Products
          </a>

          {/* Solutions dropdown */}
          <div
            className="navbar__dropdown"
            ref={dropdownRef}
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              className={`navbar__link navbar__link--dropdown ${isSolutionActive ? 'navbar__link--active' : ''}`}
              aria-haspopup="true"
              aria-expanded={isSolutionsOpen}
              onClick={() => setIsSolutionsOpen(o => !o)}
            >
              Solutions
              <svg
                className={`navbar__dropdown-arrow ${isSolutionsOpen ? 'navbar__dropdown-arrow--open' : ''}`}
                width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div
              className={`navbar__dropdown-menu ${isSolutionsOpen ? 'navbar__dropdown-menu--open' : ''}`}
              role="menu">
              <div className="navbar__dropdown-grid">
                {solutionLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    role="menuitem"
                    className={`navbar__dropdown-item ${isActive(link.path) ? 'navbar__dropdown-item--active' : ''}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link to="/technology"
            className={`navbar__link ${isActive('/technology') ? 'navbar__link--active' : ''}`}>
            Technology
          </Link>
          <Link to="/about-us"
            className={`navbar__link ${isActive('/about-us') ? 'navbar__link--active' : ''}`}>
            About Us
          </Link>
          <Link to="/blog"
            className={`navbar__link ${isActive('/blog') ? 'navbar__link--active' : ''}`}>
            Blog
          </Link>
        </div>

        {/* CTA */}
        <a href="#requestDemo" className="navbar__cta" onClick={handleRequestDemo}>
          Request Demo
        </a>

        {/* Mobile hamburger */}
        <button
          className={`navbar__hamburger ${isMobileOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setIsMobileOpen(o => !o)}
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`navbar__mobile ${isMobileOpen ? 'navbar__mobile--open' : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
      >
        <Link to="/" className="navbar__mobile-link">Home</Link>
        <Link to="/recommend" className="navbar__mobile-link navbar__mobile-link--highlight">
          ✨ AI Recommender
        </Link>
        <a href="/#products" className="navbar__mobile-link" onClick={handleProductsClick}>
          Products
        </a>
        <button
          className="navbar__mobile-link navbar__mobile-link--dropdown"
          onClick={() => setIsSolutionsOpen(o => !o)}
          aria-expanded={isSolutionsOpen}
        >
          Solutions
          <svg
            className={`navbar__dropdown-arrow ${isSolutionsOpen ? 'navbar__dropdown-arrow--open' : ''}`}
            width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {isSolutionsOpen && (
          <div className="navbar__mobile-submenu" role="menu">
            {solutionLinks.map(link => (
              <Link key={link.path} to={link.path} className="navbar__mobile-sublink" role="menuitem">
                {link.name}
              </Link>
            ))}
          </div>
        )}
        <Link to="/technology"  className="navbar__mobile-link">Technology</Link>
        <Link to="/about-us"    className="navbar__mobile-link">About Us</Link>
        <Link to="/blog"        className="navbar__mobile-link">Blog</Link>
        <a
          href="#requestDemo"
          className="navbar__mobile-cta btn btn-primary"
          onClick={handleRequestDemo}
        >
          Request Demo
        </a>
      </div>
    </nav>
  );
}
