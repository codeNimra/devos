export default function Field({ label, children }) {
  return (
    <div>
      <label style={{ color: 'var(--txt4)', fontSize: 10, letterSpacing: 1.2, display: 'block', marginBottom: 5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}
