export default function AlertsStrip({ alerts, onDismiss }) {
  if (alerts.length === 0) return null;

  const typeIcon = { hackathon: '🏆', event: '🗓', learning: '📚' };

  return (
    <div
      style={{
        padding: '10px 20px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        maxHeight: 140,
        overflowY: 'auto',
        background: 'var(--surface2)',
      }}
    >
      {alerts.map((a) => (
        <div key={a.id} className="notif" style={{ background: a.color + '0e', border: `1px solid ${a.color}28` }}>
          <span className="dot" style={{ background: a.color }} />
          <span style={{ flex: 1, color: 'var(--txt2)', fontSize: 10 }}>
            <span style={{ color: a.color, fontWeight: 700 }}>
              {typeIcon[a.type] || '⚡'} {a.name}
            </span>
            {' '}{a.days === 0 ? 'is due TODAY!' : `— ${a.days}d left`}
          </span>
          <button
            onClick={() => onDismiss(a.id)}
            style={{ background: 'none', border: 'none', color: 'var(--txt4)', cursor: 'pointer', fontSize: 16 }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
