import { Modal, Field, Empty } from '../components';
import { useState }    from 'react';
import { genId }       from '../utils/id.js';
import { fmtDate, today } from '../utils/dates.js';
import { NOTE_COLORS } from '../constants/statuses.js';

export default function Notes({ data, setData }) {
  const [show, setShow]     = useState(false);
  const [edit, setEdit]     = useState(null);
  const [search, setSearch] = useState('');

  const blank = { title: '', content: '', color: '#00d4ff', pinned: false };
  const [f, setF] = useState(blank);

  const open = (n = null) => { setF(n ? { ...n } : { ...blank }); setEdit(n?.id || null); setShow(true); };
  const save = () => {
    if (!f.content) return;
    edit
      ? setData((p) => p.map((x) => (x.id === edit ? { ...x, ...f } : x)))
      : setData((p) => [{ ...f, id: genId(), created: today() }, ...p]);
    setShow(false);
  };
  const del = (id) => setData((p) => p.filter((x) => x.id !== id));
  const pin = (id) => setData((p) => p.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n));

  const sorted   = [...data].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const filtered = sorted.filter((n) => n.title?.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>Quick Notes</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>{data.length} notes</p>
        </div>
        <button className="btn btn-primary" onClick={() => open()}>+ New Note</button>
      </div>

      <input className="inp" placeholder="🔍 Search notes…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: 16 }} />

      {filtered.length === 0
        ? <Empty icon="📋" text="No notes yet" />
        : (
          <div className="g2">
            {filtered.map((n) => (
              <div key={n.id} className="card" style={{ padding: 18, borderTop: `3px solid ${n.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <button onClick={() => pin(n.id)} title={n.pinned ? 'Unpin' : 'Pin'} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, opacity: n.pinned ? 1 : 0.3 }}>📌</button>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm"  onClick={() => open(n)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(n.id)}>✕</button>
                  </div>
                </div>
                {n.title && <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, marginBottom: 7, color: 'var(--txt)' }}>{n.title}</h4>}
                <p style={{ color: 'var(--txt3)', fontSize: 11, lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'pre-wrap' }}>
                  {n.content}
                </p>
                <div style={{ fontSize: 9, color: 'var(--txt5)', marginTop: 10 }}>{fmtDate(n.created)}</div>
              </div>
            ))}
          </div>
        )}

      {show && (
        <Modal title={edit ? 'Edit Note' : 'New Note'} onClose={() => setShow(false)} wide>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <Field label="TITLE (optional)"><input className="inp" placeholder="Note title…" value={f.title} onChange={(e) => setF((p) => ({ ...p, title: e.target.value }))} /></Field>
            <Field label="CONTENT *"><textarea className="inp" placeholder="Your note, code snippet, idea…" rows={7} value={f.content} onChange={(e) => setF((p) => ({ ...p, content: e.target.value }))} style={{ resize: 'vertical' }} /></Field>
            <Field label="COLOR">
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                {NOTE_COLORS.map((c) => (
                  <button key={c} onClick={() => setF((p) => ({ ...p, color: c }))}
                    style={{ width: 26, height: 26, borderRadius: 6, background: c, border: `3px solid ${f.color === c ? 'var(--txt)' : 'transparent'}`, cursor: 'pointer', transition: 'all .15s' }} />
                ))}
              </div>
            </Field>
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
