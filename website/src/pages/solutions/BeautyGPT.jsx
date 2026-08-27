import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../../components/ContactForm';
import './SolutionsCommon.css';
import './BeautyGPT.css';

// ── Knowledge base ─────────────────────────────────────────────────────────────

const QUICK_PROMPTS = [
  { label: 'Dry skin routine',       text: 'What is the best routine for dry skin?' },
  { label: 'Oily & acne',            text: 'I have oily skin with acne. What should I use?' },
  { label: 'Anti-aging',              text: 'Recommend anti-aging products with retinol and peptides' },
  { label: 'Sensitive skin',          text: 'My skin is sensitive and reactive. What is safe for me?' },
  { label: 'Brighten dark spots',     text: 'How to reduce pigmentation and get a brighter glow?' },
  { label: 'Best sunscreen',          text: 'What sunscreen should I use daily?' },
  { label: 'Budget picks under ₹1,500',  text: 'Recommend great skincare products under ₹1500' },
  { label: 'Ceramide vs Hyaluronic',  text: 'What is the difference between ceramide and hyaluronic acid?' },
];

function getReply(userText) {
  const t = userText.toLowerCase();

  if (/dry|flaky|tight|dehydrat|peel/.test(t))
    return {
      text: `For **dry skin**, your focus should be humectants + occlusives:

1. **CeraVe Moisturising Cream** (₹1,660) — ceramides + HA rebuild the skin barrier
2. **The Ordinary Hyaluronic Acid 2% + B5** (₹665) — draws water into skin
3. **Weleda Skin Food** (₹1,577) — overnight occlusive balm for very dry areas

Key rule: apply HA to damp skin, then seal with a cream. Avoid harsh sulfate cleansers.`,
      products: ['CeraVe', 'The Ordinary', 'Weleda'],
    };

  if (/oily|acne|breakout|pore|blemish|congested|blackhead/.test(t))
    return {
      text: `For **oily / acne-prone skin**:

1. **The Ordinary Niacinamide 10% + Zinc 1%** (₹540) — controls sebum, fades post-acne marks
2. **La Roche-Posay Effaclar Duo** (₹2,158) — unclogs pores, reduces active spots
3. **Paula's Choice 2% BHA Liquid Exfoliant** (₹2,822) — weekly use only

Avoid heavy creams and comedogenic oils. Use lightweight gel moisturisers. Never skip SPF.`,
      products: ['The Ordinary', 'La Roche-Posay', "Paula's Choice"],
    };

  if (/aging|wrinkle|fine line|firm|sagging|collagen|elastin/.test(t) || /retinol|peptide/.test(t))
    return {
      text: `For **anti-aging**:

1. **The Ordinary Buffet Serum** (₹1,245) — 11 peptide complexes for skin renewal
2. **Medik8 C-Tetra Serum** (₹3,652) — vitamin C for collagen synthesis
3. **Estée Lauder Advanced Night Repair** (₹5,478) — overnight cellular repair

Start retinol at 0.025% 2× per week to avoid purging. Always follow with SPF the next morning — UV is the #1 accelerant of visible aging.`,
      products: ['The Ordinary', 'Medik8', 'Estée Lauder'],
    };

  if (/sensitiv|redness|rosacea|react|sting|flush|calm|sooth/.test(t))
    return {
      text: `For **sensitive / reactive skin**:

1. **La Roche-Posay Toleriane Double Repair** (₹1,909) — prebiotic water, ceramide-3, repairs microbiome
2. **Avène Thermal Spring Water Spray** (₹996) — instant calming mist
3. **Weleda Sensitive Care Serum** (₹2,490) — fragrance-free, no essential oils

Patch test everything. Avoid fragrance, essential oils, high-strength acids, and anything with > 1 % retinol. Look for products with fewer than 10 ingredients.`,
      products: ['La Roche-Posay', 'Avène', 'Weleda'],
    };

  if (/pigment|dark spot|bright|glow|uneven|melanin|arbutin|kojic|vitamin c/.test(t))
    return {
      text: `For **pigmentation & glow**:

1. **The Ordinary Alpha Arbutin 2% + HA** (₹830) — inhibits melanin production
2. **Good Molecules Discoloration Correcting Serum** (₹996) — tranexamic acid + kojic acid
3. **Clinique Even Better Clinical Serum** (₹4,565) — proven to reduce dark spots in 4–6 weeks

SPF is non-negotiable — UV exposure re-triggers melanin production and undoes all brightening progress. Use SPF 50+ every single morning.`,
      products: ['The Ordinary', 'Good Molecules', 'Clinique'],
    };

  if (/spf|sunscreen|sun protect|uv|spf|broad spectrum/.test(t))
    return {
      text: `**Top sunscreen picks**:

1. **La Roche-Posay Anthelios SPF 50+** (₹1,826) — ultra-light, no white cast
2. **CeraVe Facial Moisturising Lotion SPF 25** (₹1,370) — all-in-one AM moisturiser
3. **Supergoop! Unseen Sunscreen SPF 40** (₹3,154) — invisible primer-like finish

Apply a teaspoon (2 finger widths) to face and neck. Reapply every 2–3 hours in direct sun. Mineral (zinc oxide / titanium dioxide) is gentler for sensitive skin.`,
      products: ['La Roche-Posay', 'CeraVe', 'Supergoop!'],
    };

  if (/budget|cheap|affordable|inexpensive|under \$|value/.test(t))
    return {
      text: `**Best skincare under ₹1,250**:

1. **The Ordinary Niacinamide 10% + Zinc** (₹540) — tackles oiliness, pores, dark spots
2. **CeraVe Hydrating Cleanser** (₹830) — gentle, barrier-safe, fragrance-free
3. **Neutrogena Hydro Boost Water Gel** (₹1,245) — oil-free HA moisturiser for all skin types

All three are clinically validated, widely available, and dermatologist-recommended. Great starting point for any routine.`,
      products: ['The Ordinary', 'CeraVe', 'Neutrogena'],
    };

  if (/ceramide|niacinamide|hyaluronic|vitamin c|retinol|aha|bha|pha|glycolic|lactic|salicylic|peptide|squalane|ingredient/.test(t))
    return {
      text: `**Ingredient guide**:

• **Ceramides** — rebuild the lipid skin barrier; ideal for dry, sensitive skin
• **Niacinamide** — controls sebum, fades dark spots, minimises pores; great for all types
• **Hyaluronic Acid** — humectant, draws water into skin; apply to damp skin
• **Vitamin C** — brightens, protects collagen, prevents UV damage; use AM only
• **Retinol** — speeds cell turnover, reduces wrinkles; start at 0.025%, PM only
• **AHA (glycolic/lactic)** — exfoliates surface cells; fades dullness and dark spots
• **BHA (salicylic)** — exfoliates inside pores; best for oily, acne-prone skin
• **Squalane** — lightweight plant-derived oil; works for all skin types including oily

Never layer Vitamin C + Retinol in the same routine. Use acids max 3× per week.`,
      products: [],
    };

  if (/routine|morning|night|am|pm|step|order|layer/.test(t))
    return {
      text: `**Complete AM / PM routine**:

**Morning (AM)**
1. Gentle cleanser
2. Vitamin C serum (antioxidant protection)
3. Moisturiser
4. SPF 50 (never skip)

**Evening (PM)**
1. Oil cleanser → foaming cleanser (double cleanse if wearing makeup / SPF)
2. Toner (optional, hydrating)
3. Active — retinol *or* an acid (never both on the same night)
4. Moisturiser
5. Occlusive (Vaseline / Aquaphor) if very dry

Start with 3 steps. Add actives one at a time. Give each new product 4–6 weeks before judging.`,
      products: [],
    };

  if (/cleanser|wash|foam|gel cleanser/.test(t))
    return {
      text: `**Best cleansers by skin type**:

• **Dry / sensitive** → CeraVe Hydrating Cleanser (₹830) — no-rinse milk formula
• **Oily / acne** → La Roche-Posay Effaclar Purifying Foaming Gel (₹1,660)
• **Combination** → Cetaphil Daily Facial Cleanser (₹996)
• **All types** → CeraVe Foaming Cleanser (₹1,079) — removes excess oil without stripping

Cleanse maximum twice daily. Over-cleansing strips the barrier and triggers more oil production.`,
      products: ['CeraVe', 'La Roche-Posay', 'Cetaphil'],
    };

  if (/toner|essence|mist|prep/.test(t))
    return {
      text: `**Toners worth using**:

1. **Thayers Witch Hazel Toner** (₹996) — pore-tightening, alcohol-free
2. **Klairs Supple Preparation Toner** (₹1,826) — deeply hydrating, barrier-friendly
3. **Paula's Choice 6% Mandelic Acid Toner** (₹2,241) — gentle exfoliation for dull skin

Modern toners are hydrating prep layers, not astringents. Avoid alcohol-heavy toners — they damage the barrier.`,
      products: ['Thayers', 'Klairs', "Paula's Choice"],
    };

  if (/eye|under eye|dark circle|puff|eye cream/.test(t))
    return {
      text: `**Eye area care**:

1. **The Ordinary Caffeine Solution 5%** (₹665) — reduces puffiness and dark circles
2. **CeraVe Eye Repair Cream** (₹1,411) — gentle, fragrance-free, ceramide formula
3. **Clinique All About Eyes Serum** (₹3,569) — clinically tested for dark circles

Eye skin is 40% thinner than facial skin. Use your ring finger to tap (never rub). Most anti-aging face serums work on the eye area too — you don't need a separate eye cream.`,
      products: ['The Ordinary', 'CeraVe', 'Clinique'],
    };

  if (/mask|clay|sheet mask|kaolin/.test(t))
    return {
      text: `**Face mask recommendations**:

• **Oily / congested** → Aztec Secret Indian Healing Clay (₹830) — pore-clearing
• **Dry / dull** → Fresh Rose Face Mask (₹3,735) — intensive hydration
• **All types** → The Ordinary AHA 30% + BHA 2% Peeling Solution (₹665) — 10 min chemical exfoliant

Use clay masks max 1–2× per week. Sheet masks are single-use — don't reapply or air-dry them on your face.`,
      products: ['Aztec Secret', 'Fresh', 'The Ordinary'],
    };

  // Default — still helpful, not generic
  return {
    text: `Thanks for your question! I can help with:

• **Skin concerns** — dry, oily, acne, sensitive, aging, pigmentation
• **Ingredient questions** — ceramide, niacinamide, retinol, vitamin C, HA, AHA/BHA
• **Routine building** — AM/PM steps, layering order, beginner guides
• **Product picks** — by budget, skin type, or specific concern
• **Category** — cleansers, serums, moisturisers, sunscreens, eye creams, masks

Try asking something like: *"What routine works for combination skin with acne?"* or *"What's the difference between AHA and BHA?"*

You can also use our **[AI Recommender](/recommend)** to search 1,581 real products ranked for your exact skin profile.`,
    products: [],
    isDefault: true,
  };
}

