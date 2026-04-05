import { useState } from 'react';
import { Modal, Field, Empty } from '../components';
import { genId } from '../utils/id.js';
import { today, fmtDate } from '../utils/dates.js';

const TYPES     = ['Cardio', 'Strength', 'Yoga', 'Walk/Run', 'Sports', 'Swimming', 'Cycling', 'Stretching', 'HIIT', 'Other'];
const INTENSITY = ['Light', 'Moderate', 'Intense'];
const INT_COLOR = { Light: '#10b981', Moderate: '#f59e0b', Intense: '#ef4444' };

const blank = () => ({
  id: genId(), type: 'Walk/Run', date: today(), duration: '30',
  intensity: 'Moderate', calories: '', notes: '', distance: '',
});

export default function Exercise({ data, setData }) {
  const [modal, setModal]  = useState(false);
  const [form,  setForm]   = useState(blank());
  const [edit,  setEdit]   = useState(null);
  const [wakeTime, setWakeTime]   = useState(data.wakeTime  || '');
  const [sleepTime, setSleepTime] = useState(data.sleepTime || '');
  const [editSchedule, setEditSchedule] = useState(false);

  const sessions  = data.sessions  || [];
  const schedule  = data.schedule  || { wakeTime: '', sleepTime: '', exerciseTime: '', waterGoal: '8' };
  const [sched, setSched] = useState(schedule);

  const updateSessions = (val) => setData(prev => ({ ...prev, sessions: val }));
  const saveSchedule   = () => { setData(prev => ({ ...prev, schedule: sched })); setEditSchedule(false); };

  const save = () => {
    if (!form.type) return;
    if (edit) updateSessions(sessions.map(s => s.id === edit ? { ...form } : s));
    else      updateSessions([{ ...form }, ...sessions]);
    setModal(false); setEdit(null); setForm(blank());
  };

  const del      = (id) => updateSessions(sessions.filter(s => s.id !== id));
  const openEdit = (s)  => { setForm({ ...s }); setEdit(s.id); setModal(true); };

  const todaySessions = sessions.filter(s => s.date === today());
  const weekSessions  = sessions.filter(s => {
    const d = new Date(s.date);
    const now = new Date();
    const weekAgo = new Date(); weekAgo.setDate(now.getDate() - 7);
    return d >= weekAgo;
  });
  const totalMinutes  = weekSessions.reduce((sum, s) => sum + (parseInt(s.duration) || 0), 0);
  const totalCals     = weekSessions.reduce((sum, s) => sum + (parseInt(s.calories) || 0), 0);

  const typeIcon = {
    'Cardio': '🏃', 'Strength': '💪', 'Yoga': '🧘', 'Walk/Run': '🚶',
    'Sports': '⚽', 'Swimming': '🏊', 'Cycling': '🚴', 'Stretching': '🤸',
    'HIIT': '🔥', 'Other': '🏋️',
  };

  return (
    <div className="fade">
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800 }}>Exercise</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 3 }}>
            Move every day — your body keeps the score
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setEditSchedule(true)}>⏰ Schedule</button>
          <button className="btn btn-primary" onClick={() => { setForm(blank()); setEdit(null); setModal(true); }}>
            + Log Workout
          </button>
        </div>
      </div>

      {/* DAILY SCHEDULE BANNER */}
      {(schedule.wakeTime || schedule.exerciseTime || schedule.sleepTime) && (
        <div className="card" style={{ padding: '16px 20px', marginBottom: 18, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {schedule.wakeTime && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: '#f59e0b' }}>🌅 {schedule.wakeTime}</div>
              <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 2 }}>WAKE UP</div>
            </div>
          )}
          {schedule.exerciseTime && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: '#10b981' }}>💪 {schedule.exerciseTime}</div>
              <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 2 }}>EXERCISE</div>
            </div>
          )}
          {schedule.sleepTime && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: '#7c3aed' }}>🌙 {schedule.sleepTime}</div>
              <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 2 }}>SLEEP</div>
            </div>
          )}
          {schedule.waterGoal && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: '#00d4ff' }}>💧 {schedule.waterGoal}</div>
              <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 2 }}>GLASSES / DAY</div>
            </div>
          )}
        </div>
      )}

      {/* WEEKLY STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Sessions This Week', value: weekSessions.length,   color: '#00d4ff', icon: '📅' },
          { label: 'Minutes This Week',  value: totalMinutes,          color: '#10b981', icon: '⏱' },
          { label: 'Calories Burned',    value: totalCals || '—',      color: '#f59e0b', icon: '🔥' },
          { label: 'Today',              value: todaySessions.length ? '✓' : '—', color: todaySessions.length ? '#10b981' : 'var(--txt4)', icon: '💪' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* SESSION LIST */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 12 }}>
        WORKOUT LOG
      </div>
      {sessions.length === 0
        ? <Empty icon="💪" text="No workouts logged yet. Start with a 10-minute walk — every movement counts." onAdd={() => setModal(true)} />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sessions.map(s => {
              const ic = typeIcon[s.type] || '🏋️';
              const ic2 = INT_COLOR[s.intensity] || '#64748b';
              return (
                <div key={s.id} className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 28, flexShrink: 0 }}>{ic}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--txt)' }}>{s.type}</span>
                      <span className="badge" style={{ background: ic2 + '18', color: ic2, border: `1px solid ${ic2}30` }}>{s.intensity}</span>
                      {s.date === today() && <span className="badge" style={{ background: '#10b98118', color: '#10b981', border: '1px solid #10b98130' }}>Today</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--txt4)', flexWrap: 'wrap' }}>
                      <span>⏱ {s.duration} min</span>
                      {s.calories && <span>🔥 {s.calories} cal</span>}
                      {s.distance && <span>📍 {s.distance}</span>}
                      <span>📅 {fmtDate(s.date)}</span>
                    </div>
                    {s.notes && <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 5, fontStyle: 'italic' }}>{s.notes}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button className="btn btn-ghost btn-xs" onClick={() => openEdit(s)}>Edit</button>
                    <button className="btn btn-danger btn-xs" onClick={() => del(s.id)}>✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* LOG WORKOUT MODAL */}
      {modal && (
        <Modal title={edit ? 'Edit Workout' : 'Log Workout'} onClose={() => { setModal(false); setEdit(null); }}>
          <div className="g2">
            <Field label="Type">
              <select className="inp" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Date">
              <input className="inp" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </Field>
          </div>
          <div className="g2">
            <Field label="Duration (minutes)">
              <input className="inp" type="number" min="1" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} autoFocus />
            </Field>
            <Field label="Intensity">
              <select className="inp" value={form.intensity} onChange={e => setForm(f => ({ ...f, intensity: e.target.value }))}>
                {INTENSITY.map(i => <option key={i}>{i}</option>)}
              </select>
            </Field>
          </div>
          <div className="g2">
            <Field label="Calories (optional)">
              <input className="inp" type="number" placeholder="e.g. 250" value={form.calories} onChange={e => setForm(f => ({ ...f, calories: e.target.value }))} />
            </Field>
            <Field label="Distance (optional)">
              <input className="inp" placeholder="e.g. 3km" value={form.distance} onChange={e => setForm(f => ({ ...f, distance: e.target.value }))} />
            </Field>
          </div>
          <Field label="Notes (optional)">
            <input className="inp" placeholder="How did it feel?" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={save}>{edit ? 'Save' : 'Log It'}</button>
            <button className="btn btn-ghost" onClick={() => { setModal(false); setEdit(null); }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* SCHEDULE MODAL */}
      {editSchedule && (
        <Modal title="Daily Schedule" onClose={() => setEditSchedule(false)}>
          <p style={{ fontSize: 11, color: 'var(--txt4)', marginBottom: 16 }}>
            Set your daily routine times — shown on your Exercise dashboard.
          </p>
          <Field label="Wake up time">
            <input className="inp" type="time" value={sched.wakeTime || ''} onChange={e => setSched(s => ({ ...s, wakeTime: e.target.value }))} />
          </Field>
          <Field label="Exercise time">
            <input className="inp" type="time" value={sched.exerciseTime || ''} onChange={e => setSched(s => ({ ...s, exerciseTime: e.target.value }))} />
          </Field>
          <Field label="Sleep time">
            <input className="inp" type="time" value={sched.sleepTime || ''} onChange={e => setSched(s => ({ ...s, sleepTime: e.target.value }))} />
          </Field>
          <Field label="Daily water goal (glasses)">
            <input className="inp" type="number" min="1" max="20" value={sched.waterGoal || '8'} onChange={e => setSched(s => ({ ...s, waterGoal: e.target.value }))} />
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveSchedule}>Save Schedule</button>
            <button className="btn btn-ghost" onClick={() => setEditSchedule(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}