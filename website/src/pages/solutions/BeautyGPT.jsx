import React, { useState } from 'react';
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

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const newMsg = { sender: 'user', text: inputVal };
    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `I analyzed your request: "${inputVal}". Based on ingredient safety profiles and formulation compatibility, I recommend a soothing Ceramide & Hyaluronic acid moisturizer with zero added fragrances.`
        }
      ]);
    }, 800);
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
