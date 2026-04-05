import { useState } from 'react';
import { Modal, Field, Empty } from '../components';
import { genId } from '../utils/id.js';

const BLOOD_TYPES    = ['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'];
const CONTACT_TYPES  = ['Doctor', 'Emergency Contact', 'Specialist', 'Dentist', 'Pharmacist', 'Hospital', 'Other'];
const RELATION_TYPES = ['Parent', 'Spouse', 'Sibling', 'Child', 'Friend', 'Colleague', 'Other'];

const blankContact = () => ({
  id: genId(), name: '', phone: '', type: 'Emergency Contact', relation: 'Parent',
  address: '', notes: '', isPrimary: false,
});

const blankMed = () => ({
  id: genId(), name: '', dosage: '', frequency: '', prescribedBy: '', startDate: '', notes: '',
});

const blankAllergy = () => ({
  id: genId(), name: '', severity: 'Mild', reaction: '',
});

const SEVERITY_COLOR = { Mild: '#f59e0b', Moderate: '#f97316', Severe: '#ef4444' };

export default function Medical({ data, setData }) {
  /* data shape: { profile, contacts, medications, allergies, conditions } */
  const profile     = data.profile     || { bloodType: '', height: '', weight: '', notes: '' };
  const contacts    = data.contacts    || [];
  const medications = data.medications || [];
  const allergies   = data.allergies   || [];
  const conditions  = data.conditions  || [];

  const [tab,       setTab]       = useState('overview');
  const [modal,     setModal]     = useState(null); // 'contact' | 'med' | 'allergy' | 'condition'
  const [form,      setForm]      = useState({});
  const [editId,    setEditId]    = useState(null);
  const [profileEdit, setProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState(profile);

  const update = (key, val) => setData(prev => ({ ...prev, [key]: val }));

  /* CONTACTS */
  const saveContact = () => {
    if (!form.name?.trim()) return;
    if (editId) update('contacts', contacts.map(c => c.id === editId ? { ...form } : c));
    else        update('contacts', [...contacts, { ...form }]);
    setModal(null); setEditId(null);
  };
  const delContact = id => update('contacts', contacts.filter(c => c.id !== id));

  /* MEDICATIONS */
  const saveMed = () => {
    if (!form.name?.trim()) return;
    if (editId) update('medications', medications.map(m => m.id === editId ? { ...form } : m));
    else        update('medications', [...medications, { ...form }]);
    setModal(null); setEditId(null);
  };
  const delMed = id => update('medications', medications.filter(m => m.id !== id));

  /* ALLERGIES */
  const saveAllergy = () => {
    if (!form.name?.trim()) return;
    if (editId) update('allergies', allergies.map(a => a.id === editId ? { ...form } : a));
    else        update('allergies', [...allergies, { ...form }]);
    setModal(null); setEditId(null);
  };
  const delAllergy = id => update('allergies', allergies.filter(a => a.id !== id));

  /* CONDITIONS */
  const saveCondition = () => {
    if (!form.name?.trim()) return;
    if (editId) update('conditions', conditions.map(c => c.id === editId ? { ...form } : c));
    else        update('conditions', [...conditions, { id: genId(), ...form }]);
    setModal(null); setEditId(null);
  };
  const delCondition = id => update('conditions', conditions.filter(c => c.id !== id));

  /* PROFILE SAVE */
  const saveProfile = () => { update('profile', profileForm); setProfileEdit(false); };

  const openContact  = (c) => { setForm(c || blankContact());    setEditId(c?.id || null); setModal('contact'); };
  const openMed      = (m) => { setForm(m || blankMed());        setEditId(m?.id || null); setModal('med'); };
  const openAllergy  = (a) => { setForm(a || blankAllergy());    setEditId(a?.id || null); setModal('allergy'); };
  const openCondition= (c) => { setForm(c || { id: genId(), name: '', since: '', notes: '' }); setEditId(c?.id || null); setModal('condition'); };

  const TABS = ['overview', 'emergency', 'medications', 'allergies'];

  return (
    <div className="fade">
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800 }}>Medical</h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 3 }}>
            Your health information, always accessible when it matters most
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {tab === 'emergency'   && <button className="btn btn-primary" onClick={() => openContact(null)}>+ Add Contact</button>}
          {tab === 'medications' && <button className="btn btn-primary" onClick={() => openMed(null)}>+ Add Medication</button>}
          {tab === 'allergies'   && <button className="btn btn-primary" onClick={() => openAllergy(null)}>+ Add Allergy</button>}
        </div>
      </div>

      {/* EMERGENCY BANNER */}
      {contacts.filter(c => c.isPrimary).length > 0 && (
        <div style={{
          padding: '14px 18px', marginBottom: 18,
          background: '#ef444408', border: '1px solid #ef444430',
          borderLeft: '4px solid #ef4444', borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 20 }}>🆘</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', letterSpacing: 1, marginBottom: 4 }}>PRIMARY EMERGENCY CONTACT</div>
            {contacts.filter(c => c.isPrimary).map(c => (
              <div key={c.id} style={{ fontSize: 13, color: 'var(--txt)', fontWeight: 700 }}>
                {c.name} — <a href={`tel:${c.phone}`} style={{ color: '#ef4444' }}>{c.phone}</a>
                <span style={{ fontSize: 11, color: 'var(--txt4)', marginLeft: 8, fontWeight: 400 }}>{c.relation}</span>
              </div>
            ))}
          </div>
          {profile.bloodType && profile.bloodType !== 'Unknown' && (
            <div style={{ marginLeft: 'auto', textAlign: 'center', padding: '8px 16px', background: '#ef444420', borderRadius: 10 }}>
              <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: '#ef4444' }}>{profile.bloodType}</div>
              <div style={{ fontSize: 9, color: '#ef4444', letterSpacing: 1 }}>BLOOD TYPE</div>
            </div>
          )}
        </div>
      )}

      {/* TABS */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t}
            className="pill"
            onClick={() => setTab(t)}
            style={{
              background: tab === t ? '#00d4ff' : 'var(--surface2)',
              color:      tab === t ? '#05050f' : 'var(--txt3)',
              border:     `1px solid ${tab === t ? '#00d4ff' : 'var(--border)'}`,
              textTransform: 'capitalize', fontSize: 12,
            }}
          >
            {t === 'overview' ? '📋 Overview' : t === 'emergency' ? '🆘 Emergency' : t === 'medications' ? '💊 Medications' : '⚠️ Allergies'}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === 'overview' && (
        <div className="g2">
          {/* Profile */}
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1 }}>🩺 HEALTH PROFILE</div>
              <button className="btn btn-ghost btn-sm" onClick={() => { setProfileForm(profile); setProfileEdit(true); }}>Edit</button>
            </div>
            {[
              { label: 'Blood Type', value: profile.bloodType || '—' },
              { label: 'Height',     value: profile.height    || '—' },
              { label: 'Weight',     value: profile.weight    || '—' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--divider)' }}>
                <span style={{ fontSize: 12, color: 'var(--txt3)' }}>{r.label}</span>
                <span style={{ fontSize: 12, color: 'var(--txt)', fontWeight: 700 }}>{r.value}</span>
              </div>
            ))}
            {profile.notes && (
              <div style={{ marginTop: 12, fontSize: 11, color: 'var(--txt4)', lineHeight: 1.6 }}>
                {profile.notes}
              </div>
            )}
          </div>

          {/* Conditions */}
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1 }}>📝 CONDITIONS</div>
              <button className="btn btn-ghost btn-sm" onClick={() => openCondition(null)}>+ Add</button>
            </div>
            {conditions.length === 0
              ? <p style={{ fontSize: 12, color: 'var(--txt4)' }}>No conditions recorded</p>
              : conditions.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--divider)' }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--txt)', fontWeight: 600 }}>{c.name}</div>
                    {c.since && <div style={{ fontSize: 10, color: 'var(--txt4)' }}>Since {c.since}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-xs" onClick={() => openCondition(c)}>Edit</button>
                    <button className="btn btn-danger btn-xs" onClick={() => delCondition(c.id)}>✕</button>
                  </div>
                </div>
              ))}
          </div>

          {/* Quick stats */}
          <div className="card" style={{ padding: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 16 }}>📊 SUMMARY</div>
            {[
              { label: 'Emergency contacts', value: contacts.length,    color: '#ef4444' },
              { label: 'Medications',         value: medications.length, color: '#00d4ff' },
              { label: 'Known allergies',      value: allergies.length,  color: '#f59e0b' },
              { label: 'Conditions',           value: conditions.length, color: '#7c3aed' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--divider)' }}>
                <span style={{ fontSize: 12, color: 'var(--txt3)' }}>{s.label}</span>
                <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Critical allergies */}
          <div className="card" style={{ padding: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 16 }}>⚠️ CRITICAL ALLERGIES</div>
            {allergies.filter(a => a.severity === 'Severe').length === 0
              ? <p style={{ fontSize: 12, color: 'var(--txt4)' }}>No severe allergies recorded</p>
              : allergies.filter(a => a.severity === 'Severe').map(a => (
                <div key={a.id} style={{ padding: '8px 12px', marginBottom: 8, background: '#ef444410', border: '1px solid #ef444430', borderRadius: 9 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>{a.name}</div>
                  {a.reaction && <div style={{ fontSize: 11, color: 'var(--txt4)', marginTop: 3 }}>{a.reaction}</div>}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── EMERGENCY TAB ── */}
      {tab === 'emergency' && (
        <div>
          {contacts.length === 0
            ? <Empty icon="🆘" text="Add emergency contacts so help is always one click away." onAdd={() => openContact(null)} />
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {contacts.map(c => (
                  <div key={c.id} className="card" style={{ padding: '16px 20px', borderLeft: `4px solid ${c.isPrimary ? '#ef4444' : '#00d4ff'}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, color: 'var(--txt)' }}>{c.name}</span>
                          {c.isPrimary && <span className="badge" style={{ background: '#ef444418', color: '#ef4444', border: '1px solid #ef444430' }}>PRIMARY</span>}
                          <span className="badge" style={{ background: 'var(--surface2)', color: 'var(--txt3)', border: '1px solid var(--border)' }}>{c.type}</span>
                        </div>
                        <div style={{ fontSize: 13, color: '#00d4ff', fontWeight: 700, marginBottom: 4 }}>
                          📞 <a href={`tel:${c.phone}`} style={{ color: '#00d4ff' }}>{c.phone || 'No number'}</a>
                        </div>
                        {c.relation && <div style={{ fontSize: 11, color: 'var(--txt4)' }}>Relation: {c.relation}</div>}
                        {c.address  && <div style={{ fontSize: 11, color: 'var(--txt4)', marginTop: 3 }}>📍 {c.address}</div>}
                        {c.notes    && <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 5, fontStyle: 'italic' }}>{c.notes}</div>}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button className="btn btn-ghost btn-xs" onClick={() => openContact(c)}>Edit</button>
                        <button className="btn btn-danger btn-xs" onClick={() => delContact(c.id)}>✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      )}

      {/* ── MEDICATIONS TAB ── */}
      {tab === 'medications' && (
        <div>
          {medications.length === 0
            ? <Empty icon="💊" text="No medications recorded. Add your current medications to keep track." onAdd={() => openMed(null)} />
            : (
              <div className="g2">
                {medications.map(m => (
                  <div key={m.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, color: 'var(--txt)' }}>{m.name}</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-xs" onClick={() => openMed(m)}>Edit</button>
                        <button className="btn btn-danger btn-xs" onClick={() => delMed(m.id)}>✕</button>
                      </div>
                    </div>
                    {[
                      { label: 'Dosage',       value: m.dosage },
                      { label: 'Frequency',    value: m.frequency },
                      { label: 'Prescribed by',value: m.prescribedBy },
                    ].filter(r => r.value).map(r => (
                      <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--divider)' }}>
                        <span style={{ fontSize: 11, color: 'var(--txt4)' }}>{r.label}</span>
                        <span style={{ fontSize: 11, color: 'var(--txt2)', fontWeight: 600 }}>{r.value}</span>
                      </div>
                    ))}
                    {m.notes && <div style={{ fontSize: 11, color: 'var(--txt4)', marginTop: 10, fontStyle: 'italic' }}>{m.notes}</div>}
                  </div>
                ))}
              </div>
            )}
        </div>
      )}

      {/* ── ALLERGIES TAB ── */}
      {tab === 'allergies' && (
        <div>
          {allergies.length === 0
            ? <Empty icon="⚠️" text="No allergies recorded. Add any known allergies for your safety." onAdd={() => openAllergy(null)} />
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {allergies.map(a => {
                  const sc = SEVERITY_COLOR[a.severity] || '#64748b';
                  return (
                    <div key={a.id} className="card" style={{ padding: '15px 20px', borderLeft: `4px solid ${sc}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                            <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: 'var(--txt)' }}>{a.name}</span>
                            <span className="badge" style={{ background: sc + '18', color: sc, border: `1px solid ${sc}30` }}>{a.severity}</span>
                          </div>
                          {a.reaction && <div style={{ fontSize: 11, color: 'var(--txt3)' }}>Reaction: {a.reaction}</div>}
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-xs" onClick={() => openAllergy(a)}>Edit</button>
                          <button className="btn btn-danger btn-xs" onClick={() => delAllergy(a.id)}>✕</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      )}

      {/* ── MODALS ── */}

      {/* Profile Edit */}
      {profileEdit && (
        <Modal title="Edit Health Profile" onClose={() => setProfileEdit(false)}>
          <Field label="Blood Type">
            <select className="inp" value={profileForm.bloodType || ''} onChange={e => setProfileForm(f => ({ ...f, bloodType: e.target.value }))}>
              <option value="">Select...</option>
              {BLOOD_TYPES.map(b => <option key={b}>{b}</option>)}
            </select>
          </Field>
          <div className="g2">
            <Field label="Height"><input className="inp" placeholder="e.g. 170 cm" value={profileForm.height || ''} onChange={e => setProfileForm(f => ({ ...f, height: e.target.value }))} /></Field>
            <Field label="Weight"><input className="inp" placeholder="e.g. 65 kg"  value={profileForm.weight || ''} onChange={e => setProfileForm(f => ({ ...f, weight: e.target.value }))} /></Field>
          </div>
          <Field label="Notes / Conditions summary">
            <textarea className="inp" rows={3} value={profileForm.notes || ''} onChange={e => setProfileForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: 'vertical' }} />
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveProfile}>Save</button>
            <button className="btn btn-ghost" onClick={() => setProfileEdit(false)}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* Contact Modal */}
      {modal === 'contact' && (
        <Modal title={editId ? 'Edit Contact' : 'Add Emergency Contact'} onClose={() => { setModal(null); setEditId(null); }}>
          <Field label="Full Name"><input className="inp" placeholder="Name" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus /></Field>
          <Field label="Phone Number"><input className="inp" placeholder="+1 234 567 8900" value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></Field>
          <div className="g2">
            <Field label="Type"><select className="inp" value={form.type || 'Emergency Contact'} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>{CONTACT_TYPES.map(t => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Relation"><select className="inp" value={form.relation || 'Parent'} onChange={e => setForm(f => ({ ...f, relation: e.target.value }))}>{RELATION_TYPES.map(r => <option key={r}>{r}</option>)}</select></Field>
          </div>
          <Field label="Address (optional)"><input className="inp" placeholder="Address or city" value={form.address || ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></Field>
          <Field label="Notes"><input className="inp" placeholder="Any important notes" value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></Field>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 12, color: 'var(--txt2)', marginTop: 8 }}>
            <input type="checkbox" checked={form.isPrimary || false} onChange={e => setForm(f => ({ ...f, isPrimary: e.target.checked }))} />
            Mark as primary emergency contact
          </label>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveContact}>{editId ? 'Save' : 'Add Contact'}</button>
            <button className="btn btn-ghost" onClick={() => { setModal(null); setEditId(null); }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* Medication Modal */}
      {modal === 'med' && (
        <Modal title={editId ? 'Edit Medication' : 'Add Medication'} onClose={() => { setModal(null); setEditId(null); }}>
          <Field label="Medication Name"><input className="inp" placeholder="Name of medication" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus /></Field>
          <div className="g2">
            <Field label="Dosage"><input className="inp" placeholder="e.g. 500mg" value={form.dosage || ''} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))} /></Field>
            <Field label="Frequency"><input className="inp" placeholder="e.g. Twice daily" value={form.frequency || ''} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))} /></Field>
          </div>
          <Field label="Prescribed by"><input className="inp" placeholder="Doctor's name" value={form.prescribedBy || ''} onChange={e => setForm(f => ({ ...f, prescribedBy: e.target.value }))} /></Field>
          <Field label="Notes"><textarea className="inp" rows={2} value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: 'vertical' }} /></Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveMed}>{editId ? 'Save' : 'Add'}</button>
            <button className="btn btn-ghost" onClick={() => { setModal(null); setEditId(null); }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* Allergy Modal */}
      {modal === 'allergy' && (
        <Modal title={editId ? 'Edit Allergy' : 'Add Allergy'} onClose={() => { setModal(null); setEditId(null); }}>
          <Field label="Allergy / Substance"><input className="inp" placeholder="e.g. Penicillin, Peanuts, Latex" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus /></Field>
          <Field label="Severity">
            <select className="inp" value={form.severity || 'Mild'} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}>
              <option>Mild</option><option>Moderate</option><option>Severe</option>
            </select>
          </Field>
          <Field label="Reaction / Symptoms"><input className="inp" placeholder="What happens when exposed?" value={form.reaction || ''} onChange={e => setForm(f => ({ ...f, reaction: e.target.value }))} /></Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveAllergy}>{editId ? 'Save' : 'Add'}</button>
            <button className="btn btn-ghost" onClick={() => { setModal(null); setEditId(null); }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* Condition Modal */}
      {modal === 'condition' && (
        <Modal title="Add Condition" onClose={() => { setModal(null); setEditId(null); }}>
          <Field label="Condition Name"><input className="inp" placeholder="e.g. Type 2 Diabetes, Asthma" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus /></Field>
          <Field label="Since (year)"><input className="inp" placeholder="e.g. 2020" value={form.since || ''} onChange={e => setForm(f => ({ ...f, since: e.target.value }))} /></Field>
          <Field label="Notes"><textarea className="inp" rows={2} value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: 'vertical' }} /></Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveCondition}>{editId ? 'Save' : 'Add'}</button>
            <button className="btn btn-ghost" onClick={() => { setModal(null); setEditId(null); }}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}