import ThemeToggle from '../components/ThemeToggle.jsx';
import { NAV }        from '../constants/nav.js';

export default function TopBar({ tab, alerts, isDark, onToggleSidebar, onToggleTheme }) {
  const current = NAV.flatMap((g) => g.items).find((i) => i.id === tab);

  return (
    <div
      style={{
        padding: '0 20px',
        height: 52,
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'var(--topbar-bg)',
        backdropFilter: 'blur(12px)',
        flexShrink: 0,
      }}
    >
      <button
        onClick={onToggleSidebar}
        style={{ background: 'none', border: 'none', color: 'var(--txt4)', cursor: 'pointer', fontSize: 18, padding: '4px 6px', borderRadius: 6 }}
      >
        ☰
      </button>

      <span style={{ color: 'var(--txt5)', fontSize: 11, flex: 1 }} className="hide-sm">
        {current?.icon} {current?.label}
      </span>

      {/* Theme toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13 }}>{isDark ? '🌙' : '☀️'}</span>
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>

      {/* Alert badge */}
      {alerts.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#ef444412', border: '1px solid #ef444430', borderRadius: 8 }}>
          <span className="dot" style={{ background: '#ef4444' }} />
          <span style={{ color: '#ef4444', fontSize: 10, fontWeight: 700 }}>{alerts.length} urgent</span>
        </div>
      )}
    </div>
  );
}
