import { useState } from 'react';
import { Modal, Field, Empty } from '../components';
import { genId } from '../utils/id.js';
import { today, fmtDate } from '../utils/dates.js';

const CATEGORIES = ['Creative', 'Sports & Fitness', 'Music', 'Reading', 'Gaming', 'Cooking', 'Travel', 'Learning', 'Social', 'Other'];
const COLORS     = ['#00d4ff','#10b981','#f59e0b','#ef4444','#7c3aed','#f43f5e','#06b6d4','#84cc16'];

const blank = () => ({
  id: genId(), name: '', category: 'Creative', color: '#7c3aed',
  goalHoursPerWeek: '2', note: '', nextSession: '', loggedSessions: [],
});

export default function Hobbies({ data, setData }) {
  const [modal,  setModal]  = useState(false);
  const [logModal, setLogModal] = useState(null); // hobby id
  const [form,   setForm]   = useState(blank());
  const [edit,   setEdit]   = useState(null);
  const [logHours, setLogHours] = useState('1');
  const [logNote, setLogNote] = useState('');

  const save = () => {
    if (!form.name.trim()) return;
    if (edit) {
      setData(prev => prev.map(h => h.id === edit ? { ...form } : h));
    } else {
      setData(prev => [...prev, { ...form }]);
    }
    setModal(false); setEdit(null); setForm(blank());
  };

  const del = (id) => setData(prev => prev.filter(h => h.id !== id));

  const logSession = (id) => {
    setData(prev => prev.map(h => {
      if (h.id !== id) return h;
      return {
        ...h,
        loggedSessions: [...h.loggedSessions, {
          date: today(), hours: parseFloat(logHours) || 1, note: logNote
        }]
      };
    }));
    setLogModal(null); setLogHours('1'); setLogNote('');
  };

  const openEdit = (h) => { setForm({ ...h }); setEdit(h.id); setModal(true); };

  const weekHours = (h) => {
    const oneWeekAgo = new Date(); oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return h.loggedSessions
      .filter(s => new Date(s.date) >= oneWeekAgo)
      .reduce((sum, s) => sum + (s.hours || 0), 0);
  };

  const totalHours = (h) => h.loggedSessions.reduce((sum, s) => sum + (s.hours || 0), 0);

  return (
    <div className="fade">
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800 }}>Hobbies</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 3 }}>
            Make time for what makes you alive
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(blank()); setEdit(null); setModal(true); }}>
          + Add Hobby
        </button>
      </div>

      {/* HOBBY CARDS */}
      {data.length === 0
        ? <Empty icon="🎨" text="No hobbies tracked yet. Add something you love to make sure it gets your time." onAdd={() => setModal(true)} />
        : (
          <div className="g2">
            {data.map(h => {
              const wh  = weekHours(h);
              const th  = totalHours(h);
              const goal = parseFloat(h.goalHoursPerWeek) || 1;
              const pct  = Math.min(100, Math.round(wh / goal * 100));
              const sessions = h.loggedSessions.length;

              return (
                <div key={h.id} className="card" style={{ padding: 20 }}>
                  {/* Top */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, color: 'var(--txt)', marginBottom: 4 }}>
                        {h.name}
                      </div>
                      <span className="badge" style={{ background: h.color + '18', color: h.color, border: `1px solid ${h.color}30` }}>
                        {h.category}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-xs" onClick={() => openEdit(h)}>Edit</button>
                      <button className="btn btn-danger btn-xs" onClick={() => del(h.id)}>✕</button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                    {[
                      { label: 'This Week', value: `${wh}h`, color: wh >= goal ? '#10b981' : 'var(--txt)' },
                      { label: 'Goal/Week', value: `${goal}h`, color: h.color },
                      { label: 'Total Hours', value: `${th}h`, color: 'var(--txt2)' },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: 'center', background: 'var(--surface2)', borderRadius: 8, padding: '8px 4px' }}>
                        <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 9, color: 'var(--txt4)', marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Progress */}
                  <div style={{ marginBottom: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 10, color: 'var(--txt4)' }}>Weekly goal progress</span>
                      <span style={{ fontSize: 10, color: pct >= 100 ? '#10b981' : h.color, fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 100 ? '#10b981' : h.color }} />
                    </div>
                  </div>

                  {h.nextSession && (
                    <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 10 }}>
                      📅 Next: {fmtDate(h.nextSession)}
                    </div>
                  )}

                  {h.note && (
                    <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 6, fontStyle: 'italic' }}>
                      "{h.note}"
                    </div>
                  )}

                  {/* Log session button */}
                  <button
                    className="btn btn-ghost"
                    style={{ width: '100%', marginTop: 14, fontSize: 11, color: h.color, borderColor: h.color + '44' }}
                    onClick={() => setLogModal(h.id)}
                  >
                    + Log Session
                  </button>
                </div>
              );
            })}
          </div>
        )}

      {/* ADD/EDIT MODAL */}
      {modal && (
        <Modal title={edit ? 'Edit Hobby' : 'Add Hobby'} onClose={() => { setModal(false); setEdit(null); }}>
          <Field label="Hobby Name">
            <input className="inp" placeholder="e.g. Watercolor painting, Guitar, Running" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
          </Field>
          <Field label="Category">
            <select className="inp" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Goal hours per week">
            <input className="inp" type="number" min="0.5" step="0.5" value={form.goalHoursPerWeek} onChange={e => setForm(f => ({ ...f, goalHoursPerWeek: e.target.value }))} />
          </Field>
          <Field label="Next planned session">
            <input className="inp" type="date" value={form.nextSession} onChange={e => setForm(f => ({ ...f, nextSession: e.target.value }))} />
          </Field>
          <Field label="Color">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 4 }}>
              {COLORS.map(c => (
                <div key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                  width: 28, height: 28, borderRadius: 7, background: c, cursor: 'pointer',
                  border: form.color === c ? '3px solid #fff' : '3px solid transparent',
                  boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none',
                  transition: 'all .15s',
                }} />
              ))}
            </div>
          </Field>
          <Field label="Why this hobby? (optional)">
            <input className="inp" placeholder="What do you love about it?" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={save}>{edit ? 'Save' : 'Add Hobby'}</button>
            <button className="btn btn-ghost" onClick={() => { setModal(false); setEdit(null); }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* LOG SESSION MODAL */}
      {logModal && (
        <Modal title="Log Session" onClose={() => setLogModal(null)}>
          <Field label="Hours spent">
            <input className="inp" type="number" min="0.5" step="0.5" value={logHours} onChange={e => setLogHours(e.target.value)} autoFocus />
          </Field>
          <Field label="Notes (optional)">
            <input className="inp" placeholder="How did it go?" value={logNote} onChange={e => setLogNote(e.target.value)} />
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => logSession(logModal)}>Log It</button>
            <button className="btn btn-ghost" onClick={() => setLogModal(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}