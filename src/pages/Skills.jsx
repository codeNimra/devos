import { Modal, Field, Empty } from '../components';
import { useState }                     from 'react';
import { genId }                         from '../utils/id.js';
import { SKILL_LEVELS, SKILL_CATS }      from '../constants/statuses.js';

export default function Skills({ data, setData }) {
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);

  const blank = { name: '', category: 'Language', level: 3, yearsExp: '', note: '' };
  const [f, setF] = useState(blank);

  const open = (s = null) => { setF(s ? { ...s } : { ...blank }); setEdit(s?.id || null); setShow(true); };
  const save = () => { if (!f.name) return; edit ? setData((p) => p.map((x) => (x.id === edit ? { ...x, ...f } : x))) : setData((p) => [...p, { ...f, id: genId() }]); setShow(false); };
  const del  = (id) => setData((p) => p.filter((x) => x.id !== id));

  const grouped = SKILL_CATS.reduce((acc, cat) => {
    const items = data.filter((s) => s.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)' }}>Skills & Tech Stack</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>{data.length} skills mapped</p>
        </div>
        <button className="btn btn-primary" onClick={() => open()}>+ Add Skill</button>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
        {SKILL_LEVELS.map((l) => (
          <span key={l.val} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--txt4)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color, display: 'inline-block' }} />
            {l.label}
          </span>
        ))}
      </div>

      {data.length === 0
        ? <Empty icon="🧩" text="Add your tech skills" />
        : Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 22 }}>
              <h4 style={{ color: 'var(--txt4)', fontSize: 10, letterSpacing: 1.5, marginBottom: 12 }}>{cat.toUpperCase()}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {items.map((s) => {
                  const lv = SKILL_LEVELS.find((l) => l.val === s.level) || SKILL_LEVELS[2];
                  return (
                    <div key={s.id} className="card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', borderLeft: `3px solid ${lv.color}` }} onClick={() => open(s)}>
                      <div>
                        <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 12, color: 'var(--txt)' }}>{s.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} style={{ width: 5, height: 5, borderRadius: 1, background: i <= s.level ? lv.color : 'var(--border-strong)', display: 'inline-block' }} />
                          ))}
                          <span style={{ fontSize: 9, color: lv.color, marginLeft: 2 }}>{lv.label}</span>
                        </div>
                        {s.yearsExp && <div style={{ fontSize: 9, color: 'var(--txt4)', marginTop: 2 }}>{s.yearsExp} yrs</div>}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); del(s.id); }} style={{ background: 'none', border: 'none', color: 'var(--txt5)', fontSize: 14, cursor: 'pointer', marginLeft: 4 }}>✕</button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

      {show && (
        <Modal title={edit ? 'Edit Skill' : 'Add Skill'} onClose={() => setShow(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <Field label="SKILL / TECHNOLOGY *">
              <input className="inp" placeholder="e.g. React, Python, Docker" value={f.name} onChange={(e) => setF((p) => ({ ...p, name: e.target.value }))} />
            </Field>
            <div className="g2">
              <Field label="CATEGORY">
                <select className="inp" value={f.category} onChange={(e) => setF((p) => ({ ...p, category: e.target.value }))}>
                  {SKILL_CATS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="YEARS EXP">
                <input className="inp" placeholder="e.g. 2" value={f.yearsExp} onChange={(e) => setF((p) => ({ ...p, yearsExp: e.target.value }))} />
              </Field>
            </div>
            <Field label={`PROFICIENCY: ${SKILL_LEVELS.find((l) => l.val === f.level)?.label}`}>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                {SKILL_LEVELS.map((l) => (
                  <button
                    key={l.val}
                    onClick={() => setF((p) => ({ ...p, level: l.val }))}
                    style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: `2px solid ${f.level === l.val ? l.color : l.color + '33'}`, background: f.level === l.val ? l.color + '22' : 'transparent', color: f.level === l.val ? l.color : 'var(--txt4)', fontSize: 9, fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="NOTE"><input className="inp" placeholder="optional context" value={f.note} onChange={(e) => setF((p) => ({ ...p, note: e.target.value }))} /></Field>
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
