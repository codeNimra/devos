import { useState } from 'react';
import { Modal, Field, Empty } from '../components';
import { genId } from '../utils/id.js';
import { today, fmtDate } from '../utils/dates.js';

const TYPES     = ['Walk/Run', 'Cardio', 'Strength', 'Yoga', 'Sports', 'Swimming', 'Cycling', 'Stretching', 'HIIT', 'Other'];
const INTENSITY = ['Light', 'Moderate', 'Intense'];
const INT_COLOR = { Light: '#10b981', Moderate: '#f59e0b', Intense: '#ef4444' };
const TYPE_ICON = { 'Walk/Run': '🚶', Cardio: '🏃', Strength: '💪', Yoga: '🧘', Sports: '⚽', Swimming: '🏊', Cycling: '🚴', Stretching: '🤸', HIIT: '🔥', Other: '🏋️' };

const blankSession = () => ({
  id: genId(), type: 'Walk/Run', date: today(),
  duration: '30', intensity: 'Moderate', calories: '', distance: '', notes: '',
});

export default function Exercise({ data, setData }) {
  const sessions = data?.sessions || [];
  const schedule = data?.schedule || { wakeTime: '', exerciseTime: '', sleepTime: '', waterGoal: '8' };

  const [modal,      setModal]      = useState(false);
  const [schedModal, setSchedModal] = useState(false);
  const [form,       setForm]       = useState(blankSession());
  const [editId,     setEditId]     = useState(null);
  const [schedForm,  setSchedForm]  = useState({ ...schedule });

  const setSessions = (val) => setData(prev => ({ ...prev, sessions: val }));

  const openAdd  = ()  => { setForm(blankSession()); setEditId(null); setModal(true); };
  const openEdit = (s) => { setForm({ ...s }); setEditId(s.id); setModal(true); };
  const del      = (id) => setSessions(sessions.filter(s => s.id !== id));

  const save = () => {
    if (!form.type) return;
    if (editId) setSessions(sessions.map(s => s.id === editId ? { ...form } : s));
    else        setSessions([{ ...form }, ...sessions]);
    setModal(false);
    setEditId(null);
  };

  const saveSchedule = () => {
    setData(prev => ({ ...prev, schedule: { ...schedForm } }));
    setSchedModal(false);
  };

  const weekAgo      = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const weekSessions = sessions.filter(s => new Date(s.date) >= weekAgo);
  const totalMin     = weekSessions.reduce((t, s) => t + (parseInt(s.duration) || 0), 0);
  const totalCal     = weekSessions.reduce((t, s) => t + (parseInt(s.calories) || 0), 0);
  const todayDone    = sessions.some(s => s.date === today());
  const hasSchedule  = schedule.wakeTime || schedule.exerciseTime || schedule.sleepTime;

  return (
    <div className="fade">

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800 }}>Exercise</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 3 }}>Move every day — your body keeps the score</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => { setSchedForm({ ...schedule }); setSchedModal(true); }}>⏰ Schedule</button>
          <button className="btn btn-primary" onClick={openAdd}>+ Log Workout</button>
        </div>
      </div>

      {/* SCHEDULE BANNER */}
      {hasSchedule && (
        <div className="card" style={{ padding: '16px 22px', marginBottom: 18, display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
          {schedule.wakeTime && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: '#f59e0b' }}>🌅 {schedule.wakeTime}</div>
              <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 2, letterSpacing: 1 }}>WAKE UP</div>
            </div>
          )}
          {schedule.exerciseTime && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: '#10b981' }}>💪 {schedule.exerciseTime}</div>
              <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 2, letterSpacing: 1 }}>EXERCISE</div>
            </div>
          )}
          {schedule.sleepTime && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: '#7c3aed' }}>🌙 {schedule.sleepTime}</div>
              <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 2, letterSpacing: 1 }}>SLEEP</div>
            </div>
          )}
          {schedule.waterGoal && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: '#00d4ff' }}>💧 {schedule.waterGoal}</div>
              <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 2, letterSpacing: 1 }}>GLASSES/DAY</div>
            </div>
          )}
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => { setSchedForm({ ...schedule }); setSchedModal(true); }}>Edit</button>
        </div>
      )}

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Sessions / Week', value: weekSessions.length, color: '#00d4ff', icon: '📅' },
          { label: 'Minutes / Week',  value: totalMin,            color: '#10b981', icon: '⏱' },
          { label: 'Calories',        value: totalCal || '—',     color: '#f59e0b', icon: '🔥' },
          { label: 'Today',           value: todayDone ? '✓' : '—', color: todayDone ? '#10b981' : 'var(--txt4)', icon: '💪' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* LOG */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 12 }}>WORKOUT LOG</div>

      {sessions.length === 0
        ? <Empty icon="💪" text="No workouts logged yet. Start with a 10-minute walk — every movement counts." onAdd={openAdd} />
        : sessions.map(s => {
            const ic   = TYPE_ICON[s.type] || '🏋️';
            const iCol = INT_COLOR[s.intensity] || '#64748b';
            return (
              <div key={s.id} className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{ic}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--txt)' }}>{s.type}</span>
                    <span className="badge" style={{ background: iCol + '18', color: iCol, border: `1px solid ${iCol}30` }}>{s.intensity}</span>
                    {s.date === today() && <span className="badge" style={{ background: '#10b98118', color: '#10b981', border: '1px solid #10b98130' }}>Today</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--txt4)', flexWrap: 'wrap' }}>
                    <span>⏱ {s.duration} min</span>
                    {s.calories && <span>🔥 {s.calories} cal</span>}
                    {s.distance && <span>📍 {s.distance}</span>}
                    <span>📅 {fmtDate(s.date)}</span>
                  </div>
                  {s.notes && <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 4, fontStyle: 'italic' }}>{s.notes}</div>}
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button className="btn btn-ghost btn-xs" onClick={() => openEdit(s)}>Edit</button>
                  <button className="btn btn-danger btn-xs" onClick={() => del(s.id)}>✕</button>
                </div>
              </div>
            );
          })}

      {/* LOG MODAL */}
      {modal && (
        <Modal title={editId ? 'Edit Workout' : 'Log Workout'} onClose={() => { setModal(false); setEditId(null); }}>
          <div className="g2">
            <Field label="Type">
              <select className="inp" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Date">
              <input className="inp" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </Field>
          </div>
          <div className="g2">
            <Field label="Duration (min)">
              <input className="inp" type="number" min="1" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} autoFocus />
            </Field>
            <Field label="Intensity">
              <select className="inp" value={form.intensity} onChange={e => setForm(p => ({ ...p, intensity: e.target.value }))}>
                {INTENSITY.map(i => <option key={i}>{i}</option>)}
              </select>
            </Field>
          </div>
          <div className="g2">
            <Field label="Calories (optional)">
              <input className="inp" type="number" placeholder="e.g. 250" value={form.calories} onChange={e => setForm(p => ({ ...p, calories: e.target.value }))} />
            </Field>
            <Field label="Distance (optional)">
              <input className="inp" placeholder="e.g. 3km" value={form.distance} onChange={e => setForm(p => ({ ...p, distance: e.target.value }))} />
            </Field>
          </div>
          <Field label="Notes (optional)">
            <input className="inp" placeholder="How did it feel?" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={save}>{editId ? 'Save' : 'Log It'}</button>
            <button className="btn btn-ghost" onClick={() => { setModal(false); setEditId(null); }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* SCHEDULE MODAL */}
      {schedModal && (
        <Modal title="Daily Schedule" onClose={() => setSchedModal(false)}>
          <p style={{ fontSize: 11, color: 'var(--txt4)', marginBottom: 16 }}>Set your daily routine times — shown as a banner on this page.</p>
          <Field label="Wake up time">
            <input className="inp" type="time" value={schedForm.wakeTime || ''} onChange={e => setSchedForm(p => ({ ...p, wakeTime: e.target.value }))} />
          </Field>
          <Field label="Exercise time">
            <input className="inp" type="time" value={schedForm.exerciseTime || ''} onChange={e => setSchedForm(p => ({ ...p, exerciseTime: e.target.value }))} />
          </Field>
          <Field label="Sleep time">
            <input className="inp" type="time" value={schedForm.sleepTime || ''} onChange={e => setSchedForm(p => ({ ...p, sleepTime: e.target.value }))} />
          </Field>
          <Field label="Daily water goal (glasses)">
            <input className="inp" type="number" min="1" max="20" value={schedForm.waterGoal || '8'} onChange={e => setSchedForm(p => ({ ...p, waterGoal: e.target.value }))} />
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveSchedule}>Save Schedule</button>
            <button className="btn btn-ghost" onClick={() => setSchedModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}