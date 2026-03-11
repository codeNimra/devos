import { Modal, Field, Empty } from '../components';
import { useState }    from 'react';
import { genId }       from '../utils/id.js';
import { fmtDate, today } from '../utils/dates.js';
import { MOODS }       from '../constants/statuses.js';

export default function Journal({ data, setData }) {
  const [show, setShow] = useState(false);
  const [view, setView] = useState(null);

  const blank = { date: today(), mood: 3, title: '', content: '', tags: '' };
  const [f, setF] = useState(blank);

  const save = () => {
    if (!f.content) return;
    setData((p) => [{ ...f, id: genId() }, ...p]);
    setShow(false);
    setF({ ...blank });
  };
  const del = (id) => setData((p) => p.filter((x) => x.id !== id));

  const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>Dev Journal</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>{data.length} entries</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setF({ ...blank }); setShow(true); }}>+ New Entry</button>
      </div>

      {sorted.length === 0
        ? <Empty icon="📓" text="Start your dev journal" />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sorted.map((e) => {
              const mood = MOODS.find((m) => m.val === e.mood) || MOODS[2];
              return (
                <div key={e.id} className="card" style={{ padding: 18, cursor: 'pointer' }} onClick={() => setView(e)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 18 }}>{mood.icon}</span>
                        <div>
                          <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: 'var(--txt)' }}>{e.title || 'Untitled Entry'}</div>
                          <div style={{ fontSize: 10, color: 'var(--txt4)' }}>{fmtDate(e.date)} · {mood.label}</div>
                        </div>
                      </div>
                      <p style={{ color: 'var(--txt3)', fontSize: 11, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {e.content}
                      </p>
                      {e.tags && (
                        <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                          {e.tags.split(',').map((t, i) => (
                            <span key={i} style={{ padding: '2px 7px', borderRadius: 20, background: 'var(--input-bg)', border: '1px solid var(--border)', fontSize: 9, color: 'var(--txt4)' }}>#{t.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={(ev) => { ev.stopPropagation(); del(e.id); }} className="btn btn-danger btn-sm" style={{ marginLeft: 10 }}>✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* New entry modal */}
      {show && (
        <Modal title="New Journal Entry" onClose={() => setShow(false)} wide>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <div className="g2">
              <Field label="DATE">            <input className="inp" type="date" value={f.date}  onChange={(e) => setF((p) => ({ ...p, date:  e.target.value }))} /></Field>
              <Field label="TITLE (optional)"><input className="inp" placeholder="What was today about?" value={f.title} onChange={(e) => setF((p) => ({ ...p, title: e.target.value }))} /></Field>
            </div>
            <Field label="MOOD">
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                {MOODS.map((m) => (
                  <button key={m.val} onClick={() => setF((p) => ({ ...p, mood: m.val }))} title={m.label}
                    style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `2px solid ${f.mood === m.val ? '#00d4ff' : 'var(--border)'}`, background: f.mood === m.val ? '#00d4ff12' : 'transparent', cursor: 'pointer', fontSize: 20, transition: 'all .15s' }}>
                    {m.icon}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="ENTRY *">
              <textarea className="inp" placeholder="What did you build, learn, or struggle with today?" rows={6} value={f.content} onChange={(e) => setF((p) => ({ ...p, content: e.target.value }))} style={{ resize: 'vertical' }} />
            </Field>
            <Field label="TAGS"><input className="inp" placeholder="hackathon, debugging, win…" value={f.tags} onChange={(e) => setF((p) => ({ ...p, tags: e.target.value }))} /></Field>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button className="btn btn-ghost"   style={{ flex: 1 }} onClick={() => setShow(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={save}>Save Entry</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Read entry modal */}
      {view && (
        <Modal title={view.title || 'Journal Entry'} onClose={() => setView(null)} wide>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 22 }}>{MOODS.find((m) => m.val === view.mood)?.icon}</span>
            <div>
              <div style={{ color: 'var(--txt3)', fontSize: 12 }}>{fmtDate(view.date)}</div>
              <div style={{ color: 'var(--txt4)', fontSize: 11 }}>{MOODS.find((m) => m.val === view.mood)?.label}</div>
            </div>
          </div>
          <p style={{ color: 'var(--txt2)', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{view.content}</p>
          {view.tags && (
            <div style={{ display: 'flex', gap: 5, marginTop: 14, flexWrap: 'wrap' }}>
              {view.tags.split(',').map((t, i) => (
                <span key={i} style={{ padding: '3px 9px', borderRadius: 20, background: 'var(--input-bg)', border: '1px solid var(--border)', fontSize: 10, color: 'var(--txt4)' }}>#{t.trim()}</span>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
