import React, { useState, useEffect, useRef } from 'react';
import ContactForm from '../../components/ContactForm';
import './SolutionsCommon.css';

const sampleMessages = [
  { sender: 'bot', text: 'Hello! I am BeautyGPT. Upload a selfie or describe your skin concerns, and I will craft a personalized beauty regimen.' },
  { sender: 'user', text: 'I have dry skin with mild acne around my chin and want a budget-friendly morning routine.' },
  { sender: 'bot', text: 'Based on your profile, here is your 3-step AM routine: 1. CeraVe Hydrating Cleanser ($14.99), 2. The Ordinary Niacinamide 10% + Zinc 1% ($6.50), 3. La Roche-Posay Toleriane Double Repair with SPF 30 ($21.99). All non-comedogenic and barrier-strengthening!' }
];

export default function BeautyGPT() {
  const [messages, setMessages] = useState(sampleMessages);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const userText = inputVal.trim();
    const newMsg = { sender: 'user', text: userText };
    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    // Context-aware response engine
    const lower = userText.toLowerCase();
    let reply = '';

    if (/dry|flaky|tight|dehydrat/.test(lower)) {
      reply = 'For dry skin, focus on humectants and occlusives. I recommend: 1. CeraVe Moisturising Cream ($20) with ceramides + hyaluronic acid, 2. The Ordinary Hyaluronic Acid 2% + B5 ($8), and 3. Weleda Skin Food as an overnight barrier repair ($19). Avoid harsh cleansers with sulfates.';
    } else if (/oily|acne|breakout|pore|blemish/.test(lower)) {
      reply = 'For oily/acne-prone skin: 1. The Ordinary Niacinamide 10% + Zinc 1% ($6.50) — controls sebum, 2. La Roche-Posay Effaclar Duo ($26) — unclogs pores, 3. Paula\'s Choice BHA Exfoliant ($34) — weekly use. Avoid heavy creams and comedogenic oils.';
    } else if (/aging|wrinkle|fine line|retinol|peptide/.test(lower)) {
      reply = 'For anti-aging: 1. The Ordinary Buffet Serum ($15) — multi-peptide complex, 2. Medik8 C-Tetra Serum ($44) — vitamin C for collagen, 3. Estée Lauder Advanced Night Repair ($66) — overnight repair. Apply SPF daily — it\'s the most effective anti-aging step.';
    } else if (/sensitive|redness|react|rosacea|calm/.test(lower)) {
      reply = 'For sensitive skin: 1. La Roche-Posay Toleriane Double Repair ($23) — prebiotic formula, 2. Avène Thermal Spring Water Spray ($12) — instant soothing, 3. Weleda Sensitive Care Serum ($30) — fragrance-free. Patch test every new product and avoid fragrance, essential oils, and high-strength acids.';
    } else if (/pigment|dark spot|bright|glow|uneven/.test(lower)) {
      reply = 'For pigmentation and glow: 1. The Ordinary Alpha Arbutin 2% + HA ($10), 2. Good Molecules Discoloration Correcting Serum ($12), 3. Clinique Even Better Tone Correcting Serum ($55). Always pair with SPF 50+ — UV exposure worsens pigmentation significantly.';
    } else if (/spf|sunscreen|sun|uv/.test(lower)) {
      reply = 'Best SPFs I recommend: 1. La Roche-Posay Anthelios SPF 50+ ($22) — lightweight, 2. CeraVe Facial Moisturising Lotion SPF 25 ($16.50) — daily use, 3. Supergoop! Unseen Sunscreen SPF 40 ($38) — invisible finish. Apply 2 fingers worth every 2–3 hours outdoors.';
    } else if (/budget|cheap|affordable/.test(lower)) {
      reply = 'Best budget skincare under $15: 1. The Ordinary Niacinamide ($6.50), 2. CeraVe Hydrating Cleanser ($10), 3. Neutrogena Hydro Boost Gel ($15). All clinically validated, fragrance-free, and beginner-friendly.';
    } else if (/ingredient|ceramide|niacinamide|retinol|vitamin c|hyaluronic/.test(lower)) {
      reply = 'Great question on ingredients! Ceramides rebuild the skin barrier. Niacinamide (10%) controls oil and fades dark spots. Hyaluronic Acid draws moisture into skin. Retinol (start at 0.025%) speeds cell turnover for anti-aging. Vitamin C (10–20% L-Ascorbic Acid) brightens and protects. Never layer vitamin C with retinol in the same routine.';
    } else if (/routine|morning|night|am|pm|step/.test(lower)) {
      reply = `Here's a complete AM/PM routine: AM: Cleanser → Vitamin C serum → Moisturiser → SPF 50. PM: Oil cleanser (double cleanse if wearing makeup) → Toner → Active (retinol or acid, not both) → Moisturiser → Occlusive if very dry. Start simple — 3 steps is better than 12 steps used inconsistently.`;
    } else {
      reply = `Thanks for your question! Based on "${userText}", I'd recommend starting with your skin type and primary concern. Our AI Recommender at /recommend can scan 1,581 real products and rank the best matches for your exact profile with full ingredient explanations. Want me to explain any specific ingredient or concern in more detail?`;
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="solution-page">
      <section className="solution-hero" style={{ background: 'linear-gradient(135deg, #FAC4DE 0%, #B5A9FF 50%, #FEBBAD 100%)' }}>
        <div className="container-lg">
          <div className="solution-hero-grid">
            <div>
              <span className="solution-hero-badge">BEAUTYGPT ENTERPRISE</span>
              <h1 className="solution-hero-title">Generative AI Beauty Advisor & API</h1>
              <p className="solution-hero-desc">
                Supercharge your beauty brand with a multi-modal conversational AI agent. Combines computer vision skin scans, INCI ingredient databases, and large language models for personalized customer advice.
              </p>
              <a href="https://beautygpt.orbo.ai/" target="_blank" rel="noopener noreferrer" className="solution-cta-btn">
                Launch BeautyGPT Web App →
              </a>
            </div>

            {/* Live Chat Simulator */}
            <div className="simulator-box">
              <div className="simulator-header">
                <span className="sim-title">🤖 BeautyGPT Live Consultation</span>
                <span className="sim-badge">LLM + Vision v4</span>
              </div>

              <div style={{
                height: '240px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '10px',
                background: '#FAFAFA',
                borderRadius: '12px',
                marginBottom: '12px'
              }}>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      background: m.sender === 'user' ? '#FF2E63' : '#FFF',
                      color: m.sender === 'user' ? '#FFF' : '#09121D',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      lineHeight: '1.4',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}
                  >
                    {m.text}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Ask BeautyGPT about products or ingredients..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '9999px',
                    border: '1.5px solid #E0E0E0',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#09121D',
                    color: '#FFF',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Conversational Intelligence</span>
            <h2 className="section-title">Why Beauty Brands Integrate BeautyGPT</h2>
            <p className="section-subtitle">
              Turn casual brand discovery into high-confidence checkout with 24/7 AI-guided product consultations.
            </p>
          </div>

          <div className="feature-cards-grid">
            <div className="feat-card">
              <div className="feat-icon">💬</div>
              <h3>Multi-Turn Conversational Memory</h3>
              <p>Understands user preferences, allergies, budgets, and climate to maintain personalized context.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">🧪</div>
              <h3>100,000+ INCI Ingredient Knowledge</h3>
              <p>Instantly explains active ingredients, contraindications, and synergistic skincare layering routines.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">🔌</div>
              <h3>Full REST API & SDK Webhook</h3>
              <p>Embed BeautyGPT into WhatsApp for Business, Mobile Apps, Shopify stores, and Instagram Direct.</p>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
