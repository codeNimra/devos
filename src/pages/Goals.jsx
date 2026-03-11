import { Modal, Field, Empty } from '../components';
import { useState }              from 'react';
import { genId }                 from '../utils/id.js';
import { daysUntil, fmtDate }    from '../utils/dates.js';
import { urgColorHex, urgLabel } from '../utils/colors.js';

export default function Goals({ data, setData }) {
  const [show, setShow]       = useState(false);
  const [edit, setEdit]       = useState(null);
  const [expand, setExpand]   = useState(null);
  const [newTask, setNewTask] = useState('');

  const blank = { title: '', category: '', deadline: '', status: 'active', tasks: [] };
  const [f, setF] = useState(blank);

  const open = (g = null) => { setF(g ? { ...g } : { ...blank }); setEdit(g?.id || null); setShow(true); setNewTask(''); };

  const addTask = () => {
    if (!newTask.trim()) return;
    setF((p) => ({ ...p, tasks: [...(p.tasks || []), { id: genId(), text: newTask.trim(), done: false }] }));
    setNewTask('');
  };

  const save = () => {
    if (!f.title) return;
    edit
      ? setData((p) => p.map((x) => (x.id === edit ? { ...x, ...f } : x)))
      : setData((p) => [...p, { ...f, id: genId() }]);
    setShow(false);
  };

  const del        = (id)       => setData((p) => p.filter((x) => x.id !== id));
  const toggleTask = (gid, tid) => setData((p) => p.map((g) => g.id === gid ? { ...g, tasks: g.tasks.map((t) => t.id === tid ? { ...t, done: !t.done } : t) } : g));
  const doneGoal   = (id)       => setData((p) => p.map((g) => g.id === id ? { ...g, status: g.status === 'done' ? 'active' : 'done' } : g));

  return (
    <div className="fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>Goals & Milestones</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>{data.filter((g) => g.status === 'done').length}/{data.length} achieved</p>
        </div>
        <button className="btn btn-primary" onClick={() => open()}>+ Add Goal</button>
      </div>

      {data.length === 0
        ? <Empty icon="🎯" text="Set goals to stay on track" />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.map((g) => {
              const tasks      = g.tasks || [];
              const done       = tasks.filter((t) => t.done).length;
              const pct        = tasks.length ? Math.round(done / tasks.length * 100) : 0;
              const isExpanded = expand === g.id;
              const d          = daysUntil(g.deadline);

              return (
                <div key={g.id} className="card" style={{ padding: 18, opacity: g.status === 'done' ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                        {/* Done toggle */}
                        <button onClick={() => doneGoal(g.id)}
                          style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${g.status === 'done' ? '#10b981' : 'var(--border-strong)'}`, background: g.status === 'done' ? '#10b98120' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#10b981', flexShrink: 0 }}>
                          {g.status === 'done' ? '✓' : ''}
                        </button>
                        <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: g.status === 'done' ? 'var(--txt4)' : 'var(--txt)', textDecoration: g.status === 'done' ? 'line-through' : 'none' }}>{g.title}</span>
                        {g.category && <span className="badge" style={{ background: '#7c3aed22', color: '#7c3aed' }}>{g.category}</span>}
                      </div>
                      {g.deadline && (
                        <div style={{ color: 'var(--txt4)', fontSize: 10 }}>
                          📅 {fmtDate(g.deadline)} · <span style={{ color: urgColorHex(d) }}>{urgLabel(d)}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm"  onClick={() => setExpand(isExpanded ? null : g.id)}>{isExpanded ? '▲' : '▼'}</button>
                      <button className="btn btn-ghost btn-sm"  onClick={() => open(g)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(g.id)}>✕</button>
                    </div>
                  </div>

                  {/* Progress */}
                  {tasks.length > 0 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ color: 'var(--txt4)', fontSize: 10 }}>{done}/{tasks.length} tasks</span>
                        <span style={{ color: '#10b981', fontSize: 10 }}>{pct}%</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: '#10b981' }} /></div>
                    </>
                  )}

                  {/* Task list */}
                  {isExpanded && (
                    <div style={{ marginTop: 14 }}>
                      {tasks.map((t) => (
                        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid var(--divider)' }}>
                          <button onClick={() => toggleTask(g.id, t.id)}
                            style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${t.done ? '#10b981' : 'var(--border-strong)'}`, background: t.done ? '#10b98120' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#10b981', flexShrink: 0 }}>
                            {t.done ? '✓' : ''}
                          </button>
                          <span style={{ fontSize: 11, color: t.done ? 'var(--txt4)' : 'var(--txt2)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      {show && (
        <Modal title={edit ? 'Edit Goal' : 'Add Goal'} onClose={() => setShow(false)} wide>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <Field label="GOAL TITLE *"><input className="inp" placeholder="e.g. Win a hackathon this month" value={f.title} onChange={(e) => setF((p) => ({ ...p, title: e.target.value }))} /></Field>
            <div className="g2">
              <Field label="CATEGORY"><input className="inp" placeholder="Career, Learning, Health…" value={f.category} onChange={(e) => setF((p) => ({ ...p, category: e.target.value }))} /></Field>
              <Field label="DEADLINE">  <input className="inp" type="date" value={f.deadline}            onChange={(e) => setF((p) => ({ ...p, deadline: e.target.value }))} /></Field>
            </div>
            <Field label="TASKS / MILESTONES">
              <div style={{ display: 'flex', gap: 8, marginTop: 4, marginBottom: 8 }}>
                <input className="inp" placeholder="Add a task…" value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} />
                <button className="btn btn-ghost" onClick={addTask}>Add</button>
              </div>
              {(f.tasks || []).map((t, i) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--input-bg)', borderRadius: 7, marginBottom: 5 }}>
                  <span style={{ flex: 1, fontSize: 11, color: 'var(--txt2)' }}>{t.text}</span>
                  <button onClick={() => setF((p) => ({ ...p, tasks: p.tasks.filter((_, j) => j !== i) }))} style={{ background: 'none', border: 'none', color: 'var(--txt4)', cursor: 'pointer', fontSize: 13 }}>✕</button>
                </div>
              ))}
            </Field>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button className="btn btn-ghost"   style={{ flex: 1 }} onClick={() => setShow(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={save}>Save Goal</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
