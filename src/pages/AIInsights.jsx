import { daysUntil, fmtDate } from '../utils/dates.js';
import { urgColorHex }        from '../utils/colors.js';

const MOOD_ICONS = ['', '😞', '😐', '🙂', '😊', '🚀'];

export default function AIInsights({ data, user }) {
  const { hackathons, learnings, jobs, goals, journal, notes, skills } = data;

  /* ── STATIC ANALYSIS ── */
  const urgentHacks  = hackathons.filter((h) => { const d = daysUntil(h.deadline); return d !== null && d >= 0 && d <= 7 && h.status !== 'submitted'; });
  const overdueLearn = learnings.filter((l)  => { const d = daysUntil(l.date);     return d !== null && d < 0  && l.status !== 'done'; });
  const stalledGoals = goals.filter((g) => {
    const tasks = g.tasks || [];
    return g.status !== 'done' && tasks.length > 0 && tasks.filter((t) => t.done).length === 0;
  });
  const pendingJobs  = jobs.filter((j) => j.status === 'interviewing' || j.status === 'applied');
  const doneGoals    = goals.filter((g) => g.status === 'done');
  const doneLearn    = learnings.filter((l) => l.status === 'done');
  const recentMoods  = [...journal].slice(0, 7).map((e) => e.mood || 3);
  const moodAvg      = recentMoods.length ? (recentMoods.reduce((s, v) => s + v, 0) / recentMoods.length).toFixed(1) : null;
  const moodTrend    = recentMoods.length >= 2
    ? recentMoods[0] > recentMoods[recentMoods.length - 1] ? 'rising'
    : recentMoods[0] < recentMoods[recentMoods.length - 1] ? 'falling'
    : 'stable'
    : 'stable';

  /* ── PRIORITY QUEUE ── */
  const pQueue = [];
  urgentHacks.forEach((h) => {
    const d = daysUntil(h.deadline);
    pQueue.push({ color: urgColorHex(d), label: d === 0 ? 'TODAY' : d <= 2 ? 'CRITICAL' : 'URGENT', title: `🏆 ${h.name}`, action: `Submit before ${fmtDate(h.deadline)}`, reason: d === 0 ? 'Due TODAY!' : `${d}d left`, sortKey: d });
  });
  overdueLearn.forEach((l) => pQueue.push({ color: '#ef4444', label: 'OVERDUE',    title: `📚 ${l.topic}`, action: 'Reschedule or mark done',      reason: 'Missed date',   sortKey: -1 }));
  stalledGoals.forEach((g) => pQueue.push({ color: '#f59e0b', label: 'STALLED',    title: `🎯 ${g.title}`, action: 'Complete at least 1 task now', reason: '0% progress',   sortKey: 9  }));
  pendingJobs.forEach((j)  => {
    const d = daysUntil(j.deadline);
    if (d !== null && d >= 0 && d <= 5)
      pQueue.push({ color: '#8b5cf6', label: 'FOLLOW UP', title: `💼 ${j.role} @ ${j.company}`, action: 'Send a follow-up message', reason: `${d}d`, sortKey: d + 2 });
  });
  pQueue.sort((a, b) => a.sortKey - b.sortKey);

  /* ── SMART SUGGESTIONS ── */
  const suggestions = [];
  if (urgentHacks.length > 0)
    suggestions.push({ icon: '🏆', text: `You have ${urgentHacks.length} hackathon(s) due within 7 days — prioritize submissions first.`, color: '#ef4444' });
  if (overdueLearn.length > 0)
    suggestions.push({ icon: '📚', text: `${overdueLearn.length} learning session(s) are overdue — reschedule or mark them done to stay on track.`, color: '#f59e0b' });
  if (stalledGoals.length > 0)
    suggestions.push({ icon: '🎯', text: `${stalledGoals.length} goal(s) have zero progress — pick one task from each and complete it today.`, color: '#f59e0b' });
  if (moodAvg && parseFloat(moodAvg) < 3)
    suggestions.push({ icon: '😐', text: `Your average mood is ${moodAvg}/5 — consider taking a break or working on something fun today.`, color: '#8b5cf6' });
  if (doneLearn.length >= 5)
    suggestions.push({ icon: '🚀', text: `You've completed ${doneLearn.length} learning sessions — great consistency! Keep the streak going.`, color: '#10b981' });
  if (doneGoals.length > 0)
    suggestions.push({ icon: '✅', text: `${doneGoals.length} goal(s) completed — you're making real progress. Set your next big goal.`, color: '#10b981' });
  if (skills.length > 0) {
    const weak = skills.filter((s) => s.level <= 2);
    if (weak.length > 0)
      suggestions.push({ icon: '🧩', text: `${weak.length} skill(s) marked Beginner/Familiar (${weak.slice(0,2).map(s=>s.name).join(', ')}) — schedule focused practice sessions.`, color: '#3b82f6' });
  }
  if (pendingJobs.length > 0)
    suggestions.push({ icon: '💼', text: `${pendingJobs.length} active job application(s) — don't forget to follow up after 5-7 days of no response.`, color: '#8b5cf6' });
  if (journal.length === 0)
    suggestions.push({ icon: '📓', text: `Start journaling — even 2 sentences a day helps you track your growth and spot patterns over time.`, color: '#64748b' });
  if (suggestions.length === 0)
    suggestions.push({ icon: '🎉', text: `Everything looks great! No urgent items. Focus on deep work and keep building.`, color: '#10b981' });

  /* ── WEEKLY SUMMARY ── */
  const weekScore = Math.min(100, Math.round(
    (doneLearn.length * 10) +
    (doneGoals.length * 20) +
    (journal.length * 5) +
    (skills.length * 3) -
    (urgentHacks.length * 10) -
    (overdueLearn.length * 15)
  ));

  return (
    <div className="fade">

      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800 }}>
          <span style={{ background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>✦ AI Coach</span>
        </h2>
        <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>Smart analysis of your dev life — instant, no API needed</p>
      </div>

      {/* TOP STATS */}
      <div className="g4" style={{ marginBottom: 16 }}>
        {[
          { label: 'Productivity Score', value: `${weekScore}`, unit: '/100', color: weekScore >= 70 ? '#10b981' : weekScore >= 40 ? '#f59e0b' : '#ef4444' },
          { label: 'Avg Mood',           value: moodAvg || '—', unit: '/5',   color: moodAvg >= 4 ? '#10b981' : moodAvg >= 3 ? '#3b82f6' : '#f59e0b' },
          { label: 'Skills Tracked',     value: skills.length,  unit: '',     color: '#7c3aed' },
          { label: 'Goals Active',       value: goals.filter(g => g.status !== 'done').length, unit: '', color: '#00d4ff' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 26, color: s.color }}>{s.value}<span style={{ fontSize: 12, color: 'var(--txt4)' }}>{s.unit}</span></div>
            <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 4, letterSpacing: .5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="g2" style={{ marginBottom: 16 }}>

        {/* MOOD TREND */}
        <div className="card" style={{ padding: 18 }}>
          <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 12 }}>
            📊 MOOD TREND (last {recentMoods.length} entries)
          </h4>
          {journal.length === 0
            ? <p style={{ color: 'var(--txt5)', fontSize: 11 }}>Write journal entries to see mood trend</p>
            : (
              <div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 54, marginBottom: 8 }}>
                  {[...recentMoods].reverse().map((m, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <span style={{ fontSize: 13 }}>{MOOD_ICONS[m]}</span>
                      <div style={{ width: '100%', height: `${m * 9}px`, minHeight: 4, borderRadius: 3, background: m >= 4 ? '#10b981' : m >= 3 ? '#3b82f6' : m >= 2 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--txt4)', fontSize: 10 }}>avg: {moodAvg} / 5</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: moodTrend === 'rising' ? '#10b981' : moodTrend === 'falling' ? '#ef4444' : '#3b82f6' }}>
                    {moodTrend === 'rising' ? '↑ Improving' : moodTrend === 'falling' ? '↓ Declining' : '→ Stable'}
                  </span>
                </div>
              </div>
            )}
        </div>

        {/* SITUATION SCAN */}
        <div className="card" style={{ padding: 18 }}>
          <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 12 }}>⚡ SITUATION SCAN</h4>
          {[
            { label: 'Urgent hackathons (≤7d)', value: urgentHacks.length,  color: urgentHacks.length  > 0 ? '#ef4444' : '#10b981' },
            { label: 'Overdue learning topics', value: overdueLearn.length, color: overdueLearn.length > 0 ? '#f59e0b' : '#10b981' },
            { label: 'Stalled goals (0% done)', value: stalledGoals.length, color: stalledGoals.length > 0 ? '#f59e0b' : '#10b981' },
            { label: 'Active job applications', value: pendingJobs.length,   color: '#3b82f6' },
            { label: 'Completed goals',         value: doneGoals.length,     color: '#10b981' },
            { label: 'Journal entries total',   value: journal.length,       color: '#7c3aed' },
          ].map((s) => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid var(--divider)' }}>
              <span style={{ fontSize: 11, color: 'var(--txt3)' }}>{s.label}</span>
              <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PRIORITY QUEUE */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 14 }}>🎯 PRIORITY QUEUE — DO THESE FIRST</h4>
        {pQueue.length === 0
          ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
              <p style={{ color: 'var(--txt4)', fontSize: 12, fontFamily: 'Syne', fontWeight: 700 }}>Nothing critical right now. You're on top of it!</p>
            </div>
          )
          : pQueue.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', marginBottom: 8, background: p.color + '0d', border: `1px solid ${p.color}28`, borderRadius: 10, borderLeft: `4px solid ${p.color}` }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: p.color, letterSpacing: .5, background: p.color + '22', padding: '3px 8px', borderRadius: 20, flexShrink: 0 }}>{p.label}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 12, color: 'var(--txt)', marginBottom: 2 }}>{p.title}</div>
                <div style={{ fontSize: 10, color: 'var(--txt4)' }}>{p.action}</div>
              </div>
              <span style={{ fontSize: 10, color: p.color, fontWeight: 700, flexShrink: 0 }}>{p.reason}</span>
            </div>
          ))}
      </div>

      {/* SMART SUGGESTIONS */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 14 }}>💡 SMART SUGGESTIONS</h4>
        {suggestions.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', marginBottom: 8, background: s.color + '0d', border: `1px solid ${s.color}22`, borderRadius: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
            <p style={{ fontSize: 11, color: 'var(--txt2)', lineHeight: 1.7 }}>{s.text}</p>
          </div>
        ))}
      </div>

      {/* PROGRESS BREAKDOWN */}
      <div className="g2">
        <div className="card" style={{ padding: 18 }}>
          <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 14 }}>📈 PROGRESS BREAKDOWN</h4>
          {[
            { label: 'Learning completed', done: doneLearn.length, total: learnings.length, color: '#00d4ff' },
            { label: 'Goals completed',    done: doneGoals.length, total: goals.length,     color: '#10b981' },
            { label: 'Journal entries',    done: journal.length,   total: Math.max(journal.length, 7), color: '#7c3aed' },
          ].map((p) => {
            const pct = p.total > 0 ? Math.round(p.done / p.total * 100) : 0;
            return (
              <div key={p.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 10, color: 'var(--txt3)' }}>{p.label}</span>
                  <span style={{ fontSize: 10, color: p.color, fontWeight: 700 }}>{p.done}/{p.total}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: p.color }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ padding: 18 }}>
          <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 14 }}>🧩 SKILL DISTRIBUTION</h4>
          {skills.length === 0
            ? <p style={{ color: 'var(--txt5)', fontSize: 11 }}>Add skills to see distribution</p>
            : (() => {
                const cats = {};
                skills.forEach((s) => { cats[s.category] = (cats[s.category] || 0) + 1; });
                return Object.entries(cats).map(([cat, count]) => (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid var(--divider)' }}>
                    <span style={{ fontSize: 11, color: 'var(--txt3)' }}>{cat}</span>
                    <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: '#7c3aed' }}>{count}</span>
                  </div>
                ));
              })()}
        </div>
      </div>

    </div>
  );
}