export default function Empty({ icon, text }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px', color: 'var(--txt5)' }}>
      <div style={{ fontSize: 38, marginBottom: 12 }}>{icon}</div>
      <p style={{ fontFamily: 'Syne', fontSize: 13, color: 'var(--txt4)' }}>{text}</p>
    </div>
  );
}
