import { useState, useEffect, useRef } from 'react';

const MODES = [
  { label: 'Focus',       duration: 25 * 60, color: '#00d4ff' },
  { label: 'Short Break', duration:  5 * 60, color: '#10b981' },
  { label: 'Long Break',  duration: 15 * 60, color: '#7c3aed' },
];

export default function Pomodoro() {
  const [mode,     setMode]     = useState(0);
  const [timeLeft, setTimeLeft] = useState(MODES[0].duration);
  const [running,  setRunning]  = useState(false);
  const [sessions, setSessions] = useState(0);
  const [task,     setTask]     = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (running) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setRunning(false);
            if (mode === 0) setSessions((s) => s + 1);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [running, mode]);

  const switchMode = (i) => { setMode(i); setTimeLeft(MODES[i].duration); setRunning(false); };
  const reset      = ()  => { setTimeLeft(MODES[mode].duration); setRunning(false); };

  const mm   = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss   = String(timeLeft % 60).padStart(2, '0');
  const pct  = 1 - timeLeft / MODES[mode].duration;
  const col  = MODES[mode].color;
  const R    = 80;
  const circ = 2 * Math.PI * R;

  return (
    <div className="fade">
      <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)', marginBottom: 6 }}>Pomodoro Timer</h2>
      <p style={{ color: 'var(--txt4)', fontSize: 11, marginBottom: 24 }}>
        Stay focused. {sessions} session{sessions !== 1 ? 's' : ''} completed today.
      </p>

      {/* Mode switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {MODES.map((m, i) => (
            <button key={i} onClick={() => switchMode(i)}
              style={{ padding: '7px 16px', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid', transition: 'all .15s', background: mode === i ? m.color + '20' : 'transparent', color: mode === i ? m.color : 'var(--txt4)', borderColor: mode === i ? m.color + '44' : 'var(--border)' }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG ring timer */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
        <div style={{ position: 'relative', width: 200, height: 200 }}>
          <svg width={200} height={200} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={100} cy={100} r={R} fill="none" stroke="var(--border)" strokeWidth={8} />
            <circle cx={100} cy={100} r={R} fill="none" stroke={col} strokeWidth={8}
              strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset .5s' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'Syne', fontSize: 44, fontWeight: 800, color: running ? col : 'var(--txt)', letterSpacing: -2, lineHeight: 1 }}>
              {mm}:{ss}
            </div>
            <div style={{ fontSize: 11, color: 'var(--txt4)', marginTop: 4 }}>{MODES[mode].label}</div>
          </div>
        </div>

        <input className="inp" style={{ marginTop: 20, maxWidth: 300, textAlign: 'center' }} placeholder="What are you working on?" value={task} onChange={(e) => setTask(e.target.value)} />

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button onClick={reset} className="btn btn-ghost">↺ Reset</button>
          <button onClick={() => setRunning((r) => !r)}
            style={{ padding: '12px 36px', borderRadius: 12, fontSize: 13, fontWeight: 700, minWidth: 120, cursor: 'pointer', transition: 'all .2s', background: running ? '#ef444422' : col + '22', color: running ? '#ef4444' : col, border: `2px solid ${running ? '#ef444444' : col + '44'}` }}>
            {running ? '⏸ Pause' : '▶ Start'}
          </button>
        </div>
      </div>

      {/* Session dots */}
      {sessions > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {Array.from({ length: sessions }).map((_, i) => (
            <span key={i} style={{ width: 14, height: 14, borderRadius: 3, background: '#00d4ff', display: 'inline-block' }} />
          ))}
          <span style={{ color: 'var(--txt4)', fontSize: 11, marginLeft: 6 }}>
            {sessions} × 25 min = {sessions * 25} min focused
          </span>
        </div>
      )}
    </div>
  );
}
