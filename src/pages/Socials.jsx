import { Modal, Field, Empty } from '../components';
import { useState }                          from 'react';
import { genId }                              from '../utils/id.js';
import { PLATFORM_COLORS, PLATFORM_ICONS, PLATFORMS } from '../constants/platforms.js';

export default function Socials({ data, setData }) {
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);

  const blank = { platform: 'github', handle: '', url: '', followers: '', bio: '' };
  const [f, setF] = useState(blank);

  const open = (s = null) => { setF(s ? { ...s } : { ...blank }); setEdit(s?.id || null); setShow(true); };
  const save = () => { if (!f.handle) return; edit ? setData((p) => p.map((x) => (x.id === edit ? { ...x, ...f } : x))) : setData((p) => [...p, { ...f, id: genId() }]); setShow(false); };
  const del  = (id) => setData((p) => p.filter((x) => x.id !== id));

  return (
    <div className="fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>Social Handles</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>Your developer presence</p>
        </div>
        <button className="btn btn-primary" onClick={() => open()}>+ Add Handle</button>
      </div>

      {data.length === 0
        ? <Empty icon="🌐" text="Add your social handles" />
        : (
          <div className="g2">
            {data.map((s) => {
              const col  = PLATFORM_COLORS[s.platform] || '#64748b';
              const icon = PLATFORM_ICONS[s.platform]  || '🔗';
              return (
                <div key={s.id} className="card" style={{ padding: 20, borderTop: `3px solid ${col}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 22 }}>{icon}</span>
                        <div>
                          <div style={{ color: 'var(--txt4)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}>{s.platform}</div>
                          <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--txt)' }}>{s.handle}</div>
                        </div>
                      </div>
                      {s.followers && <div style={{ color: 'var(--txt4)', fontSize: 10, marginBottom: 4 }}>👥 {s.followers}</div>}
                      {s.bio       && <p style={{ color: 'var(--txt3)', fontSize: 11, lineHeight: 1.5 }}>{s.bio}</p>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {s.url && <a href={s.url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">↗</a>}
                      <button className="btn btn-ghost btn-sm"  onClick={() => open(s)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(s.id)}>✕</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {show && (
        <Modal title={edit ? 'Edit Handle' : 'Add Handle'} onClose={() => setShow(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <Field label="PLATFORM">
              <select className="inp" value={f.platform} onChange={(e) => setF((p) => ({ ...p, platform: e.target.value }))}>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </Field>
            <Field label="HANDLE *">   <input className="inp" placeholder="@yourhandle"  value={f.handle}    onChange={(e) => setF((p) => ({ ...p, handle:    e.target.value }))} /></Field>
            <Field label="PROFILE URL"><input className="inp" type="url" placeholder="https://..." value={f.url} onChange={(e) => setF((p) => ({ ...p, url: e.target.value }))} /></Field>
            <Field label="FOLLOWERS">  <input className="inp" placeholder="1.2k followers" value={f.followers} onChange={(e) => setF((p) => ({ ...p, followers: e.target.value }))} /></Field>
            <Field label="BIO">        <textarea className="inp" rows={2} value={f.bio} onChange={(e) => setF((p) => ({ ...p, bio: e.target.value }))} style={{ resize: 'vertical' }} /></Field>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button className="btn btn-ghost"   style={{ flex: 1 }} onClick={() => setShow(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={save}>Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
