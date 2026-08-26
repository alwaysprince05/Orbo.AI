import { Link } from 'react-router-dom';
import './Footer.css';

const YEAR = new Date().getFullYear();

const socialLinks = [
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/orboai/', icon: 'in' },
  { label: 'Twitter/X', href: 'https://twitter.com/orboai',               icon: '𝕏' },
  { label: 'Instagram', href: 'https://www.instagram.com/orbo.ai/',        icon: '◎' },
  { label: 'YouTube',   href: 'https://www.youtube.com/@orboai',           icon: '▶' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container-lg">

        {/* Top row: brand + social */}
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__logo">
              <span className="footer__logo-bracket">「</span>ORBO<span className="footer__logo-bracket">」</span>
            </span>
            <p className="footer__tagline">
              On-device Visual AI for the global beauty industry.
            </p>
            <div className="footer__social">
              {socialLinks.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-btn"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="footer__links">
            <div className="footer__links-col">
              <h5 className="footer__links-title">Explore</h5>
              <Link to="/recommend">✨ AI Recommender</Link>
              <Link to="/beautygpt">BeautyGPT API</Link>
              <Link to="/about-us">About Us</Link>
              <Link to="/technology">Technology</Link>
              <Link to="/blog">Blog</Link>
              <a href="https://supertouch.app.link/TryOurApp" target="_blank" rel="noopener noreferrer">
                SuperTouch App
              </a>
            </div>
            <div className="footer__links-col">
              <h5 className="footer__links-title">Solutions</h5>
              <Link to="/virtual-makeup">Virtual Makeup</Link>
              <Link to="/virtual-haircolor">Virtual Hair Color</Link>
              <Link to="/virtual-hairstyle">Virtual Hair Styling</Link>
              <Link to="/foundation-shadefinder">Foundation Shade Finder</Link>
              <Link to="/smart-skinanalysis">Smart Skin Analysis</Link>
              <Link to="/facial-attributes">Facial Attributes</Link>
              <Link to="/smart-beautymirror">Smart Beauty Mirror</Link>
              <Link to="/beautygpt">BeautyGPT</Link>
            </div>
            <div className="footer__links-col">
              <h5 className="footer__links-title">Legal</h5>
              <Link to="/terms">Terms & Conditions</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/cookie">Cookie Policy</Link>
              <Link to="/refund">Refund Policy</Link>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="footer__addresses">
          <div className="footer__address">
            <h4 className="footer__address-city">📍 Mumbai</h4>
            <p>1101-1102, 86 Central by Crystal Group,<br />
            Andheri Ghatkopar Link Rd, Ghatkopar West,<br />
            Mumbai — 400086, Maharashtra</p>
          </div>
          <div className="footer__address">
            <h4 className="footer__address-city">📍 Noida</h4>
            <p>1904, Etherea, 19th Floor, Tower-B,<br />
            Bhutani Alphathum, Sector-90,<br />
            Noida — 201305, Uttar Pradesh</p>
          </div>
          <div className="footer__address">
            <h4 className="footer__address-city">📬 Contact</h4>
            <p>
              <a href="mailto:support@orbo.ai">support@orbo.ai</a><br />
              <a href="tel:+919082125754">+91 90821 25754</a>
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p>© {YEAR} Orbo AI · All rights reserved.</p>
          <p className="footer__bottom-sub">A product of Modaviti eMarketing Pvt. Ltd.</p>
        </div>
      </div>
    </footer>
  );
}
