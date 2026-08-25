import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container-lg">
        {/* Addresses */}
        <div className="footer__addresses">
          <div className="footer__address">
            <h4 className="footer__address-city">Mumbai</h4>
            <p>1101-1102, 86 Central by Crystal Group<br />
            Andheri Ghatkopar Link Rd,<br />
            Ghatkopar West, Mumbai - 400086,<br />
            Maharashtra</p>
          </div>
          <div className="footer__address">
            <h4 className="footer__address-city">Noida</h4>
            <p>1904, Etherea, 19th Floor, Tower-B,<br />
            Bhutani Alphathum,<br />
            Sector-90, Noida,<br />
            Uttar Pradesh - 201305</p>
          </div>
        </div>

        {/* Contact */}
        <div className="footer__contact">
          <a href="mailto:support@orbo.ai">support@orbo.ai</a>
          <span className="footer__contact-divider">|</span>
          <a href="tel:+919082125754">+91 90821 25754</a>
        </div>

        {/* Links Grid */}
        <div className="footer__links">
          <div className="footer__links-col">
            <h5 className="footer__links-title">Explore</h5>
            <Link to="/beautygpt">BeautyGPT API</Link>
            <Link to="/about-us">About Us</Link>
            <Link to="/technology">Technology</Link>
            <a href="https://blog.orbo.ai/" target="_blank" rel="noopener noreferrer">Blog</a>
            <a href="https://supertouch.app.link/TryOurApp" target="_blank" rel="noopener noreferrer">Experience SuperTouch</a>
          </div>
          <div className="footer__links-col">
            <h5 className="footer__links-title">Solutions</h5>
            <Link to="/virtual-makeup">Virtual Makeup</Link>
            <Link to="/virtual-haircolor">Virtual Hair Color</Link>
            <Link to="/virtual-hairstyle">Virtual Hair Styling</Link>
            <Link to="/foundation-shadefinder">Foundation Shade Finder</Link>
            <Link to="/smart-skinanalysis">Smart Skin Analysis</Link>
            <Link to="/facial-attributes">Facial Attributes Enhancement</Link>
            <Link to="/smart-beautymirror">Smart Beauty Mirror</Link>
            <Link to="/beautygpt">BeautyGPT</Link>
          </div>
          <div className="footer__links-col">
            <h5 className="footer__links-title">Legal</h5>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/cookie">Cookie Policy</Link>
            <Link to="/refund">Refund & Cancellation Policy</Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer__bottom">
          <p>© Copyright 2025. All rights reserved. Orbo AI.</p>
          <p className="footer__bottom-sub">A product of Modaviti eMarketing pvt ltd.</p>
        </div>
      </div>
    </footer>
  );
}
