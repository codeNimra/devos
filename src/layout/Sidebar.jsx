import { NAV } from '../constants/nav.js';

export default function Sidebar({ open, tab, onTabChange, alerts, user, onLogout }) {
  const urgentCount = 0; // passed via alerts prop length if needed — kept simple

  return (
    <div
      style={{
        width: open ? 210 : 0,
        flexShrink: 0,
        transition: 'width .2s',
        overflow: 'hidden',
        borderRight: '1px solid var(--border-soft)',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface2)',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '18px 14px 12px', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
          ⌘
        </div>
        <span style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 800, color: 'var(--txt)', letterSpacing: -0.5, whiteSpace: 'nowrap' }}>
          DevOS
        </span>
        {alerts.length > 0 && (
          <span style={{ background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 20, padding: '2px 6px', marginLeft: 'auto' }}>
            {alerts.length}
          </span>
        )}
      </div>

      {/* Nav links */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 20px' }}>
        {NAV.map((section, si) => (
          <div key={si}>
            {section.group && (
              <div className="sidebar-group">{section.group}</div>
            )}
            {section.items.map((item) => {
              const hasUrgentBadge = item.id === 'hackathons' && alerts.some((a) => a.type === 'hackathon');
              const badgeCount     = hasUrgentBadge ? alerts.filter((a) => a.type === 'hackathon').length : null;
              return (
                <button
                  key={item.id}
                  className={`sidebar-link ${tab === item.id ? 'active' : ''}`}
                  onClick={() => onTabChange(item.id)}
                >
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                  {badgeCount && (
                    <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 20, padding: '1px 5px', flexShrink: 0 }}>
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User footer */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-soft)' }}>
        <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg,#00d4ff44,#7c3aed44)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, color: 'var(--txt)' }}>
            {user.name[0].toUpperCase()}
          </div>
          <span style={{ color: 'var(--txt4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontSize: 10 }}>
            {user.name}
          </span>
          <button onClick={onLogout} style={{ background: 'none', border: 'none', color: 'var(--txt5)', cursor: 'pointer', fontSize: 11, flexShrink: 0 }} title="Logout">
            ↩
          </button>
        </div>
      </div>
    </div>
  );
}
