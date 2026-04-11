import { useState } from 'react';
import { Modal, Field, Empty } from '../components';
import { genId } from '../utils/id.js';
import { today, fmtDate } from '../utils/dates.js';

const GENRES   = ['Self-Help', 'Fiction', 'Science', 'Biography', 'Technology', 'Business', 'History', 'Health', 'Spirituality', 'Religion', 'Psychology', 'Other'];
const STATUSES = ['Want to Read', 'Reading', 'Completed', 'Abandoned'];
const ST_COLOR = { 'Want to Read': '#64748b', Reading: '#00d4ff', Completed: '#10b981', Abandoned: '#ef4444' };

const blank = () => ({
  id: genId(), title: '', author: '', genre: 'Self-Help',
  status: 'Want to Read', totalPages: '', currentPage: '',
  startDate: '', endDate: '', rating: 0, notes: '', keyTakeaway: '',
});

export default function Books({ data, setData }) {
  const [modal,  setModal]  = useState(false);
  const [form,   setForm]   = useState(blank());
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('All');

  const openAdd  = ()  => { setForm(blank()); setEditId(null); setModal(true); };
  const openEdit = (b) => { setForm({ ...b }); setEditId(b.id); setModal(true); };
  const del      = (id) => setData(prev => prev.filter(b => b.id !== id));

  const save = () => {
    if (!form.title.trim()) return;
    if (editId) setData(prev => prev.map(b => b.id === editId ? { ...form } : b));
    else        setData(prev => [...prev, { ...form }]);
    setModal(false);
    setEditId(null);
  };

  const filtered = filter === 'All' ? data : data.filter(b => b.status === filter);

  const readPct = (b) => {
    if (!b.totalPages || !b.currentPage) return 0;
    return Math.min(100, Math.round(parseInt(b.currentPage) / parseInt(b.totalPages) * 100));
  };

  const yearNow     = new Date().getFullYear().toString();
  const doneThisYear = data.filter(b => b.status === 'Completed' && b.endDate?.startsWith(yearNow)).length;

  return (
    <div className="fade">

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800 }}>Books</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 3 }}>Track your reading life — every book shapes who you become</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Book</button>
      </div>

      {/* STATS */}
      {data.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
          {[
            { label: 'Total Books',  value: data.length,                                        color: '#00d4ff' },
            { label: 'Reading Now',  value: data.filter(b => b.status === 'Reading').length,    color: '#f59e0b' },
            { label: 'Completed',    value: data.filter(b => b.status === 'Completed').length,  color: '#10b981' },
            { label: 'This Year',    value: doneThisYear,                                       color: '#7c3aed' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* FILTER */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['All', ...STATUSES].map(s => (
          <button
            key={s}
            className="pill"
            onClick={() => setFilter(s)}
            style={{
              background: filter === s ? '#00d4ff' : 'var(--surface2)',
              color:      filter === s ? '#05050f' : 'var(--txt3)',
              border:     `1px solid ${filter === s ? '#00d4ff' : 'var(--border)'}`,
              fontSize: 11,
            }}
          >
            {s}
            {s !== 'All' && (
              <span style={{ marginLeft: 5, opacity: .7 }}>
                {data.filter(b => b.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* BOOKS GRID */}
      {filtered.length === 0
        ? <Empty icon="📖" text={data.length === 0 ? "No books yet. Start tracking your reading journey." : "No books match this filter."} onAdd={data.length === 0 ? openAdd : null} />
        : (
          <div className="g2">
            {filtered.map(b => {
              const pct = readPct(b);
              const sc  = ST_COLOR[b.status] || '#64748b';
              return (
                <div key={b.id} className="card" style={{ padding: 20 }}>
                  {/* Title + author */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, color: 'var(--txt)', marginBottom: 3, lineHeight: 1.3 }}>
                      {b.title}
                    </div>
                    {b.author && <div style={{ fontSize: 11, color: 'var(--txt4)' }}>by {b.author}</div>}
                  </div>

                  {/* Status + genre */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: sc + '18', color: sc, border: `1px solid ${sc}30` }}>{b.status}</span>
                    <span className="badge" style={{ background: 'var(--surface2)', color: 'var(--txt3)', border: '1px solid var(--border)' }}>{b.genre}</span>
                  </div>

                  {/* Progress bar for Reading */}
                  {b.status === 'Reading' && b.totalPages && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 10, color: 'var(--txt4)' }}>Progress</span>
                        <span style={{ fontSize: 10, color: '#00d4ff', fontWeight: 700 }}>
                          {b.currentPage || 0}/{b.totalPages} pages ({pct}%)
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: '#00d4ff' }} />
                      </div>
                    </div>
                  )}

                  {/* Star rating */}
                  {b.status === 'Completed' && b.rating > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      {[1,2,3,4,5].map(r => (
                        <span key={r} style={{ fontSize: 15, color: r <= b.rating ? '#f59e0b' : 'var(--txt5)' }}>★</span>
                      ))}
                    </div>
                  )}

                  {/* Key takeaway */}
                  {b.keyTakeaway && (
                    <div style={{
                      fontSize: 11, color: 'var(--txt3)', fontStyle: 'italic', lineHeight: 1.6,
                      marginBottom: 12, padding: '8px 12px',
                      background: 'var(--surface2)', borderRadius: 8,
                      borderLeft: '3px solid #7c3aed55',
                    }}>
                      "{b.keyTakeaway}"
                    </div>
                  )}

                  {/* Dates */}
                  {(b.startDate || b.endDate) && (
                    <div style={{ fontSize: 10, color: 'var(--txt5)', marginBottom: 12 }}>
                      {b.startDate && `Started: ${fmtDate(b.startDate)}`}
                      {b.startDate && b.endDate && ' · '}
                      {b.endDate && `Finished: ${fmtDate(b.endDate)}`}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => openEdit(b)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(b.id)}>Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* MODAL */}
      {modal && (
        <Modal title={editId ? 'Edit Book' : 'Add Book'} onClose={() => { setModal(false); setEditId(null); }}>
          <Field label="Book Title">
            <input className="inp" placeholder="Title of the book" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} autoFocus />
          </Field>
          <Field label="Author">
            <input className="inp" placeholder="Author name" value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} />
          </Field>
          <div className="g2">
            <Field label="Genre">
              <select className="inp" value={form.genre} onChange={e => setForm(p => ({ ...p, genre: e.target.value }))}>
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className="inp" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          {(form.status === 'Reading' || form.status === 'Completed') && (
            <div className="g2">
              <Field label="Total pages">
                <input className="inp" type="number" placeholder="e.g. 320" value={form.totalPages} onChange={e => setForm(p => ({ ...p, totalPages: e.target.value }))} />
              </Field>
              <Field label="Current page">
                <input className="inp" type="number" placeholder="e.g. 120" value={form.currentPage} onChange={e => setForm(p => ({ ...p, currentPage: e.target.value }))} />
              </Field>
            </div>
          )}
          <div className="g2">
            <Field label="Start date">
              <input className="inp" type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
            </Field>
            <Field label="End date">
              <input className="inp" type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} />
            </Field>
          </div>
          {form.status === 'Completed' && (
            <Field label="Rating">
              <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
                {[1,2,3,4,5].map(r => (
                  <span key={r} onClick={() => setForm(p => ({ ...p, rating: r }))} style={{ fontSize: 26, cursor: 'pointer', color: r <= form.rating ? '#f59e0b' : 'var(--txt5)', transition: 'color .15s' }}>★</span>
                ))}
              </div>
            </Field>
          )}
          <Field label="Key takeaway / Favourite quote">
            <textarea className="inp" rows={2} placeholder="What's the most important thing you learned?" value={form.keyTakeaway} onChange={e => setForm(p => ({ ...p, keyTakeaway: e.target.value }))} style={{ resize: 'vertical' }} />
          </Field>
          <Field label="Notes">
            <textarea className="inp" rows={2} placeholder="Personal notes" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ resize: 'vertical' }} />
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={save}>{editId ? 'Save' : 'Add Book'}</button>
            <button className="btn btn-ghost" onClick={() => { setModal(false); setEditId(null); }}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}