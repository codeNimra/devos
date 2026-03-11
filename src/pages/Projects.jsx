import { Modal, Field, Empty } from '../components';
import { useState }            from 'react';
import { genId }               from '../utils/id.js';
import { PROJ_STATUS }         from '../constants/statuses.js';

export default function Projects({ data, setData, hackathons }) {
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);

  const blank = { name: '', hackathonId: '', stack: '', github: '', demo: '', status: 'planning', description: '' };
  const [f, setF] = useState(blank);

  const open = (p = null) => { setF(p ? { ...p } : { ...blank }); setEdit(p?.id || null); setShow(true); };
  const save = () => {
    if (!f.name) return;
    edit
      ? setData((p) => p.map((x) => (x.id === edit ? { ...x, ...f } : x)))
      : setData((p) => [...p, { ...f, id: genId() }]);
    setShow(false);
  };
  const del = (id) => setData((p) => p.filter((x) => x.id !== id));

  return (
    <div className="fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>Projects</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>{data.length} projects</p>
        </div>
        <button className="btn btn-primary" onClick={() => open()}>+ Add Project</button>
      </div>

      {data.length === 0
        ? <Empty icon="🚀" text="No projects yet. Start building!" />
        : (
          <div className="g2">
            {data.map((p) => {
              const s    = PROJ_STATUS[p.status] || PROJ_STATUS.planning;
              const hack = hackathons.find((h) => h.id === p.hackathonId);
              return (
                <div key={p.id} className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span className="badge" style={{ background: s.color + '22', color: s.color }}>{s.label}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm"  onClick={() => open(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(p.id)}>✕</button>
                    </div>
                  </div>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, marginBottom: 6, color: 'var(--txt)' }}>{p.name}</h3>
                  {hack        && <div style={{ color: '#7c3aed', fontSize: 10, marginBottom: 5 }}>🏆 {hack.name}</div>}
                  {p.stack     && <div style={{ color: 'var(--txt4)', fontSize: 10, marginBottom: 8 }}>🛠 {p.stack}</div>}
                  {p.description && <p style={{ color: 'var(--txt3)', fontSize: 11, lineHeight: 1.6, marginBottom: 10 }}>{p.description}</p>}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">GitHub ↗</a>}
                    {p.demo   && <a href={p.demo}   target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">Demo ↗</a>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {show && (
        <Modal title={edit ? 'Edit Project' : 'Add Project'} onClose={() => setShow(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <Field label="PROJECT NAME *">
              <input className="inp" placeholder="e.g. EcoTrack AI" value={f.name} onChange={(e) => setF((p) => ({ ...p, name: e.target.value }))} />
            </Field>
            <div className="g2">
              <Field label="STATUS">
                <select className="inp" value={f.status} onChange={(e) => setF((p) => ({ ...p, status: e.target.value }))}>
                  {Object.entries(PROJ_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </Field>
              <Field label="HACKATHON">
                <select className="inp" value={f.hackathonId} onChange={(e) => setF((p) => ({ ...p, hackathonId: e.target.value }))}>
                  <option value="">None</option>
                  {hackathons.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </Field>
            </div>
            <Field label="TECH STACK">
              <input className="inp" placeholder="React, Node, MongoDB…" value={f.stack} onChange={(e) => setF((p) => ({ ...p, stack: e.target.value }))} />
            </Field>
            <div className="g2">
              <Field label="GITHUB"><input className="inp" type="url" placeholder="https://github.com/…" value={f.github} onChange={(e) => setF((p) => ({ ...p, github: e.target.value }))} /></Field>
              <Field label="DEMO">  <input className="inp" type="url" placeholder="https://…"            value={f.demo}   onChange={(e) => setF((p) => ({ ...p, demo:   e.target.value }))} /></Field>
            </div>
            <Field label="DESCRIPTION">
              <textarea className="inp" rows={3} placeholder="What does it do?" value={f.description} onChange={(e) => setF((p) => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} />
            </Field>
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
