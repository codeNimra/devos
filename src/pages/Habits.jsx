import { useState } from 'react';
import { Modal, Field, Empty } from '../components';
import { genId } from '../utils/id.js';
import { today } from '../utils/dates.js';

const FREQUENCIES = ['Daily', 'Weekdays', 'Weekends', 'Weekly', 'Custom'];
const CATEGORIES  = ['Health', 'Work', 'Learning', 'Spiritual', 'Fitness', 'Family', 'Finance', 'Other'];
const COLORS      = ['#00d4ff','#10b981','#f59e0b','#ef4444','#7c3aed','#f43f5e','#06b6d4','#84cc16'];

const blank = () => ({
  id: genId(), name: '', category: 'Health', frequency: 'Daily',
  target: '1', unit: 'times', color: '#00d4ff', note: '',
  streak: 0, completedDates: [], createdAt: today(),
});

export default function Habits({ data, setData }) {
  const [modal, setModal] = useState(false);
  const [form,  setForm]  = useState(blank());
  const [edit,  setEdit]  = useState(null);

  const todayStr = today();

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

  const toggleToday = (id) => {
    setData(prev => prev.map(h => {
      if (h.id !== id) return h;
      const done      = h.completedDates.includes(todayStr);
      const dates     = done
        ? h.completedDates.filter(d => d !== todayStr)
        : [...h.completedDates, todayStr];
      const streak    = calcStreak(dates);
      return { ...h, completedDates: dates, streak };
    }));
  };

  const calcStreak = (dates) => {
    let streak = 0;
    let d = new Date();
    while (true) {
      const s = d.toISOString().split('T')[0];
      if (dates.includes(s)) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  };

  const openEdit = (h) => {
    setForm({ ...h }); setEdit(h.id); setModal(true);
  };

  const totalToday = data.filter(h => h.completedDates.includes(todayStr)).length;
  const pct = data.length ? Math.round(totalToday / data.length * 100) : 0;

  return (
    <div className="fade">
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800 }}>Habits</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 3 }}>
            Build the routines that build your life
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(blank()); setEdit(null); setModal(true); }}>
          + Add Habit
        </button>
      </div>

      {/* TODAY SUMMARY */}
      {data.length > 0 && (
        <div className="card" style={{ padding: '18px 22px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: 'var(--txt4)', fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
              TODAY'S PROGRESS
            </div>
            <div className="progress-bar" style={{ height: 7, borderRadius: 4 }}>
              <div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? '#10b981' : 'linear-gradient(90deg,#00d4ff,#7c3aed)' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: pct === 100 ? '#10b981' : '#00d4ff', lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 3 }}>{totalToday}/{data.length} done</div>
          </div>
          {pct === 100 && (
            <div style={{ fontSize: 28 }}>🎉</div>
          )}
        </div>
      )}

      {/* HABITS LIST */}
      {data.length === 0
        ? <Empty icon="✅" text="No habits yet. Add your first habit to start building your routine." onAdd={() => setModal(true)} />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.map(h => {
              const done      = h.completedDates.includes(todayStr);
              const last7     = Array.from({ length: 7 }, (_, i) => {
                const d = new Date(); d.setDate(d.getDate() - (6 - i));
                return h.completedDates.includes(d.toISOString().split('T')[0]);
              });

              return (
                <div key={h.id} className="card" style={{
                  padding: '16px 20px',
                  borderLeft: `4px solid ${h.color}`,
                  opacity: done ? 1 : 0.85,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

                    {/* Check button */}
                    <button
                      onClick={() => toggleToday(h.id)}
                      style={{
                        width: 36, height: 36, borderRadius: '50%', border: `2px solid ${h.color}`,
                        background: done ? h.color : 'transparent',
                        cursor: 'pointer', flexShrink: 0, fontSize: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all .2s',
                      }}
                    >
                      {done ? '✓' : ''}
                    </button>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: done ? 'var(--txt3)' : 'var(--txt)', textDecoration: done ? 'line-through' : 'none' }}>
                          {h.name}
                        </span>
                        <span className="badge" style={{ background: h.color + '18', color: h.color, border: `1px solid ${h.color}30` }}>
                          {h.category}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--txt4)' }}>{h.frequency}</span>
                      </div>
                      {/* 7-day streak dots */}
                      <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                        {last7.map((filled, i) => (
                          <div key={i} style={{
                            width: 8, height: 8, borderRadius: 2,
                            background: filled ? h.color : 'var(--border)',
                            transition: 'background .2s',
                          }} />
                        ))}
                        <span style={{ fontSize: 10, color: 'var(--txt4)', marginLeft: 6 }}>last 7 days</span>
                      </div>
                    </div>

                    {/* Streak */}
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: h.streak > 0 ? '#f59e0b' : 'var(--txt5)' }}>
                        {h.streak > 0 ? `🔥${h.streak}` : '—'}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--txt4)' }}>streak</div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button className="btn btn-ghost btn-xs" onClick={() => openEdit(h)}>Edit</button>
                      <button className="btn btn-danger btn-xs" onClick={() => del(h.id)}>✕</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* MODAL */}
      {modal && (
        <Modal title={edit ? 'Edit Habit' : 'New Habit'} onClose={() => { setModal(false); setEdit(null); }}>
          <Field label="Habit Name">
            <input className="inp" placeholder="e.g. Drink 8 glasses of water" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
          </Field>
          <Field label="Category">
            <select className="inp" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Frequency">
            <select className="inp" value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}>
              {FREQUENCIES.map(fr => <option key={fr}>{fr}</option>)}
            </select>
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
          <Field label="Notes (optional)">
            <input className="inp" placeholder="Why this habit matters to you" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={save}>
              {edit ? 'Save Changes' : 'Add Habit'}
            </button>
            <button className="btn btn-ghost" onClick={() => { setModal(false); setEdit(null); }}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}