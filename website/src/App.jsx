import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SharkTankHeroBanner from './components/SharkTankHeroBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Technology from './pages/Technology';
import Blog from './pages/Blog';

// Solutions
import VirtualMakeup from './pages/solutions/VirtualMakeup';
import VirtualHairColor from './pages/solutions/VirtualHairColor';
import VirtualHairStyling from './pages/solutions/VirtualHairStyling';
import FoundationShadeFinder from './pages/solutions/FoundationShadeFinder';
import SmartSkinAnalysis from './pages/solutions/SmartSkinAnalysis';
import FacialAttributes from './pages/solutions/FacialAttributes';
import SmartBeautyMirror from './pages/solutions/SmartBeautyMirror';
import BeautyGPT from './pages/solutions/BeautyGPT';

// Legal
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Cookie from './pages/legal/Cookie';
import Refund from './pages/legal/Refund';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <div className="app-layout">
      <ScrollToTop />
      <SharkTankHeroBanner />
      <Navbar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/blog" element={<Blog />} />

          {/* Solution Routes */}
          <Route path="/virtual-makeup" element={<VirtualMakeup />} />
          <Route path="/virtual-haircolor" element={<VirtualHairColor />} />
          <Route path="/virtual-hairstyle" element={<VirtualHairStyling />} />
          <Route path="/foundation-shadefinder" element={<FoundationShadeFinder />} />
          <Route path="/smart-skinanalysis" element={<SmartSkinAnalysis />} />
          <Route path="/facial-attributes" element={<FacialAttributes />} />
          <Route path="/smart-beautymirror" element={<SmartBeautyMirror />} />
          <Route path="/beautygpt" element={<BeautyGPT />} />

          {/* Legal Routes */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookie" element={<Cookie />} />
          <Route path="/refund" element={<Refund />} />

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
