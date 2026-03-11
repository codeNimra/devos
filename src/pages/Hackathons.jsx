import { Modal, Field, Empty } from '../components';
import { useState }                   from 'react';
import { genId }                       from '../utils/id.js';
import { daysUntil, fmtDate }          from '../utils/dates.js';
import { urgColorHex, urgLabel }       from '../utils/colors.js';
import { HACK_STATUS }                 from '../constants/statuses.js';

export default function Hackathons({ data, setData }) {
  const [show, setShow]     = useState(false);
  const [edit, setEdit]     = useState(null);
  const [filter, setFilter] = useState('all');

  const blank = { name: '', platform: '', deadline: '', link: '', prize: '', status: 'interested', notes: '' };
  const [f, setF] = useState(blank);

  const open = (h = null) => { setF(h ? { ...h } : { ...blank }); setEdit(h?.id || null); setShow(true); };
  const save = () => {
    if (!f.name) return;
    edit
      ? setData((p) => p.map((h) => (h.id === edit ? { ...h, ...f } : h)))
      : setData((p) => [...p, { ...f, id: genId() }]);
    setShow(false);
  };
  const del = (id) => setData((p) => p.filter((h) => h.id !== id));

  const sorted = [...data]
    .filter((h) => filter === 'all' || h.status === filter)
    .sort((a, b) => {
      const da = daysUntil(a.deadline), db = daysUntil(b.deadline);
      if (da === null) return 1;
      if (db === null) return -1;
      return da - db;
    });

  const urgentCount = data.filter((h) => { const d = daysUntil(h.deadline); return d !== null && d >= 0 && d <= 7 && h.status !== 'submitted'; }).length;

  return (
    <div className="fade">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>Hackathons</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>{data.length} tracked · {urgentCount} urgent</p>
        </div>
        <button className="btn btn-primary" onClick={() => open()}>+ Add Hackathon</button>
      </div>

      {/* Status filter pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        {[['all', 'All'], ...Object.entries(HACK_STATUS).map(([k, v]) => [k, v.label])].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 10, fontWeight: 700, cursor: 'pointer', border: '1px solid', transition: 'all .15s',
              background:   filter === k ? '#00d4ff15' : 'transparent',
              color:        filter === k ? '#00d4ff'   : 'var(--txt4)',
              borderColor:  filter === k ? '#00d4ff33' : 'var(--border)',
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* List */}
      {sorted.length === 0
        ? <Empty icon="🏆" text="No hackathons yet" />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sorted.map((h) => {
              const d   = daysUntil(h.deadline);
              const col = urgColorHex(d);
              const s   = HACK_STATUS[h.status] || HACK_STATUS.interested;
              return (
                <div key={h.id} className="card" style={{ padding: 18, borderLeft: `3px solid ${col}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 7 }}>
                        <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--txt)' }}>{h.name}</span>
                        <span className="badge" style={{ background: s.color + '22', color: s.color }}>{s.label}</span>
                        {d !== null && d >= 0 && d <= 7 && (
                          <span className="badge" style={{ background: col + '22', color: col }}>
                            <span className="dot" style={{ background: col }} />
                            {urgLabel(d)}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                        {h.platform && <span style={{ color: 'var(--txt4)', fontSize: 10 }}>📍 {h.platform}</span>}
                        {h.deadline  && <span style={{ color: 'var(--txt4)', fontSize: 10 }}>📅 {fmtDate(h.deadline)}</span>}
                        {h.prize     && <span style={{ color: '#f59e0b', fontSize: 10 }}>🏅 {h.prize}</span>}
                      </div>
                      {h.notes && <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 7 }}>{h.notes}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      {h.link && <a href={h.link} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">↗</a>}
                      <button className="btn btn-ghost btn-sm"   onClick={() => open(h)}>Edit</button>
                      <button className="btn btn-danger btn-sm"  onClick={() => del(h.id)}>✕</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* Modal */}
      {show && (
        <Modal title={edit ? 'Edit Hackathon' : 'Add Hackathon'} onClose={() => setShow(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <Field label="HACKATHON NAME *">
              <input className="inp" placeholder="e.g. ETHGlobal Bangkok" value={f.name} onChange={(e) => setF((p) => ({ ...p, name: e.target.value }))} />
            </Field>
            <div className="g2">
              <Field label="PLATFORM"><input className="inp" placeholder="Devfolio, MLH…" value={f.platform} onChange={(e) => setF((p) => ({ ...p, platform: e.target.value }))} /></Field>
              <Field label="PRIZE"><input className="inp" placeholder="$5000" value={f.prize} onChange={(e) => setF((p) => ({ ...p, prize: e.target.value }))} /></Field>
            </div>
            <Field label="SUBMISSION DEADLINE"><input className="inp" type="date" value={f.deadline} onChange={(e) => setF((p) => ({ ...p, deadline: e.target.value }))} /></Field>
            <Field label="STATUS">
              <select className="inp" value={f.status} onChange={(e) => setF((p) => ({ ...p, status: e.target.value }))}>
                {Object.entries(HACK_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </Field>
            <Field label="LINK"><input className="inp" type="url" placeholder="https://..." value={f.link} onChange={(e) => setF((p) => ({ ...p, link: e.target.value }))} /></Field>
            <Field label="NOTES"><textarea className="inp" rows={2} value={f.notes} onChange={(e) => setF((p) => ({ ...p, notes: e.target.value }))} style={{ resize: 'vertical' }} /></Field>
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
