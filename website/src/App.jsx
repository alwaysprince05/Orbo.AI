import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// ── Lazy-load every page (code splitting) ──────────────────────────────────────
const Home                = lazy(() => import('./pages/Home'));
const AboutUs             = lazy(() => import('./pages/AboutUs'));
const Technology          = lazy(() => import('./pages/Technology'));
const Blog                = lazy(() => import('./pages/Blog'));
const Recommender         = lazy(() => import('./pages/Recommender'));
const NotFound            = lazy(() => import('./pages/NotFound'));

// Solutions
const VirtualMakeup       = lazy(() => import('./pages/solutions/VirtualMakeup'));
const VirtualHairColor    = lazy(() => import('./pages/solutions/VirtualHairColor'));
const VirtualHairStyling  = lazy(() => import('./pages/solutions/VirtualHairStyling'));
const FoundationShadeFinder = lazy(() => import('./pages/solutions/FoundationShadeFinder'));
const SmartSkinAnalysis   = lazy(() => import('./pages/solutions/SmartSkinAnalysis'));
const FacialAttributes    = lazy(() => import('./pages/solutions/FacialAttributes'));
const SmartBeautyMirror   = lazy(() => import('./pages/solutions/SmartBeautyMirror'));
const BeautyGPT           = lazy(() => import('./pages/solutions/BeautyGPT'));

// Legal
const Terms   = lazy(() => import('./pages/legal/Terms'));
const Privacy = lazy(() => import('./pages/legal/Privacy'));
const Cookie  = lazy(() => import('./pages/legal/Cookie'));
const Refund  = lazy(() => import('./pages/legal/Refund'));

// ── Page transition loader ─────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: '1rem',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid #f0e0e5', borderTopColor: '#ff3366',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Scroll-to-top with navbar offset ──────────────────────────────────────────
const NAVBAR_HEIGHT = 80;

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Retry up to 5 times to let lazy-loaded sections render
      let attempts = 0;
      const scroll = () => {
        const el = document.getElementById(hash.replace('#', ''));
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        } else if (++attempts < 5) {
          setTimeout(scroll, 200);
        }
      };
      setTimeout(scroll, 100);
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="app-layout">
      <ScrollToTop />
      <Navbar />
      <main className="page-content">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"                      element={<Home />} />
              <Route path="/about-us"              element={<AboutUs />} />
              <Route path="/technology"            element={<Technology />} />
              <Route path="/blog"                  element={<Blog />} />
              <Route path="/recommend"             element={<Recommender />} />

              {/* Solution routes */}
              <Route path="/virtual-makeup"        element={<VirtualMakeup />} />
              <Route path="/virtual-haircolor"     element={<VirtualHairColor />} />
              <Route path="/virtual-hairstyle"     element={<VirtualHairStyling />} />
              <Route path="/foundation-shadefinder" element={<FoundationShadeFinder />} />
              <Route path="/smart-skinanalysis"    element={<SmartSkinAnalysis />} />
              <Route path="/facial-attributes"     element={<FacialAttributes />} />
              <Route path="/smart-beautymirror"    element={<SmartBeautyMirror />} />
              <Route path="/beautygpt"             element={<BeautyGPT />} />

              {/* Legal */}
              <Route path="/terms"   element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookie"  element={<Cookie />} />
              <Route path="/refund"  element={<Refund />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
