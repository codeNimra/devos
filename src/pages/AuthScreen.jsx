import { useState, useEffect } from 'react';

const TAGLINES = [
  'Your life, organized.',
  'Work. Build. Connect. Grow.',
  'For every kind of person.',
  'One OS for everything.',
];

export default function AuthScreen({ onLogin }) {
  const [name,     setName]     = useState('');
  const [field,    setField]    = useState('');
  const [step,     setStep]     = useState('splash');
  const [tagIdx,   setTagIdx]   = useState(0);
  const [fadeTag,  setFadeTag]  = useState(true);

  /* Splash → form after 2.4s */
  useEffect(() => {
    if (step !== 'splash') return;
    const t = setTimeout(() => setStep('form'), 2400);
    return () => clearTimeout(t);
  }, [step]);

  /* Cycle taglines with fade */
  useEffect(() => {
    const t = setInterval(() => {
      setFadeTag(false);
      setTimeout(() => { setTagIdx(i => (i + 1) % TAGLINES.length); setFadeTag(true); }, 300);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const handleEnter = () => {
    const n = name.trim() || 'You';
    const f = field || 'General';
    onLogin({ name: n, field: f, joined: new Date().toISOString() });
  };

  /* ── SPLASH ── */
  if (step === 'splash') {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: '#05050f',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(#00d4ff07 1px, transparent 1px), linear-gradient(90deg, #00d4ff07 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)',
        }} />

        {/* Glow orbs */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', top: '0%', left: '-10%', background: 'radial-gradient(circle, #00d4ff0a, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', bottom: '0%', right: '-5%',  background: 'radial-gradient(circle, #7c3aed0a, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', textAlign: 'center', zIndex: 1 }}>
          {/* System label */}
          <div style={{
            fontSize: 10, letterSpacing: 6, color: '#00d4ff33',
            fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 24,
            animation: 'fadeIn .8s ease both',
          }}>
            SYSTEM INITIALIZING
          </div>

          {/* Logo icon */}
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 38,
            boxShadow: '0 0 60px #00d4ff22',
            animation: 'splash .6s .1s cubic-bezier(.16,1,.3,1) both',
          }}>
            ⌘
          </div>

          {/* Name */}
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800, fontSize: 64,
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1, marginBottom: 12,
            animation: 'splash .6s .2s cubic-bezier(.16,1,.3,1) both',
          }}>
            LifeOS
          </div>

          {/* Rotating tagline */}
          <div style={{
            fontSize: 13, color: '#64748b', letterSpacing: 3,
            textTransform: 'uppercase', fontFamily: 'Syne, sans-serif',
            minHeight: 22, marginBottom: 52,
            transition: 'opacity .3s',
            opacity: fadeTag ? 1 : 0,
            animation: 'fadeUp .6s .35s cubic-bezier(.16,1,.3,1) both',
          }}>
            {TAGLINES[tagIdx]}
          </div>

          {/* Load bar */}
          <div style={{
            width: 220, height: 2, background: '#1a1a35',
            borderRadius: 2, overflow: 'hidden', margin: '0 auto',
            animation: 'fadeIn .4s .4s both',
          }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
              animation: 'loadBar 2.2s cubic-bezier(.4,0,.2,1) forwards',
            }} />
          </div>
        </div>

        <style>{`
          @keyframes loadBar { from { width: 0% } to { width: 100% } }
        `}</style>
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#05050f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(#00d4ff05 1px, transparent 1px), linear-gradient(90deg, #00d4ff05 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent)',
      }} />
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', top: '-10%', left: '-10%', background: 'radial-gradient(circle, #00d4ff07, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', bottom: '-5%', right: '-5%',  background: 'radial-gradient(circle, #7c3aed07, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 400, padding: '0 28px', textAlign: 'center' }}>

        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8, animation: 'fadeUp .5s both' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, boxShadow: '0 4px 20px #00d4ff22',
          }}>⌘</div>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26,
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>LifeOS</div>
        </div>

        <div style={{ fontSize: 10, color: '#334155', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 44, animation: 'fadeUp .5s .05s both' }}>
          Personal Operating System
        </div>

        {/* Welcome */}
        <div style={{ fontSize: 22, fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f1f5f9', marginBottom: 8, lineHeight: 1.3, animation: 'fadeUp .5s .1s both' }}>
          What should we call you?
        </div>
        <div style={{ fontSize: 12, color: '#475569', marginBottom: 32, lineHeight: 1.8, animation: 'fadeUp .5s .15s both' }}>
          No account. No password. Just your name<br/>and your OS is ready.
        </div>

        {/* Name */}
        <div style={{ animation: 'fadeUp .5s .2s both', marginBottom: 14 }}>
          <input
            style={{
              width: '100%', background: '#0a0a1a',
              border: '1px solid #1a1a35', color: '#f1f5f9',
              borderRadius: 12, padding: '14px 18px',
              fontSize: 15, fontFamily: 'Syne, sans-serif', fontWeight: 600,
              textAlign: 'center', letterSpacing: '.5px',
              outline: 'none', boxSizing: 'border-box',
              transition: 'border-color .2s, box-shadow .2s',
            }}
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && name.trim() && handleEnter()}
            onFocus={e => { e.target.style.borderColor = '#00d4ff44'; e.target.style.boxShadow = '0 0 0 3px #00d4ff10'; }}
            onBlur={e =>  { e.target.style.borderColor = '#1a1a35';   e.target.style.boxShadow = 'none'; }}
            autoFocus
          />
        </div>

        {/* Field */}
        <div style={{ animation: 'fadeUp .5s .25s both', marginBottom: 20 }}>
          <select
            style={{
              width: '100%', background: '#0a0a1a',
              border: '1px solid #1a1a35', color: field ? '#f1f5f9' : '#475569',
              borderRadius: 12, padding: '14px 18px',
              fontSize: 13, fontFamily: 'Space Mono, monospace',
              outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
              transition: 'border-color .2s',
              appearance: 'none',
            }}
            value={field}
            onChange={e => setField(e.target.value)}
            onFocus={e => e.target.style.borderColor = '#00d4ff44'}
            onBlur={e =>  e.target.style.borderColor = '#1a1a35'}
          >
            <option value="">What's your field? (optional)</option>
            <option value="Software Engineering">💻 Software Engineering</option>
            <option value="Computer Science">🎓 Computer Science</option>
            <option value="Medicine & Healthcare">🏥 Medicine &amp; Healthcare</option>
            <option value="Design & Creative">🎨 Design &amp; Creative</option>
            <option value="Business & Finance">📊 Business &amp; Finance</option>
            <option value="Engineering">⚙️ Engineering</option>
            <option value="Research & Academia">🔬 Research &amp; Academia</option>
            <option value="Freelance & Self-employed">💼 Freelance &amp; Self-employed</option>
            <option value="Home & Family">🏠 Home &amp; Family</option>
            <option value="Other">✨ Other</option>
          </select>
        </div>

        {/* Enter button */}
        <div style={{ animation: 'fadeUp .5s .3s both' }}>
          <button
            onClick={handleEnter}
            disabled={!name.trim()}
            style={{
              width: '100%',
              background: name.trim()
                ? 'linear-gradient(135deg, #00d4ff, #7c3aed)'
                : '#0a0a1a',
              color: name.trim() ? '#fff' : '#334155',
              border: name.trim() ? 'none' : '1px solid #1a1a35',
              borderRadius: 12, padding: '15px',
              fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 800,
              letterSpacing: 1, cursor: name.trim() ? 'pointer' : 'default',
              transition: 'all .25s cubic-bezier(.16,1,.3,1)',
              boxShadow: name.trim() ? '0 4px 24px #00d4ff22' : 'none',
            }}
            onMouseEnter={e => { if (name.trim()) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 32px #00d4ff44'; }}}
            onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = name.trim() ? '0 4px 24px #00d4ff22' : 'none'; }}
          >
            {name.trim() ? `Enter LifeOS →` : 'Enter your name to continue'}
          </button>
        </div>

        {/* Footer hint */}
        <div style={{ marginTop: 28, animation: 'fadeUp .5s .45s both' }}>
          <div style={{ fontSize: 10, color: '#1e293b', letterSpacing: .5, marginBottom: 16 }}>
            Built for everyone — developers, doctors, students, parents, freelancers
          </div>
          {/* Field previews */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {['💻 Dev', '🏥 Doctor', '🎓 Student', '👨‍👩‍👧 Parent', '🎨 Designer', '💼 Freelancer'].map(f => (
              <span key={f} style={{
                fontSize: 10, color: '#334155', padding: '3px 10px',
                borderRadius: 20, border: '1px solid #1a1a35',
                background: '#07071488',
              }}>{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}