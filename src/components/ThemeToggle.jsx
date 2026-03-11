export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        background: isDark ? '#00d4ff44' : '#f59e0b44',
        border: `1px solid ${isDark ? '#00d4ff55' : '#f59e0b55'}`,
      }}
    >
      <div
        className="theme-toggle-knob"
        style={{
          transform:  isDark ? 'translateX(3px)' : 'translateX(17px)',
          boxShadow:  isDark ? '0 0 6px #00d4ff88' : '0 0 6px #f59e0b88',
          background: isDark ? '#00d4ff' : '#f59e0b',
        }}
      />
    </button>
  );
}