import { daysUntil, fmtDate, today } from '../utils/dates.js';
import { urgColorHex, urgLabel }      from '../utils/colors.js';

export default function Dashboard({ data }) {
  const { hackathons, learnings, projects, jobs, goals, journal, events } = data;

  const urgentH       = hackathons.filter((h) => { const d = daysUntil(h.deadline); return d !== null && d >= 0 && d <= 7 && h.status !== 'submitted'; });
  const todayLearns   = learnings.filter((l) => l.date === today() && l.status !== 'done');
  const activeGoals   = goals.filter((g) => g.status !== 'done');
  const upcomingEvents = events.filter((e) => { const d = daysUntil(e.date); return d !== null && d >= 0 && d <= 14; }).slice(0, 3);
  const doneGoals     = goals.filter((g) => g.status === 'done').length;
  const doneLearns    = learnings.filter((l) => l.status === 'done').length;

  const STATS = [
    { label: 'Hackathons', value: hackathons.length, sub: `${urgentH.length} urgent`,                                              color: '#00d4ff', icon: '🏆' },
    { label: 'Projects',   value: projects.length,   sub: `${projects.filter((p) => p.status === 'building').length} building`,    color: '#7c3aed', icon: '🚀' },
    { label: 'Goals',      value: goals.length,      sub: `${doneGoals} done`,                                                     color: '#10b981', icon: '🎯' },
    { label: 'Learning',   value: learnings.length,  sub: `${doneLearns} done`,                                                    color: '#f59e0b', icon: '📚' },
    { label: 'Jobs',       value: jobs.length,        sub: `${jobs.filter((j) => j.status === 'interviewing').length} interviewing`,color: '#f43f5e', icon: '💼' },
    { label: 'Journal',    value: journal.length,     sub: 'entries',                                                              color: '#06b6d4', icon: '📓' },
  ];

  return (
    <div className="fade">
      <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)', marginBottom: 6 }}>Dashboard</h2>
      <p style={{ color: 'var(--txt4)', fontSize: 11, marginBottom: 22 }}>Welcome back — here's your dev life at a glance.</p>

      {/* Stat cards */}
      <div className="g4" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 20 }}>
        {STATS.map((s) => (
          <div key={s.label} className="card" style={{ padding: '16px 18px', borderLeft: `3px solid ${s.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt2)', marginTop: 3 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 2 }}>{s.sub}</div>
              </div>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Info panels */}
      <div className="g2">
        {/* Urgent hackathons */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, marginBottom: 14, color: 'var(--txt3)', letterSpacing: 1 }}>⚡ URGENT HACKATHONS</h3>
          {urgentH.length === 0
            ? <p style={{ color: 'var(--txt5)', fontSize: 11 }}>No urgent deadlines 🎉</p>
            : urgentH.slice(0, 4).map((h) => {
                const d = daysUntil(h.deadline);
                return (
                  <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--divider)' }}>
                    <span style={{ fontSize: 12, color: 'var(--txt2)' }}>{h.name}</span>
                    <span style={{ fontSize: 10, color: urgColorHex(d), fontWeight: 700 }}>{urgLabel(d)}</span>
                  </div>
                );
              })}
        </div>

        {/* Today's learning */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, marginBottom: 14, color: 'var(--txt3)', letterSpacing: 1 }}>📚 TODAY'S LEARNING</h3>
          {todayLearns.length === 0
            ? <p style={{ color: 'var(--txt5)', fontSize: 11 }}>Nothing scheduled today</p>
            : todayLearns.map((l) => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--divider)' }}>
                  <span style={{ fontSize: 12, color: 'var(--txt2)' }}>{l.topic}</span>
                  <span style={{ fontSize: 10, color: '#f59e0b' }}>{l.duration || '—'}</span>
                </div>
              ))}
        </div>

        {/* Active goals */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, marginBottom: 14, color: 'var(--txt3)', letterSpacing: 1 }}>🎯 ACTIVE GOALS</h3>
          {activeGoals.length === 0
            ? <p style={{ color: 'var(--txt5)', fontSize: 11 }}>No active goals — add some!</p>
            : activeGoals.slice(0, 4).map((g) => {
                const pct = g.tasks?.length ? Math.round(g.tasks.filter((t) => t.done).length / g.tasks.length * 100) : 0;
                return (
                  <div key={g.id} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: 'var(--txt2)' }}>{g.title}</span>
                      <span style={{ fontSize: 10, color: '#10b981' }}>{pct}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: '#10b981' }} /></div>
                  </div>
                );
              })}
        </div>

        {/* Upcoming events */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, marginBottom: 14, color: 'var(--txt3)', letterSpacing: 1 }}>🗓 UPCOMING EVENTS</h3>
          {upcomingEvents.length === 0
            ? <p style={{ color: 'var(--txt5)', fontSize: 11 }}>No events in next 14 days</p>
            : upcomingEvents.map((e) => {
                const d = daysUntil(e.date);
                return (
                  <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--divider)' }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--txt2)' }}>{e.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--txt4)' }}>{fmtDate(e.date)}</div>
                    </div>
                    <span style={{ fontSize: 10, color: urgColorHex(d), fontWeight: 700 }}>{urgLabel(d)}</span>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
