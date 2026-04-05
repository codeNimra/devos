import { useState } from 'react';
import { Modal, Field, Empty } from '../components';
import { genId } from '../utils/id.js';
import { today, fmtDate } from '../utils/dates.js';

const GENRES    = ['Self-Help', 'Fiction', 'Science', 'Biography', 'Technology', 'Business', 'History', 'Health', 'Spirituality', 'Other'];
const STATUSES  = ['Want to Read', 'Reading', 'Completed', 'Abandoned'];
const STATUS_COLORS = { 'Want to Read': '#64748b', 'Reading': '#00d4ff', 'Completed': '#10b981', 'Abandoned': '#ef4444' };

const blank = () => ({
  id: genId(), title: '', author: '', genre: 'Self-Help', status: 'Want to Read',
  totalPages: '', currentPage: '', startDate: '', endDate: '',
  rating: 0, notes: '', keyTakeaway: '',
});

export default function Books({ data, setData }) {
  const [modal, setModal]  = useState(false);
  const [form,  setForm]   = useState(blank());
  const [edit,  setEdit]   = useState(null);
  const [filter, setFilter] = useState('All');

  const save = () => {
    if (!form.title.trim()) return;
    if (edit) {
      setData(prev => prev.map(b => b.id === edit ? { ...form } : b));
    } else {
      setData(prev => [...prev, { ...form }]);
    }
    setModal(false); setEdit(null); setForm(blank());
  };

  const del = (id)        => setData(prev => prev.filter(b => b.id !== id));
  const openEdit = (b)    => { setForm({ ...b }); setEdit(b.id); setModal(true); };
  const setRating = (r)   => setForm(f => ({ ...f, rating: r }));

  const filtered = filter === 'All' ? data : data.filter(b => b.status === filter);

  const reading   = data.filter(b => b.status === 'Reading').length;
  const completed = data.filter(b => b.status === 'Completed').length;
  const total     = data.length;

  const readingPct = b => {
    if (!b.totalPages || !b.currentPage) return 0;
    return Math.min(100, Math.round(b.currentPage / b.totalPages * 100));
  };

  return (
    <div className="fade">
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800 }}>Books</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 3 }}>
            Track your reading life — every book shapes who you become
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(blank()); setEdit(null); setModal(true); }}>
          + Add Book
        </button>
      </div>

      {/* STATS */}
      {data.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
          {[
            { label: 'Total Books', value: total,     color: '#00d4ff' },
            { label: 'Reading Now', value: reading,   color: '#f59e0b' },
            { label: 'Completed',   value: completed, color: '#10b981' },
            { label: 'This Year',   value: data.filter(b => b.endDate?.startsWith(new Date().getFullYear().toString())).length, color: '#7c3aed' },
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
            {s !== 'All' && <span style={{ marginLeft: 5, opacity: .7 }}>
              {data.filter(b => b.status === s).length}
            </span>}
          </button>
        ))}
      </div>

      {/* BOOKS GRID */}
      {filtered.length === 0
        ? <Empty icon="📖" text="No books here yet. Start tracking your reading journey." onAdd={() => setModal(true)} />
        : (
          <div className="g2">
            {filtered.map(b => {
              const pct  = readingPct(b);
              const sc   = STATUS_COLORS[b.status] || '#64748b';

              return (
                <div key={b.id} className="card" style={{ padding: 20 }}>
                  {/* Title + author */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: 'var(--txt)', marginBottom: 3, lineHeight: 1.3 }}>
                      {b.title}
                    </div>
                    {b.author && (
                      <div style={{ fontSize: 11, color: 'var(--txt4)' }}>by {b.author}</div>
                    )}
                  </div>

                  {/* Status + Genre */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: sc + '18', color: sc, border: `1px solid ${sc}30` }}>
                      {b.status}
                    </span>
                    <span className="badge" style={{ background: 'var(--surface2)', color: 'var(--txt3)', border: '1px solid var(--border)' }}>
                      {b.genre}
                    </span>
                  </div>

                  {/* Progress bar for reading */}
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

                  {/* Rating (completed) */}
                  {b.status === 'Completed' && b.rating > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      {[1,2,3,4,5].map(r => (
                        <span key={r} style={{ fontSize: 14, color: r <= b.rating ? '#f59e0b' : 'var(--txt5)' }}>★</span>
                      ))}
                    </div>
                  )}

                  {/* Key takeaway */}
                  {b.keyTakeaway && (
                    <div style={{
                      fontSize: 11, color: 'var(--txt3)', fontStyle: 'italic',
                      lineHeight: 1.6, marginBottom: 12,
                      padding: '8px 12px', background: 'var(--surface2)',
                      borderRadius: 8, borderLeft: '3px solid #7c3aed55',
                    }}>
                      "{b.keyTakeaway}"
                    </div>
                  )}

                  {/* Dates */}
                  <div style={{ fontSize: 10, color: 'var(--txt5)', marginBottom: 12 }}>
                    {b.startDate && `Started: ${fmtDate(b.startDate)}`}
                    {b.startDate && b.endDate && ' · '}
                    {b.endDate && `Finished: ${fmtDate(b.endDate)}`}
                  </div>

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
        <Modal title={edit ? 'Edit Book' : 'Add Book'} onClose={() => { setModal(false); setEdit(null); }}>
          <Field label="Book Title">
            <input className="inp" placeholder="Title of the book" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
          </Field>
          <Field label="Author">
            <input className="inp" placeholder="Author name" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
          </Field>
          <div className="g2">
            <Field label="Genre">
              <select className="inp" value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}>
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className="inp" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          {(form.status === 'Reading' || form.status === 'Completed') && (
            <div className="g2">
              <Field label="Total pages">
                <input className="inp" type="number" placeholder="e.g. 320" value={form.totalPages} onChange={e => setForm(f => ({ ...f, totalPages: e.target.value }))} />
              </Field>
              <Field label="Current page">
                <input className="inp" type="number" placeholder="e.g. 120" value={form.currentPage} onChange={e => setForm(f => ({ ...f, currentPage: e.target.value }))} />
              </Field>
            </div>
          )}
          <div className="g2">
            <Field label="Start date">
              <input className="inp" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </Field>
            <Field label="End date">
              <input className="inp" type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </Field>
          </div>
          {form.status === 'Completed' && (
            <Field label="Rating">
              <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
                {[1,2,3,4,5].map(r => (
                  <span
                    key={r}
                    onClick={() => setRating(r)}
                    style={{ fontSize: 24, cursor: 'pointer', color: r <= form.rating ? '#f59e0b' : 'var(--txt5)', transition: 'color .15s' }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </Field>
          )}
          <Field label="Key takeaway / Favourite quote">
            <textarea className="inp" rows={2} placeholder="What's the most important thing you learned or loved?" value={form.keyTakeaway} onChange={e => setForm(f => ({ ...f, keyTakeaway: e.target.value }))} style={{ resize: 'vertical' }} />
          </Field>
          <Field label="Notes">
            <textarea className="inp" rows={2} placeholder="Personal notes about this book" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: 'vertical' }} />
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={save}>{edit ? 'Save' : 'Add Book'}</button>
            <button className="btn btn-ghost" onClick={() => { setModal(false); setEdit(null); }}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}