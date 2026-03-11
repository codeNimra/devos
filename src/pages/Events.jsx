import { Modal, Field, Empty } from '../components';
import { useState }              from 'react';
import { genId }                 from '../utils/id.js';
import { daysUntil, fmtDate }    from '../utils/dates.js';
import { urgColorHex, urgLabel } from '../utils/colors.js';
import { EVENT_TYPES }           from '../constants/statuses.js';

export default function Events({ data, setData }) {
  const [show, setShow]     = useState(false);
  const [edit, setEdit]     = useState(null);
  const [filter, setFilter] = useState('upcoming');

  const blank = { name: '', type: 'hackathon', date: '', location: '', link: '', price: '', registered: false, notes: '' };
  const [f, setF] = useState(blank);

  const open   = (e = null) => { setF(e ? { ...e } : { ...blank }); setEdit(e?.id || null); setShow(true); };
  const save   = () => { if (!f.name) return; edit ? setData((p) => p.map((x) => (x.id === edit ? { ...x, ...f } : x))) : setData((p) => [...p, { ...f, id: genId() }]); setShow(false); };
  const del    = (id) => setData((p) => p.filter((x) => x.id !== id));
  const toggle = (id) => setData((p) => p.map((e) => e.id === id ? { ...e, registered: !e.registered } : e));

  const now    = new Date();
  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  const filtered = filter === 'all'
    ? sorted
    : filter === 'upcoming'
    ? sorted.filter((e) => new Date(e.date) >= now)
    : sorted.filter((e) => new Date(e.date) < now);

  const upcomingCount = sorted.filter((e) => new Date(e.date) >= now).length;

  return (
    <div className="fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>Events & Meetups</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>{upcomingCount} upcoming</p>
        </div>
        <button className="btn btn-primary" onClick={() => open()}>+ Add Event</button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[['upcoming', 'Upcoming'], ['past', 'Past'], ['all', 'All']].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            style={{ padding: '5px 12px', borderRadius: 20, fontSize: 10, fontWeight: 700, cursor: 'pointer', border: '1px solid', transition: 'all .15s', background: filter === k ? '#00d4ff15' : 'transparent', color: filter === k ? '#00d4ff' : 'var(--txt4)', borderColor: filter === k ? '#00d4ff33' : 'var(--border)' }}>
            {l}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <Empty icon="🗓" text="No events found" />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((e) => {
              const t = EVENT_TYPES[e.type] || EVENT_TYPES.other;
              const d = daysUntil(e.date);
              return (
                <div key={e.id} className="card" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                        <span style={{ fontSize: 18 }}>{t.icon}</span>
                        <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--txt)' }}>{e.name}</span>
                        <span className="badge" style={{ background: t.color + '22', color: t.color }}>{t.label}</span>
                        {e.registered && <span className="badge" style={{ background: '#10b98122', color: '#10b981' }}>✓ Registered</span>}
                        {d !== null && d >= 0 && d <= 7 && <span className="badge" style={{ background: urgColorHex(d) + '22', color: urgColorHex(d) }}>{urgLabel(d)}</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--txt4)', fontSize: 10 }}>📅 {fmtDate(e.date)}</span>
                        {e.location && <span style={{ color: 'var(--txt4)', fontSize: 10 }}>📍 {e.location}</span>}
                        {e.price    && <span style={{ color: e.price.toLowerCase() === 'free' ? '#10b981' : '#f59e0b', fontSize: 10 }}>💳 {e.price}</span>}
                      </div>
                      {e.notes && <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 5 }}>{e.notes}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => toggle(e.id)} className={`btn btn-sm ${e.registered ? 'btn-success' : 'btn-ghost'}`}>{e.registered ? '✓ Reg' : 'Register'}</button>
                      {e.link && <a href={e.link} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">↗</a>}
                      <button className="btn btn-ghost btn-sm"  onClick={() => open(e)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(e.id)}>✕</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {show && (
        <Modal title={edit ? 'Edit Event' : 'Add Event'} onClose={() => setShow(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <Field label="EVENT NAME *"><input className="inp" placeholder="e.g. React Summit 2025" value={f.name} onChange={(e) => setF((p) => ({ ...p, name: e.target.value }))} /></Field>
            <div className="g2">
              <Field label="TYPE">
                <select className="inp" value={f.type} onChange={(e) => setF((p) => ({ ...p, type: e.target.value }))}>
                  {Object.entries(EVENT_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </Field>
              <Field label="DATE"><input className="inp" type="date" value={f.date} onChange={(e) => setF((p) => ({ ...p, date: e.target.value }))} /></Field>
            </div>
            <div className="g2">
              <Field label="LOCATION / MODE"><input className="inp" placeholder="Online / City" value={f.location} onChange={(e) => setF((p) => ({ ...p, location: e.target.value }))} /></Field>
              <Field label="PRICE">          <input className="inp" placeholder="Free / $50"    value={f.price}    onChange={(e) => setF((p) => ({ ...p, price:    e.target.value }))} /></Field>
            </div>
            <Field label="LINK"> <input className="inp" type="url" placeholder="https://..." value={f.link}  onChange={(e) => setF((p) => ({ ...p, link:  e.target.value }))} /></Field>
            <Field label="NOTES"><textarea className="inp" rows={2} value={f.notes} onChange={(e) => setF((p) => ({ ...p, notes: e.target.value }))} style={{ resize: 'vertical' }} /></Field>
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
