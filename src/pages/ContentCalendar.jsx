import { Modal, Field, Empty } from '../components';
import { useState }                           from 'react';
import { genId }                               from '../utils/id.js';
import { daysUntil, fmtDate }                  from '../utils/dates.js';
import { urgColorHex, urgLabel }               from '../utils/colors.js';
import { CONTENT_STATUS, CONTENT_TYPES }       from '../constants/statuses.js';

export default function ContentCalendar({ data, setData }) {
  const [show, setShow]     = useState(false);
  const [edit, setEdit]     = useState(null);
  const [filter, setFilter] = useState('all');

  const blank = { title: '', type: 'Blog Post', platform: '', scheduledDate: '', status: 'idea', topic: '', link: '' };
  const [f, setF] = useState(blank);

  const open = (c = null) => { setF(c ? { ...c } : { ...blank }); setEdit(c?.id || null); setShow(true); };
  const save = () => { if (!f.title) return; edit ? setData((p) => p.map((x) => (x.id === edit ? { ...x, ...f } : x))) : setData((p) => [...p, { ...f, id: genId() }]); setShow(false); };
  const del  = (id) => setData((p) => p.filter((x) => x.id !== id));

  const filtered = data
    .filter((c) => filter === 'all' || c.status === filter)
    .sort((a, b) => (!a.scheduledDate ? 1 : !b.scheduledDate ? -1 : new Date(a.scheduledDate) - new Date(b.scheduledDate)));

  return (
    <div className="fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>Content Calendar</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>
            {data.filter((c) => c.status === 'published').length} published · {data.filter((c) => c.status === 'scheduled').length} scheduled
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => open()}>+ Add Content</button>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {[['all', 'All'], ...Object.entries(CONTENT_STATUS).map(([k, v]) => [k, v.label])].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            style={{ padding: '5px 12px', borderRadius: 20, fontSize: 10, fontWeight: 700, cursor: 'pointer', border: '1px solid', transition: 'all .15s', background: filter === k ? '#00d4ff15' : 'transparent', color: filter === k ? '#00d4ff' : 'var(--txt4)', borderColor: filter === k ? '#00d4ff33' : 'var(--border)' }}>
            {l}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <Empty icon="📣" text="Plan your content here" />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {filtered.map((c) => {
              const s = CONTENT_STATUS[c.status] || CONTENT_STATUS.idea;
              const d = daysUntil(c.scheduledDate);
              return (
                <div key={c.id} className="card" style={{ padding: 16, borderLeft: `3px solid ${s.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 6 }}>
                        <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: 'var(--txt)' }}>{c.title}</span>
                        <span className="badge" style={{ background: s.color + '22', color: s.color }}>{s.label}</span>
                        <span className="badge" style={{ background: '#3b82f622', color: '#3b82f6' }}>{c.type}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {c.scheduledDate && <span style={{ color: d !== null && d <= 3 ? urgColorHex(d) : 'var(--txt4)', fontSize: 10 }}>📅 {fmtDate(c.scheduledDate)}{d !== null && ` · ${urgLabel(d)}`}</span>}
                        {c.platform      && <span style={{ color: 'var(--txt4)', fontSize: 10 }}>📍 {c.platform}</span>}
                      </div>
                      {c.topic && <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 5 }}>{c.topic}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      {c.link && <a href={c.link} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">↗</a>}
                      <button className="btn btn-ghost btn-sm"  onClick={() => open(c)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(c.id)}>✕</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {show && (
        <Modal title={edit ? 'Edit Content' : 'Add Content'} onClose={() => setShow(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <Field label="TITLE *"><input className="inp" placeholder="e.g. How I won my first hackathon" value={f.title} onChange={(e) => setF((p) => ({ ...p, title: e.target.value }))} /></Field>
            <div className="g2">
              <Field label="TYPE">
                <select className="inp" value={f.type} onChange={(e) => setF((p) => ({ ...p, type: e.target.value }))}>
                  {CONTENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="STATUS">
                <select className="inp" value={f.status} onChange={(e) => setF((p) => ({ ...p, status: e.target.value }))}>
                  {Object.entries(CONTENT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </Field>
            </div>
            <div className="g2">
              <Field label="PLATFORM">       <input className="inp" placeholder="Dev.to, Twitter…" value={f.platform}      onChange={(e) => setF((p) => ({ ...p, platform:      e.target.value }))} /></Field>
              <Field label="SCHEDULED DATE"> <input className="inp" type="date"                    value={f.scheduledDate} onChange={(e) => setF((p) => ({ ...p, scheduledDate: e.target.value }))} /></Field>
            </div>
            <Field label="TOPIC / SUMMARY"><textarea className="inp" rows={2} placeholder="What's it about?" value={f.topic} onChange={(e) => setF((p) => ({ ...p, topic: e.target.value }))} style={{ resize: 'vertical' }} /></Field>
            <Field label="LINK"><input className="inp" type="url" placeholder="https://..." value={f.link} onChange={(e) => setF((p) => ({ ...p, link: e.target.value }))} /></Field>
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
