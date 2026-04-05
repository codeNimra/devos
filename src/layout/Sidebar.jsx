import { NAV } from '../constants/nav.js';

export default function Sidebar({ open, tab, onTabChange, alerts, user, onLogout }) {
  return (
    <div style={{
      width: open ? 228 : 0,
      flexShrink: 0,
      transition: 'width .25s cubic-bezier(.16,1,.3,1)',
      overflow: 'hidden',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--sidebar-bg, var(--surface))',
    }}>

      {/* ── LOGO ── */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32, flexShrink: 0,
          background: 'linear-gradient(135deg,#00d4ff,#7c3aed)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17, boxShadow: '0 4px 14px #00d4ff33',
        }}>
          ⌘
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 18, fontWeight: 800,
            background: 'linear-gradient(135deg,#00d4ff,#7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}>
            LifeOS
          </div>
          <div style={{ fontSize: 9, color: 'var(--txt5)', letterSpacing: 1.5, marginTop: 2, whiteSpace: 'nowrap' }}>
            PERSONAL OS
          </div>
        </div>
        {alerts.length > 0 && (
          <div style={{
            marginLeft: 'auto', flexShrink: 0,
            background: '#ef4444',
            color: '#fff',
            fontSize: 10, fontWeight: 800,
            borderRadius: 20, padding: '2px 7px',
            minWidth: 20, textAlign: 'center',
          }}>
            {alerts.length}
          </div>
        )}
      </div>

      {/* ── NAV LINKS ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px 16px' }}>
        {NAV.map((section, si) => (
          <div key={si}>
            {section.group && (
              <div style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: 1.5,
                color: 'var(--txt5)',
                padding: '12px 10px 5px',
                whiteSpace: 'nowrap',
              }}>
                {section.group}
              </div>
            )}
            {section.items.map((item) => {
              const isActive   = tab === item.id;
              const alertCount = item.id === 'hackathons'
                ? alerts.filter(a => a.type === 'hackathon').length
                : 0;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '9px 11px',
                    borderRadius: 9,
                    border: `1px solid ${isActive ? '#00d4ff22' : 'transparent'}`,
                    background: isActive ? '#00d4ff10' : 'transparent',
                    color: isActive ? '#00d4ff' : 'var(--txt3)',
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 600,
                    fontFamily: 'Space Mono, monospace',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all .15s',
                    whiteSpace: 'nowrap',
                    marginBottom: 1,
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--sidebar-hover)';
                      e.currentTarget.style.color = 'var(--txt2)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--txt3)';
                    }
                  }}
                >
                  <span style={{ fontSize: 15, flexShrink: 0, width: 20, textAlign: 'center' }}>
                    {item.icon}
                  </span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                  {alertCount > 0 && (
                    <span style={{
                      background: '#ef4444', color: '#fff',
                      fontSize: 9, fontWeight: 800,
                      borderRadius: 20, padding: '1px 6px',
                      flexShrink: 0,
                    }}>
                      {alertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── USER FOOTER ── */}
      <div style={{
        padding: '12px 10px',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '8px 10px', borderRadius: 10,
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg,#00d4ff,#7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'Syne',
          }}>
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 12, fontWeight: 700,
              color: 'var(--txt2)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.name}
            </div>
            {user?.field && (
              <div style={{
                fontSize: 9, color: 'var(--txt4)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {user.field}
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            title="Exit"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--txt4)', fontSize: 14, flexShrink: 0,
              padding: '2px 4px', borderRadius: 4,
              transition: 'color .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--txt4)'}
          >
            ↩
          </button>
        </div>
      </div>
    </div>
  );
}