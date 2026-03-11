import { Modal, Field, Empty } from '../components';
import { useState }            from 'react';
import { genId }               from '../utils/id.js';
import { daysUntil, fmtDate }  from '../utils/dates.js';
import { urgColorHex, urgLabel } from '../utils/colors.js';
import { JOB_STATUS }          from '../constants/statuses.js';

export default function Jobs({ data, setData }) {
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);

  const blank = { company: '', role: '', status: 'applied', deadline: '', link: '', salary: '', notes: '' };
  const [f, setF] = useState(blank);

  const open = (j = null) => { setF(j ? { ...j } : { ...blank }); setEdit(j?.id || null); setShow(true); };
  const save = () => {
    if (!f.company || !f.role) return;
    edit
      ? setData((p) => p.map((x) => (x.id === edit ? { ...x, ...f } : x)))
      : setData((p) => [...p, { ...f, id: genId() }]);
    setShow(false);
  };
  const del = (id) => setData((p) => p.filter((x) => x.id !== id));

  return (
    <div className="fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>Job / Internship Tracker</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>
            {data.length} applications · {data.filter((j) => j.status === 'interviewing').length} interviewing
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => open()}>+ Add Application</button>
      </div>

      {data.length === 0
        ? <Empty icon="💼" text="No job applications yet" />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.map((j) => {
              const s = JOB_STATUS[j.status] || JOB_STATUS.applied;
              const d = daysUntil(j.deadline);
              return (
                <div key={j.id} className="card" style={{ padding: 18, borderLeft: `3px solid ${s.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                        <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--txt)' }}>{j.role}</span>
                        <span style={{ color: 'var(--txt3)', fontSize: 12 }}>@ {j.company}</span>
                        <span className="badge" style={{ background: s.color + '22', color: s.color }}>{s.label}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                        {j.salary   && <span style={{ color: '#10b981', fontSize: 10 }}>💰 {j.salary}</span>}
                        {j.deadline && <span style={{ color: urgColorHex(d), fontSize: 10 }}>📅 {fmtDate(j.deadline)} · {urgLabel(d)}</span>}
                      </div>
                      {j.notes && <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 7 }}>{j.notes}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      {j.link && <a href={j.link} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">↗</a>}
                      <button className="btn btn-ghost btn-sm"  onClick={() => open(j)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(j.id)}>✕</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {show && (
        <Modal title={edit ? 'Edit Application' : 'Add Application'} onClose={() => setShow(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <div className="g2">
              <Field label="COMPANY *"><input className="inp" placeholder="Google"              value={f.company} onChange={(e) => setF((p) => ({ ...p, company: e.target.value }))} /></Field>
              <Field label="ROLE *">   <input className="inp" placeholder="Frontend Engineer"  value={f.role}    onChange={(e) => setF((p) => ({ ...p, role:    e.target.value }))} /></Field>
            </div>
            <div className="g2">
              <Field label="STATUS">
                <select className="inp" value={f.status} onChange={(e) => setF((p) => ({ ...p, status: e.target.value }))}>
                  {Object.entries(JOB_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </Field>
              <Field label="SALARY"><input className="inp" placeholder="$120k / $3k/mo" value={f.salary} onChange={(e) => setF((p) => ({ ...p, salary: e.target.value }))} /></Field>
            </div>
            <Field label="FOLLOW-UP DATE"><input className="inp" type="date" value={f.deadline} onChange={(e) => setF((p) => ({ ...p, deadline: e.target.value }))} /></Field>
            <Field label="JOB LINK">      <input className="inp" type="url"  placeholder="https://..." value={f.link} onChange={(e) => setF((p) => ({ ...p, link: e.target.value }))} /></Field>
            <Field label="NOTES">         <textarea className="inp" rows={2} value={f.notes} onChange={(e) => setF((p) => ({ ...p, notes: e.target.value }))} style={{ resize: 'vertical' }} /></Field>
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
