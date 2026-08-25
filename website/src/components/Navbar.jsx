import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const solutionLinks = [
  { name: 'Virtual Makeup', path: '/virtual-makeup' },
  { name: 'Virtual Hair Color', path: '/virtual-haircolor' },
  { name: 'Virtual Hair Styling', path: '/virtual-hairstyle' },
  { name: 'Foundation Shade Finder', path: '/foundation-shadefinder' },
  { name: 'Smart Skin Analysis', path: '/smart-skinanalysis' },
  { name: 'Facial Attributes Enhancement', path: '/facial-attributes' },
  { name: 'Smart Beauty Mirror', path: '/smart-beautymirror' },
  { name: 'BeautyGPT', path: '/beautygpt' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsSolutionsOpen(false);
  }, [location]);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsSolutionsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsSolutionsOpen(false), 200);
  };

  const isActive = (path) => location.pathname === path;
  const isSolutionActive = solutionLinks.some(s => location.pathname === s.path);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-bracket">「</span>
          <span className="navbar__logo-text">ORBO</span>
          <span className="navbar__logo-bracket">」</span>
        </Link>

        {/* Product Pills */}
        <div className="navbar__pills">
          <a href="https://beautygpt.orbo.ai/" target="_blank" rel="noopener noreferrer" className="navbar__pill navbar__pill--default">
            BeautyGPT
          </a>
          <a href="https://www.orbo.ai/beautygpt-api-for-beauty-brands" target="_blank" rel="noopener noreferrer" className="navbar__pill navbar__pill--business">
            Business
          </a>
        </div>

        {/* Desktop Nav */}
        <div className="navbar__links">
          <Link to="/" className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}>
            Home
          </Link>
          <Link to="/about-us" className={`navbar__link ${isActive('/about-us') ? 'navbar__link--active' : ''}`}>
            About Us
          </Link>
          <div
            className="navbar__dropdown"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className={`navbar__link navbar__link--dropdown ${isSolutionActive ? 'navbar__link--active' : ''}`}>
              Solutions
              <svg className={`navbar__dropdown-arrow ${isSolutionsOpen ? 'navbar__dropdown-arrow--open' : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className={`navbar__dropdown-menu ${isSolutionsOpen ? 'navbar__dropdown-menu--open' : ''}`}>
              <div className="navbar__dropdown-grid">
                {solutionLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`navbar__dropdown-item ${isActive(link.path) ? 'navbar__dropdown-item--active' : ''}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link to="/technology" className={`navbar__link ${isActive('/technology') ? 'navbar__link--active' : ''}`}>
            Technology
          </Link>
          <a href="https://blog.orbo.ai/" target="_blank" rel="noopener noreferrer" className="navbar__link">
            Blog
          </a>
        </div>

        {/* CTA */}
        <Link to="/#requestDemo" className="navbar__cta">
          Request Demo
        </Link>

        {/* Mobile Toggle */}
        <button
          className={`navbar__hamburger ${isMobileOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${isMobileOpen ? 'navbar__mobile--open' : ''}`}>
        <Link to="/" className="navbar__mobile-link">Home</Link>
        <Link to="/about-us" className="navbar__mobile-link">About Us</Link>
        <button
          className="navbar__mobile-link navbar__mobile-link--dropdown"
          onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
        >
          Solutions
          <svg className={`navbar__dropdown-arrow ${isSolutionsOpen ? 'navbar__dropdown-arrow--open' : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {isSolutionsOpen && (
          <div className="navbar__mobile-submenu">
            {solutionLinks.map((link) => (
              <Link key={link.path} to={link.path} className="navbar__mobile-sublink">
                {link.name}
              </Link>
            ))}
          </div>
        )}
        <Link to="/technology" className="navbar__mobile-link">Technology</Link>
        <a href="https://blog.orbo.ai/" target="_blank" rel="noopener noreferrer" className="navbar__mobile-link">Blog</a>
        <Link to="/#requestDemo" className="navbar__mobile-cta btn btn-primary">
          Request Demo
        </Link>
      </div>
    </nav>
  );
}
