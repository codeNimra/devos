import { Modal, Field, Empty } from '../components';
import { useState }                          from 'react';
import { PLATFORM_COLORS, PLATFORM_ICONS }   from '../constants/platforms.js';

const QUICK_LINKS = [
  { key: 'github',   label: 'GitHub',    icon: '🐙', color: '#6e7681' },
  { key: 'twitter',  label: 'Twitter / X', icon: '🐦', color: '#1d9bf0' },
  { key: 'linkedin', label: 'LinkedIn',  icon: '💼', color: '#0077b5' },
  { key: 'website',  label: 'Portfolio', icon: '🌐', color: '#10b981' },
];

export default function Profile({ user, setUser, hackathons, socials, projects }) {
  const [editing, setEditing] = useState(false);
  const [copied,  setCopied]  = useState(false);

  const [f, setF] = useState({
    bio:      user?.bio      || '',
    github:   user?.github   || '',
    twitter:  user?.twitter  || '',
    linkedin: user?.linkedin || '',
    website:  user?.website  || '',
  });

  const save = () => { setUser((u) => ({ ...u, ...f })); setEditing(false); };

  const copyProfile = () => {
    const lines = [
      `👤 ${user?.name}`,
      user?.bio      ? `"${user.bio}"` : '',
      user?.github   ? `GitHub: ${user.github}`   : '',
      user?.twitter  ? `Twitter: ${user.twitter}`  : '',
      user?.linkedin ? `LinkedIn: ${user.linkedin}` : '',
      user?.website  ? `Website: ${user.website}`  : '',
      `🏆 ${hackathons.length} hackathons · 🚀 ${projects.length} projects`,
    ].filter(Boolean).join('\n');
    navigator.clipboard.writeText(lines).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>Public Profile</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>Your developer card</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost"   onClick={() => { setF({ bio: user?.bio || '', github: user?.github || '', twitter: user?.twitter || '', linkedin: user?.linkedin || '', website: user?.website || '' }); setEditing(true); }}>✏ Edit</button>
          <button className="btn btn-primary" onClick={copyProfile}>{copied ? '✓ Copied!' : 'Share'}</button>
        </div>
      </div>

      {/* Quick link tiles */}
      <div className="g4" style={{ marginBottom: 20 }}>
        {QUICK_LINKS.map(({ key, label, icon, color }) => {
          const val = user?.[key];
          return (
            <div key={key} className="card" style={{ padding: 16, borderTop: `3px solid ${val ? color : 'var(--border)'}`, opacity: val ? 1 : 0.5 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
              <div style={{ color: 'var(--txt4)', fontSize: 9, letterSpacing: 1, marginBottom: 4 }}>{label.toUpperCase()}</div>
              {val
                ? <a href={val} target="_blank" rel="noreferrer" style={{ color, fontSize: 11, wordBreak: 'break-all' }}>{val.replace(/https?:\/\//, '').slice(0, 28) + '…'} ↗</a>
                : <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--txt5)', fontSize: 10, cursor: 'pointer', padding: 0 }}>+ Add link</button>}
            </div>
          );
        })}
      </div>

      {/* Profile card */}
      <div className="card" style={{ padding: 28, borderColor: 'var(--border-strong)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22, flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, fontFamily: 'Syne', color: '#fff', flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase() || 'D'}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: 'var(--txt)' }}>{user?.name || 'Developer'}</h3>
            <p style={{ color: 'var(--txt4)', fontSize: 12 }}>{user?.email}</p>
            {user?.bio && <p style={{ color: 'var(--txt3)', fontSize: 12, marginTop: 5, fontStyle: 'italic' }}>"{user.bio}"</p>}
            <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--txt4)', fontSize: 10 }}>🏆 {hackathons.length} hackathons</span>
              <span style={{ color: 'var(--txt4)', fontSize: 10 }}>🚀 {projects.length} projects</span>
              <span style={{ color: 'var(--txt4)', fontSize: 10 }}>🌐 {socials.length} socials</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {QUICK_LINKS.map(({ key, icon, color }) =>
              user?.[key]
                ? <a key={key} href={user[key]} target="_blank" rel="noreferrer"
                    style={{ width: 36, height: 36, borderRadius: 10, background: color + '20', border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, transition: 'all .2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = color + '40'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = color + '20'; e.currentTarget.style.transform = 'none'; }}>
                    {icon}
                  </a>
                : <div key={key} style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--input-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, opacity: 0.3 }}>{icon}</div>
            )}
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />

        {/* Socials */}
        {socials.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <h4 style={{ color: 'var(--txt4)', fontSize: 10, letterSpacing: 1.5, marginBottom: 12 }}>CONNECT WITH ME</h4>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {socials.map((s) => {
                const col = PLATFORM_COLORS[s.platform] || '#64748b';
                return (
                  <a key={s.id} href={s.url || '#'} target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', background: col + '15', border: `1px solid ${col}33`, borderRadius: 8, color: 'var(--txt)', fontSize: 11, transition: 'background .2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = col + '28')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = col + '15')}>
                    {PLATFORM_ICONS[s.platform] || '🔗'} {s.handle}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Featured projects */}
        {projects.filter((p) => p.github || p.demo).length > 0 && (
          <div>
            <h4 style={{ color: 'var(--txt4)', fontSize: 10, letterSpacing: 1.5, marginBottom: 12 }}>FEATURED PROJECTS</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {projects.slice(0, 3).map((p) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--input-bg)', borderRadius: 9, border: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 12, color: 'var(--txt)' }}>{p.name}</div>
                    {p.stack && <div style={{ color: 'var(--txt4)', fontSize: 10, marginTop: 1 }}>{p.stack}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {p.github && <a href={p.github} target="_blank" rel="noreferrer" style={{ color: '#00d4ff', fontSize: 10 }}>GitHub ↗</a>}
                    {p.demo   && <a href={p.demo}   target="_blank" rel="noreferrer" style={{ color: '#7c3aed', fontSize: 10 }}>Demo ↗</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <Modal title="Edit Profile" onClose={() => setEditing(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <Field label="BIO / TAGLINE"><input className="inp" placeholder="Full-stack dev | hackathon enthusiast" value={f.bio} onChange={(e) => setF((p) => ({ ...p, bio: e.target.value }))} /></Field>
            <div style={{ height: 1, background: 'var(--border)' }} />
            {[
              { key: 'github',   label: '🐙 GITHUB URL',    ph: 'https://github.com/yourname' },
              { key: 'twitter',  label: '🐦 TWITTER URL',   ph: 'https://twitter.com/yourhandle' },
              { key: 'linkedin', label: '💼 LINKEDIN URL',  ph: 'https://linkedin.com/in/yourname' },
              { key: 'website',  label: '🌐 PORTFOLIO URL', ph: 'https://yoursite.com' },
            ].map(({ key, label, ph }) => (
              <Field key={key} label={label}>
                <input className="inp" type="url" placeholder={ph} value={f[key]} onChange={(e) => setF((p) => ({ ...p, [key]: e.target.value }))} />
              </Field>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button className="btn btn-ghost"   style={{ flex: 1 }} onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={save}>Save Changes</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
