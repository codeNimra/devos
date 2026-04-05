import { useState, useEffect } from 'react';

const SPLASH_QUOTES = [
  "Your life, organized.",
  "One OS for everything.",
  "Built for humans, not just developers.",
  "Work. Build. Connect. Grow.",
];

export default function AuthScreen({ onLogin }) {
  const [name,    setName]    = useState('');
  const [field,   setField]   = useState('');
  const [step,    setStep]    = useState('splash'); // splash → form → entering
  const [quoteIdx, setQuoteIdx] = useState(0);

  /* Auto-advance from splash to form after 2.2s */
  useEffect(() => {
    if (step !== 'splash') return;
    const t = setTimeout(() => setStep('form'), 2200);
    return () => clearTimeout(t);
  }, [step]);

  /* Cycle subtitle during splash */
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx(i => (i + 1) % SPLASH_QUOTES.length), 1800);
    return () => clearInterval(t);
  }, []);

  const handleEnter = () => {
    const n = name.trim() || 'You';
    const f = field.trim() || 'General';
    onLogin({ name: n, field: f, joined: new Date().toISOString() });
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && name.trim()) handleEnter();
  };

  /* ── SPLASH PHASE ── */
  if (step === 'splash') {
    return (
      <div className="splash-screen">
        <div className="splash-grid" />

        {/* Floating orbs */}
        <div style={{
          position: 'absolute', width: 400, height: 400,
          borderRadius: '50%', top: '10%', left: '10%',
          background: 'radial-gradient(circle, #00d4ff08, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300,
          borderRadius: '50%', bottom: '15%', right: '15%',
          background: 'radial-gradient(circle, #7c3aed08, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', textAlign: 'center' }}>
          {/* OS Logo */}
          <div style={{
            fontSize: 13, letterSpacing: 5, color: '#00d4ff44',
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            marginBottom: 16,
            animation: 'fadeIn .6s ease both',
          }}>
            BOOTING SYSTEM
          </div>

          <div className="splash-logo">⌘ DevOS</div>

          <div style={{
            marginTop: 14,
            fontSize: 12,
            color: '#64748b',
            letterSpacing: 3,
            textTransform: 'uppercase',
            fontFamily: 'Syne, sans-serif',
            animation: 'fadeUp .6s .2s both',
            minHeight: 20,
            transition: 'opacity .4s',
          }}>
            {SPLASH_QUOTES[quoteIdx]}
          </div>

          {/* Loading bar */}
          <div style={{
            marginTop: 48,
            width: 200,
            height: 2,
            background: '#1a1a35',
            borderRadius: 2,
            overflow: 'hidden',
            animation: 'fadeIn .6s .3s both',
          }}>
            <div style={{
              height: '100%',
              borderRadius: 2,
              background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
              animation: 'loadBar 2s cubic-bezier(.4,0,.2,1) forwards',
            }} />
          </div>
        </div>

        <style>{`
          @keyframes loadBar {
            from { width: 0%; }
            to   { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  /* ── FORM PHASE ── */
  return (
    <div className="splash-screen">
      <div className="splash-grid" />

      <div style={{
        position: 'absolute', width: 500, height: 500,
        borderRadius: '50%', top: '5%', left: '5%',
        background: 'radial-gradient(circle, #00d4ff06, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', bottom: '10%', right: '10%',
        background: 'radial-gradient(circle, #7c3aed06, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', textAlign: 'center', width: '100%', maxWidth: 380, padding: '0 24px' }}>

        {/* Logo small */}
        <div style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 22, marginBottom: 6,
          background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'fadeUp .5s both',
        }}>
          ⌘ DevOS
        </div>

        <div style={{
          fontSize: 11, color: '#334155', letterSpacing: 2,
          textTransform: 'uppercase', marginBottom: 40,
          animation: 'fadeUp .5s .05s both',
        }}>
          Personal Operating System
        </div>

        {/* Welcome text */}
        <div style={{
          fontSize: 20, fontFamily: 'Syne, sans-serif', fontWeight: 700,
          color: '#f1f5f9', marginBottom: 8, lineHeight: 1.3,
          animation: 'fadeUp .5s .1s both',
        }}>
          What should we call you?
        </div>
        <div style={{
          fontSize: 11, color: '#64748b', marginBottom: 28, lineHeight: 1.7,
          animation: 'fadeUp .5s .15s both',
        }}>
          This is your personal space. No account, no password,<br />just you and your OS.
        </div>

        {/* Name input */}
        <div style={{ animation: 'fadeUp .5s .2s both' }}>
          <input
            className="splash-input"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
          />
        </div>

        {/* Field input */}
        <div style={{ animation: 'fadeUp .5s .25s both', marginTop: 0 }}>
          <select
            className="splash-input"
            value={field}
            onChange={e => setField(e.target.value)}
            style={{ textAlign: 'left', cursor: 'pointer', appearance: 'none' }}
          >
            <option value="">Select your field (optional)</option>
            <option value="Software Engineering">💻 Software Engineering</option>
            <option value="Computer Science">🎓 Computer Science</option>
            <option value="Medicine & Healthcare">🏥 Medicine & Healthcare</option>
            <option value="Design & Creative">🎨 Design & Creative</option>
            <option value="Business & Finance">📊 Business & Finance</option>
            <option value="Engineering">⚙️ Engineering</option>
            <option value="Research & Academia">🔬 Research & Academia</option>
            <option value="Freelance & Self-employed">💼 Freelance & Self-employed</option>
            <option value="Home & Family">🏠 Home & Family</option>
            <option value="Other">✨ Other</option>
          </select>
        </div>

        {/* Enter button */}
        <div style={{ animation: 'fadeUp .5s .3s both', marginTop: 6 }}>
          <button
            className="splash-btn"
            onClick={handleEnter}
            disabled={!name.trim()}
            style={{ opacity: name.trim() ? 1 : 0.4 }}
          >
            Enter Your OS →
          </button>
        </div>

        <div className="splash-hint">
          Works for developers, students, doctors, designers, and everyone in between
        </div>
      </div>
    </div>
  );
}