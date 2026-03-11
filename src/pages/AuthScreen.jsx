import { useState } from 'react';
import { genId }    from '../utils/id.js';

export default function AuthScreen({ onLogin }) {
  const [mode,  setMode]  = useState('login');
  const [f,     setF]     = useState({ name: '', email: '', password: '' });
  const [users, setUsers] = useState([{ id: 'demo', name: 'Dev User', email: 'demo@dev.com', password: 'demo123' }]);
  const [err,   setErr]   = useState('');

  const go = () => {
    setErr('');
    if (!f.email || !f.password) return setErr('Email & password required');
    if (mode === 'signup') {
      if (!f.name) return setErr('Name required');
      if (users.find((u) => u.email === f.email)) return setErr('Email already exists');
      const u = { ...f, id: genId() };
      setUsers((p) => [...p, u]);
      onLogin(u);
    } else {
      const u = users.find((u) => u.email === f.email && u.password === f.password);
      if (!u) return setErr('Invalid credentials · try demo@dev.com / demo123');
      onLogin(u);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--auth-bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Background glows */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% -10%,#00d4ff09,transparent)' }} />
      <div style={{ position: 'absolute', top: '25%', right: '15%', width: 280, height: 280, background: '#7c3aed07', borderRadius: '50%', filter: 'blur(70px)' }} />

      <div style={{ width: '100%', maxWidth: 380, zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>⌘</div>
            <span style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: 'var(--txt)', letterSpacing: -1 }}>DevOS</span>
          </div>
          <p style={{ fontSize: 11, letterSpacing: 2, color: 'var(--txt4)' }}>YOUR DEVELOPER COMMAND CENTER</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 30 }}>
          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 26, background: 'var(--input-bg)', borderRadius: 10, padding: 4 }}>
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setErr(''); }}
                style={{ flex: 1, padding: '8px 0', borderRadius: 8, background: mode === m ? '#00d4ff12' : 'transparent', color: mode === m ? '#00d4ff' : 'var(--txt4)', border: mode === m ? '1px solid #00d4ff28' : '1px solid transparent', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', transition: 'all .2s' }}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {mode === 'signup' && (
              <div>
                <label style={{ color: 'var(--txt4)', fontSize: 10, letterSpacing: 1, display: 'block', marginBottom: 5 }}>NAME</label>
                <input className="inp" placeholder="Your name" value={f.name} onChange={(e) => setF((p) => ({ ...p, name: e.target.value }))} />
              </div>
            )}
            <div>
              <label style={{ color: 'var(--txt4)', fontSize: 10, letterSpacing: 1, display: 'block', marginBottom: 5 }}>EMAIL</label>
              <input className="inp" type="email" placeholder="you@dev.com" value={f.email} onChange={(e) => setF((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label style={{ color: 'var(--txt4)', fontSize: 10, letterSpacing: 1, display: 'block', marginBottom: 5 }}>PASSWORD</label>
              <input className="inp" type="password" placeholder="••••••••" value={f.password} onChange={(e) => setF((p) => ({ ...p, password: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && go()} />
            </div>
            {err && <p style={{ color: '#ef4444', fontSize: 11, padding: '8px 12px', background: '#ef444410', borderRadius: 8 }}>{err}</p>}
            <button className="btn btn-primary" style={{ marginTop: 4, padding: '12px', fontSize: 12, borderRadius: 10 }} onClick={go}>
              {mode === 'login' ? '▶ LAUNCH DEVOS' : '✦ CREATE ACCOUNT'}
            </button>
          </div>

          {mode === 'login' && (
            <p style={{ color: 'var(--txt5)', fontSize: 10, textAlign: 'center', marginTop: 14 }}>Demo: demo@dev.com / demo123</p>
          )}
        </div>
      </div>
    </div>
  );
}