// ── Typing indicator ───────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="bgpt-message bgpt-message--bot">
      <div className="bgpt-avatar">AI</div>
      <div className="bgpt-bubble bgpt-bubble--bot bgpt-typing">
        <span /><span /><span />
      </div>
    </div>
  );
}

// ── Single message bubble ──────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isBot = msg.sender === 'bot';

  // Render **bold** markdown
  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i}>{p.slice(2, -2)}</strong>
        : p
    );
  };

  const lines = msg.text.split('\n');

  return (
    <div className={`bgpt-message ${isBot ? 'bgpt-message--bot' : 'bgpt-message--user'}`}>
      {isBot && <div className="bgpt-avatar">AI</div>}
      <div className={`bgpt-bubble ${isBot ? 'bgpt-bubble--bot' : 'bgpt-bubble--user'}`}>
        {lines.map((line, i) => (
          <p key={i} style={{ margin: '0 0 4px' }}>
            {renderText(line)}
          </p>
        ))}
        {msg.products?.length > 0 && (
          <div className="bgpt-product-chips">
            {msg.products.map((p) => (
              <span key={p} className="bgpt-product-chip">{p}</span>
            ))}
          </div>
        )}
      </div>
      {!isBot && <div className="bgpt-avatar bgpt-avatar--user">You</div>}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
const INITIAL_MESSAGES = [
  {
    sender: 'bot',
    text: `Hi! I'm **BeautyGPT** — your AI skincare advisor.

I can recommend products, explain ingredients, and build a personalized routine for your skin type.

Tell me about your skin concerns, or pick a quick topic below.`,
    products: [],
  },
];

export default function BeautyGPT() {
  const [messages,  setMessages]  = useState(INITIAL_MESSAGES);
  const [inputVal,  setInputVal]  = useState('');
  const [isTyping,  setIsTyping]  = useState(false);
  const chatEndRef  = useRef(null);
  const messagesRef = useRef(null);
  const inputRef    = useRef(null);

  // Auto-scroll messages container only (not the whole page)
  useEffect(() => {
    const el = messagesRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = useCallback((text) => {
    if (!text.trim() || isTyping) return;

    const userMsg = { sender: 'user', text: text.trim(), products: [] };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI thinking delay (400–900ms based on reply length)
    const reply = getReply(text);
    const delay = 400 + Math.min(reply.text.length * 0.8, 900);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', ...reply }]);
    }, delay);
  }, [isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputVal);
  };

  const handleQuickPrompt = (text) => {
    sendMessage(text);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setMessages(INITIAL_MESSAGES);
    setIsTyping(false);
    setInputVal('');
  };

  return (
    <div className="solution-page bgpt-page">

      {/* ── Hero ── */}
      <section
        className="solution-hero bgpt-hero"
        style={{ background: 'linear-gradient(135deg,#FAC4DE 0%,#B5A9FF 55%,#FEBBAD 100%)' }}
      >
        <div className="container-lg">
          <div className="bgpt-hero-inner">
            {/* Left — text */}
            <div className="bgpt-hero-text">
              <span className="solution-hero-badge">BEAUTYGPT ENTERPRISE</span>
              <h1 className="solution-hero-title">Generative AI Beauty Advisor</h1>
              <p className="solution-hero-desc">
                Multi-modal conversational AI that combines clinical skin analysis,
                100K+ INCI ingredient knowledge, and LLM reasoning to give
                dermatologist-level advice at scale.
              </p>
              <div className="bgpt-hero-actions">
                <a
                  href="https://beautygpt.orbo.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="solution-cta-btn"
                >
                  Launch Full BeautyGPT App ↗
                </a>
                <Link to="/recommend" className="bgpt-hero-secondary">
                  Try AI Product Recommender
                </Link>
              </div>
            </div>

            {/* Right — stats */}
            <div className="bgpt-stats-grid">
              {[
                { num: '100K+', label: 'INCI ingredients in knowledge base' },
                { num: '9',     label: 'Skin concern categories handled' },
                { num: '<1s',   label: 'Response latency (avg)' },
                { num: '24/7',  label: 'Always-on customer advisor' },
              ].map(s => (
                <div key={s.num} className="bgpt-stat">
                  <strong>{s.num}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Full chat section ── */}
      <section className="bgpt-chat-section">
        <div className="container">
          <div className="bgpt-layout">

            {/* Left sidebar — quick prompts */}
            <aside className="bgpt-sidebar">
              <div className="bgpt-sidebar-title">Quick Topics</div>
              <div className="bgpt-quick-list">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q.text}
                    className="bgpt-quick-btn"
                    onClick={() => handleQuickPrompt(q.text)}
                    disabled={isTyping}
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              <div className="bgpt-sidebar-divider" />

              <div className="bgpt-sidebar-title">Also try</div>
              <Link to="/recommend" className="bgpt-sidebar-link">
                AI Product Recommender
                <span>Search 1,581 real products</span>
              </Link>
              <a
                href="https://beautygpt.orbo.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="bgpt-sidebar-link"
              >
                Full BeautyGPT App
                <span>With camera skin scan</span>
              </a>
            </aside>

            {/* Chat window */}
            <div className="bgpt-window">

              {/* Chat header */}
              <div className="bgpt-window-header">
                <div className="bgpt-window-header-left">
                  <div className="bgpt-online-dot" />
                  <div>
                    <div className="bgpt-window-name">BeautyGPT Advisor</div>
                    <div className="bgpt-window-status">
                      {isTyping ? 'Typing…' : 'Online · Powered by Orbo AI'}
                    </div>
                  </div>
                </div>
                <button className="bgpt-clear-btn" onClick={handleClear} title="Clear chat">
                  ↺ Clear
                </button>
              </div>

              {/* Messages */}
              <div className="bgpt-messages" ref={messagesRef} role="log" aria-live="polite" aria-label="Chat messages">
                {messages.map((msg, i) => (
                  <MessageBubble key={i} msg={msg} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <form className="bgpt-input-row" onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  className="bgpt-input"
                  type="text"
                  placeholder="Ask about skin concerns, ingredients, routines…"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  disabled={isTyping}
                  autoComplete="off"
                  aria-label="Chat input"
                />
                <button
                  type="submit"
                  className="bgpt-send-btn"
                  disabled={isTyping || !inputVal.trim()}
                  aria-label="Send message"
                >
                  {isTyping ? (
                    <span className="bgpt-send-spinner" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )}
                </button>
              </form>

              <p className="bgpt-disclaimer">
                BeautyGPT provides product guidance only — not medical advice. Consult a dermatologist for clinical skin conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="section" style={{ background: '#fafafb' }}>
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Enterprise Integration</span>
            <h2 className="section-title">Why Beauty Brands Choose BeautyGPT</h2>
            <p className="section-subtitle">
              Turn casual discovery into high-confidence checkout with 24/7 AI-guided consultations.
            </p>
          </div>
          <div className="feature-cards-grid">
            <div className="feat-card">
              <div className="feat-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
              <h3>Multi-Turn Memory</h3>
              <p>Maintains context across the full conversation — skin type, concerns, budget, and ingredient sensitivities all remembered.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3h6v8l4 9H5l4-9V3z"/><line x1="9" y1="3" x2="15" y2="3"/></svg></div>
              <h3>100K+ INCI Knowledge</h3>
              <p>Explains actives, contraindications, and synergistic layering — backed by dermatology literature.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v4a6 6 0 0 1-12 0V8z"/></svg></div>
              <h3>API & Webhook Ready</h3>
              <p>Embed in WhatsApp for Business, Shopify PDP, mobile apps, and smart mirror kiosks via REST API.</p>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
