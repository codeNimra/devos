import { Modal, Field, Empty } from '../components';
import { useState }              from 'react';
import { genId }                 from '../utils/id.js';
import { daysUntil, fmtDate }    from '../utils/dates.js';
import { urgColorHex, urgLabel } from '../utils/colors.js';
import { LEARN_CATS, CAT_COLORS } from '../constants/statuses.js';

export default function Learning({ data, setData }) {
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);

  const blank = { topic: '', category: 'Frontend', date: '', duration: '', resource: '', status: 'pending', notes: '' };
  const [f, setF] = useState(blank);

  const open   = (l = null) => { setF(l ? { ...l } : { ...blank }); setEdit(l?.id || null); setShow(true); };
  const save   = () => { if (!f.topic) return; edit ? setData((p) => p.map((x) => (x.id === edit ? { ...x, ...f } : x))) : setData((p) => [...p, { ...f, id: genId() }]); setShow(false); };
  const del    = (id) => setData((p) => p.filter((x) => x.id !== id));
  const toggle = (id) => setData((p) => p.map((l) => l.id === id ? { ...l, status: l.status === 'done' ? 'pending' : 'done' } : l));

  const sorted = [...data].sort((a, b) => (!a.date ? 1 : !b.date ? -1 : new Date(a.date) - new Date(b.date)));
  const done   = data.filter((l) => l.status === 'done').length;

  return (
    <div className="fade">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>Learning Schedule</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>{done}/{data.length} completed</p>
        </div>
        <button className="btn btn-primary" onClick={() => open()}>+ Add Topic</button>
      </div>

      {/* Overall progress bar */}
      {data.length > 0 && (
        <div className="card" style={{ padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: 'var(--txt4)', fontSize: 10 }}>PROGRESS</span>
            <span style={{ color: '#00d4ff', fontSize: 10 }}>{Math.round(done / data.length * 100)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${done / data.length * 100}%`, background: 'linear-gradient(90deg,#00d4ff,#7c3aed)' }} />
          </div>
        </div>
      )}

      {sorted.length === 0
        ? <Empty icon="📚" text="No learning topics yet" />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {sorted.map((l) => {
              const d  = daysUntil(l.date);
              const cc = CAT_COLORS[l.category] || '#64748b';
              return (
                <div key={l.id} className="card" style={{ padding: 16, opacity: l.status === 'done' ? 0.55 : 1 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    {/* Checkbox */}
                    <button
                      onClick={() => toggle(l.id)}
                      style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${l.status === 'done' ? '#10b981' : 'var(--border-strong)'}`, background: l.status === 'done' ? '#10b98120' : 'transparent', cursor: 'pointer', flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#10b981' }}
                    >
                      {l.status === 'done' ? '✓' : ''}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 5 }}>
                        <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: l.status === 'done' ? 'var(--txt4)' : 'var(--txt)', textDecoration: l.status === 'done' ? 'line-through' : 'none' }}>{l.topic}</span>
                        <span className="badge" style={{ background: cc + '22', color: cc }}>{l.category}</span>
                        {l.date && d !== null && d >= 0 && d <= 3 && (
                          <span className="badge" style={{ background: urgColorHex(d) + '22', color: urgColorHex(d) }}>{urgLabel(d)}</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {l.date     && <span style={{ color: 'var(--txt4)', fontSize: 10 }}>📅 {fmtDate(l.date)}</span>}
                        {l.duration && <span style={{ color: 'var(--txt4)', fontSize: 10 }}>⏱ {l.duration}</span>}
                      </div>
                      {l.notes && <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 5 }}>{l.notes}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      {l.resource && <a href={l.resource} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">↗</a>}
                      <button className="btn btn-ghost btn-sm"  onClick={() => open(l)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(l.id)}>✕</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {show && (
        <Modal title={edit ? 'Edit Topic' : 'Add Topic'} onClose={() => setShow(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <Field label="TOPIC *"><input className="inp" placeholder="e.g. GraphQL Fundamentals" value={f.topic} onChange={(e) => setF((p) => ({ ...p, topic: e.target.value }))} /></Field>
            <div className="g2">
              <Field label="CATEGORY">
                <select className="inp" value={f.category} onChange={(e) => setF((p) => ({ ...p, category: e.target.value }))}>
                  {LEARN_CATS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="DURATION"><input className="inp" placeholder="e.g. 2 hrs/day" value={f.duration} onChange={(e) => setF((p) => ({ ...p, duration: e.target.value }))} /></Field>
            </div>
            <Field label="SCHEDULED DATE"><input className="inp" type="date"  value={f.date}     onChange={(e) => setF((p) => ({ ...p, date:     e.target.value }))} /></Field>
            <Field label="RESOURCE URL">  <input className="inp" type="url"   placeholder="https://..." value={f.resource} onChange={(e) => setF((p) => ({ ...p, resource: e.target.value }))} /></Field>
            <Field label="NOTES">         <textarea className="inp" rows={2}  value={f.notes}    onChange={(e) => setF((p) => ({ ...p, notes:    e.target.value }))} style={{ resize: 'vertical' }} /></Field>
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
