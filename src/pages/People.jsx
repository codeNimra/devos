import { Modal, Field, Empty } from '../components';
import { useState }                              from 'react';
import { genId }                                  from '../utils/id.js';
import { PLATFORM_ICONS, PLATFORMS }              from '../constants/platforms.js';
import { ROLE_COLORS }                            from '../constants/statuses.js';

const ROLES = Object.keys(ROLE_COLORS);

export default function People({ data, setData }) {
  const [show, setShow]     = useState(false);
  const [edit, setEdit]     = useState(null);
  const [search, setSearch] = useState('');

  const blank = { name: '', role: 'Mentor', handle: '', platform: 'linkedin', note: '', metAt: '' };
  const [f, setF] = useState(blank);

  const open     = (p = null) => { setF(p ? { ...p } : { ...blank }); setEdit(p?.id || null); setShow(true); };
  const save     = () => { if (!f.name) return; edit ? setData((p) => p.map((x) => (x.id === edit ? { ...x, ...f } : x))) : setData((p) => [...p, { ...f, id: genId() }]); setShow(false); };
  const del      = (id) => setData((p) => p.filter((x) => x.id !== id));
  const filtered = data.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.role.toLowerCase().includes(search.toLowerCase()) || p.metAt?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>People & Mentors</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>{data.length} connections</p>
        </div>
        <button className="btn btn-primary" onClick={() => open()}>+ Add Person</button>
      </div>

      <input className="inp" placeholder="🔍 Search people…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: 16 }} />

      {filtered.length === 0
        ? <Empty icon="🤝" text="Add teammates, mentors & connections" />
        : (
          <div className="g2">
            {filtered.map((p) => {
              const rc = ROLE_COLORS[p.role] || '#64748b';
              return (
                <div key={p.id} className="card" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${rc}44,${rc}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, color: 'var(--txt)' }}>
                          {p.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: 'var(--txt)' }}>{p.name}</div>
                          <span className="badge" style={{ background: rc + '22', color: rc, marginTop: 2 }}>{p.role}</span>
                        </div>
                      </div>
                      {p.handle && <div style={{ fontSize: 10, color: 'var(--txt4)', marginBottom: 4 }}>{PLATFORM_ICONS[p.platform] || '🔗'} {p.handle}</div>}
                      {p.metAt  && <div style={{ fontSize: 10, color: 'var(--txt4)', marginBottom: 5 }}>📍 Met at {p.metAt}</div>}
                      {p.note   && <p style={{ fontSize: 11, color: 'var(--txt3)', lineHeight: 1.5 }}>{p.note}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                      <button className="btn btn-ghost btn-sm"  onClick={() => open(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(p.id)}>✕</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {show && (
        <Modal title={edit ? 'Edit Person' : 'Add Person'} onClose={() => setShow(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <Field label="NAME *"><input className="inp" placeholder="Full name" value={f.name} onChange={(e) => setF((p) => ({ ...p, name: e.target.value }))} /></Field>
            <div className="g2">
              <Field label="ROLE">
                <select className="inp" value={f.role} onChange={(e) => setF((p) => ({ ...p, role: e.target.value }))}>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="MET AT"><input className="inp" placeholder="ETHGlobal, Twitter…" value={f.metAt} onChange={(e) => setF((p) => ({ ...p, metAt: e.target.value }))} /></Field>
            </div>
            <div className="g2">
              <Field label="PLATFORM">
                <select className="inp" value={f.platform} onChange={(e) => setF((p) => ({ ...p, platform: e.target.value }))}>
                  {PLATFORMS.map((pl) => <option key={pl} value={pl}>{pl.charAt(0).toUpperCase() + pl.slice(1)}</option>)}
                </select>
              </Field>
              <Field label="HANDLE / URL"><input className="inp" placeholder="@handle or url" value={f.handle} onChange={(e) => setF((p) => ({ ...p, handle: e.target.value }))} /></Field>
            </div>
            <Field label="NOTE"><textarea className="inp" rows={2} value={f.note} onChange={(e) => setF((p) => ({ ...p, note: e.target.value }))} style={{ resize: 'vertical' }} /></Field>
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
