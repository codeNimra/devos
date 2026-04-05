import { useState } from 'react';
import { Modal, Field, Empty } from '../components';
import { genId } from '../utils/id.js';
import { today, fmtDate } from '../utils/dates.js';

const TYPES      = ['Personal', 'Work', 'Medical', 'Finance', 'Support', 'Interview', 'Other'];
const DIRECTIONS = ['Incoming', 'Outgoing', 'Missed'];

const blank = () => ({
  id: genId(), name: '', phone: '', type: 'Personal', direction: 'Outgoing',
  date: today(), duration: '', summary: '', followUp: '', followUpDate: '',
  important: false,
});

export default function Calls({ data, setData }) {
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(blank());
  const [edit,     setEdit]     = useState(null);
  const [filter,   setFilter]   = useState('All');
  const [search,   setSearch]   = useState('');

  const save = () => {
    if (!form.name.trim()) return;
    if (edit) {
      setData(prev => prev.map(c => c.id === edit ? { ...form } : c));
    } else {
      setData(prev => [{ ...form }, ...prev]);
    }
    setModal(false); setEdit(null); setForm(blank());
  };

  const del = (id) => setData(prev => prev.filter(c => c.id !== id));

  const openEdit = (c) => { setForm({ ...c }); setEdit(c.id); setModal(true); };

  const toggleImportant = (id) => setData(prev => prev.map(c => c.id === id ? { ...c, important: !c.important } : c));

  const filtered = data
    .filter(c => filter === 'All' || c.type === filter)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.summary?.toLowerCase().includes(search.toLowerCase()));

  const pending = data.filter(c => c.followUpDate && c.followUpDate >= today() && !c.followUpDone);

  const dirIcon  = { Incoming: '📲', Outgoing: '📤', Missed: '❌' };
  const dirColor = { Incoming: '#10b981', Outgoing: '#00d4ff', Missed: '#ef4444' };

  return (
    <div className="fade">
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800 }}>Call Log</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 3 }}>
            Every important conversation, remembered
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(blank()); setEdit(null); setModal(true); }}>
          + Log Call
        </button>
      </div>

      {/* FOLLOW-UPS DUE */}
      {pending.length > 0 && (
        <div className="card" style={{ padding: 16, marginBottom: 16, borderColor: '#f59e0b44', background: '#f59e0b06' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', letterSpacing: 1, marginBottom: 10 }}>
            ⏰ FOLLOW-UPS DUE
          </div>
          {pending.slice(0, 3).map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--divider)' }}>
              <span style={{ fontSize: 12, color: 'var(--txt2)' }}>{c.name}</span>
              <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>{fmtDate(c.followUpDate)}</span>
            </div>
          ))}
        </div>
      )}

      {/* FILTERS + SEARCH */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          className="inp"
          style={{ flex: 1, minWidth: 160, maxWidth: 240 }}
          placeholder="Search calls..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['All', ...TYPES].map(t => (
            <button
              key={t}
              className="pill"
              onClick={() => setFilter(t)}
              style={{
                background: filter === t ? '#00d4ff' : 'var(--surface2)',
                color: filter === t ? '#05050f' : 'var(--txt3)',
                border: `1px solid ${filter === t ? '#00d4ff' : 'var(--border)'}`,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* CALLS LIST */}
      {filtered.length === 0
        ? <Empty icon="📞" text={data.length === 0 ? "No calls logged yet. Start tracking your important conversations." : "No calls match your filter."} onAdd={data.length === 0 ? () => setModal(true) : null} />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(c => (
              <div key={c.id} className="card" style={{
                padding: '15px 18px',
                borderLeft: `4px solid ${dirColor[c.direction] || '#00d4ff'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>

                  {/* Direction icon */}
                  <div style={{ fontSize: 22, flexShrink: 0, paddingTop: 1 }}>
                    {dirIcon[c.direction] || '📞'}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: 'var(--txt)' }}>
                        {c.name}
                      </span>
                      {c.phone && (
                        <span style={{ fontSize: 10, color: 'var(--txt4)' }}>{c.phone}</span>
                      )}
                      <span className="badge" style={{ background: 'var(--surface2)', color: 'var(--txt3)', border: '1px solid var(--border)' }}>
                        {c.type}
                      </span>
                      {c.important && <span style={{ fontSize: 12 }}>⭐</span>}
                    </div>

                    <div style={{ display: 'flex', gap: 14, marginBottom: c.summary ? 8 : 0 }}>
                      <span style={{ fontSize: 10, color: 'var(--txt4)' }}>{fmtDate(c.date)}</span>
                      {c.duration && <span style={{ fontSize: 10, color: 'var(--txt4)' }}>⏱ {c.duration}</span>}
                      <span style={{ fontSize: 10, color: dirColor[c.direction], fontWeight: 700 }}>{c.direction}</span>
                    </div>

                    {c.summary && (
                      <div style={{ fontSize: 11, color: 'var(--txt3)', lineHeight: 1.6, marginBottom: 4 }}>
                        {c.summary}
                      </div>
                    )}

                    {c.followUp && (
                      <div style={{ fontSize: 10, color: '#f59e0b', marginTop: 4 }}>
                        → Follow up: {c.followUp} {c.followUpDate && `(${fmtDate(c.followUpDate)})`}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => toggleImportant(c.id)}
                      style={{ color: c.important ? '#f59e0b' : 'var(--txt4)' }}
                    >
                      ★
                    </button>
                    <button className="btn btn-ghost btn-xs" onClick={() => openEdit(c)}>Edit</button>
                    <button className="btn btn-danger btn-xs" onClick={() => del(c.id)}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* MODAL */}
      {modal && (
        <Modal title={edit ? 'Edit Call Log' : 'Log a Call'} onClose={() => { setModal(false); setEdit(null); }}>
          <Field label="Person / Organization">
            <input className="inp" placeholder="Name, company, or organization" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
          </Field>
          <Field label="Phone / Contact (optional)">
            <input className="inp" placeholder="+1 234 567 8900" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </Field>
          <div className="g2">
            <Field label="Type">
              <select className="inp" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Direction">
              <select className="inp" value={form.direction} onChange={e => setForm(f => ({ ...f, direction: e.target.value }))}>
                {DIRECTIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
          </div>
          <div className="g2">
            <Field label="Date">
              <input className="inp" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </Field>
            <Field label="Duration (optional)">
              <input className="inp" placeholder="e.g. 20 min" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
            </Field>
          </div>
          <Field label="Summary / Notes">
            <textarea className="inp" rows={3} placeholder="What was discussed?" value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} style={{ resize: 'vertical' }} />
          </Field>
          <Field label="Follow-up action (optional)">
            <input className="inp" placeholder="e.g. Send email with proposal" value={form.followUp} onChange={e => setForm(f => ({ ...f, followUp: e.target.value }))} />
          </Field>
          {form.followUp && (
            <Field label="Follow-up date">
              <input className="inp" type="date" value={form.followUpDate} onChange={e => setForm(f => ({ ...f, followUpDate: e.target.value }))} />
            </Field>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={save}>{edit ? 'Save' : 'Log Call'}</button>
            <button className="btn btn-ghost" onClick={() => { setModal(false); setEdit(null); }}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}