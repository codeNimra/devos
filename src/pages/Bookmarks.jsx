import { Modal, Field, Empty } from '../components';
import { useState }    from 'react';
import { genId }       from '../utils/id.js';
import { today }       from '../utils/dates.js';
import { BM_COLORS }   from '../constants/statuses.js';

const CATS = Object.keys(BM_COLORS);

export default function Bookmarks({ data, setData }) {
  const [show, setShow]     = useState(false);
  const [edit, setEdit]     = useState(null);
  const [search, setSearch] = useState('');

  const blank = { title: '', url: '', category: 'Article', tags: '', note: '' };
  const [f, setF] = useState(blank);

  const open = (b = null) => { setF(b ? { ...b } : { ...blank }); setEdit(b?.id || null); setShow(true); };
  const save = () => {
    if (!f.title || !f.url) return;
    edit
      ? setData((p) => p.map((x) => (x.id === edit ? { ...x, ...f } : x)))
      : setData((p) => [...p, { ...f, id: genId(), saved: today() }]);
    setShow(false);
  };
  const del = (id) => setData((p) => p.filter((x) => x.id !== id));

  const filtered = data.filter(
    (b) => b.title.toLowerCase().includes(search.toLowerCase()) || b.tags?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>Resource Bookmarks</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>{data.length} saved</p>
        </div>
        <button className="btn btn-primary" onClick={() => open()}>+ Add Bookmark</button>
      </div>

      <input
        className="inp"
        placeholder="🔍 Search bookmarks or tags…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      {filtered.length === 0
        ? <Empty icon="🔗" text={search ? 'No results' : 'Save useful resources here'} />
        : (
          <div className="g2">
            {filtered.map((b) => {
              const cc = BM_COLORS[b.category] || '#64748b';
              return (
                <div key={b.id} className="card" style={{ padding: 16, borderTop: `3px solid ${cc}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span className="badge" style={{ background: cc + '22', color: cc }}>{b.category}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm"  onClick={() => open(b)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(b.id)}>✕</button>
                    </div>
                  </div>
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: 'var(--txt)', display: 'block', marginBottom: 5, transition: 'color .15s' }}
                    onMouseEnter={(e) => (e.target.style.color = '#00d4ff')}
                    onMouseLeave={(e) => (e.target.style.color = 'var(--txt)')}
                  >
                    {b.title} ↗
                  </a>
                  {b.note && <p style={{ color: 'var(--txt4)', fontSize: 11, marginBottom: 7 }}>{b.note}</p>}
                  {b.tags && (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {b.tags.split(',').map((t, i) => (
                        <span key={i} style={{ padding: '2px 8px', borderRadius: 20, background: 'var(--input-bg)', border: '1px solid var(--border)', fontSize: 9, color: 'var(--txt4)' }}>
                          #{t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      {show && (
        <Modal title={edit ? 'Edit Bookmark' : 'Add Bookmark'} onClose={() => setShow(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <Field label="TITLE *"><input className="inp" placeholder="e.g. React Official Docs" value={f.title} onChange={(e) => setF((p) => ({ ...p, title: e.target.value }))} /></Field>
            <Field label="URL *">  <input className="inp" type="url" placeholder="https://..."   value={f.url}   onChange={(e) => setF((p) => ({ ...p, url:   e.target.value }))} /></Field>
            <Field label="CATEGORY">
              <select className="inp" value={f.category} onChange={(e) => setF((p) => ({ ...p, category: e.target.value }))}>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="TAGS (comma separated)"><input className="inp" placeholder="react, hooks, state" value={f.tags} onChange={(e) => setF((p) => ({ ...p, tags: e.target.value }))} /></Field>
            <Field label="NOTE"><textarea className="inp" rows={2} value={f.note} onChange={(e) => setF((p) => ({ ...p, note: e.target.value }))} style={{ resize: 'vertical' }} /></Field>
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
