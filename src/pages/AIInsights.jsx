import { daysUntil, fmtDate } from '../utils/dates.js';
import { urgColorHex }        from '../utils/colors.js';

const MOOD_ICONS = ['', '😞', '😐', '🙂', '😊', '🚀'];

export default function AIInsights({ data, user }) {
  const {
    hackathons = [], learnings = [], jobs = [], goals = [],
    journal = [], skills = [], habits = [], books = [],
    exercise = {}, calls = [], medical = {},
  } = data;

  const exerciseSessions = exercise?.sessions || [];

  /* ── ANALYSIS ── */
  const urgentHacks   = hackathons.filter(h => { const d = daysUntil(h.deadline); return d !== null && d >= 0 && d <= 7 && h.status !== 'submitted'; });
  const overdueLearn  = learnings.filter(l  => { const d = daysUntil(l.date);     return d !== null && d < 0  && l.status !== 'done'; });
  const stalledGoals  = goals.filter(g => { const t = g.tasks || []; return g.status !== 'done' && t.length > 0 && t.filter(x => x.done).length === 0; });
  const pendingJobs   = jobs.filter(j => j.status === 'interviewing' || j.status === 'applied');
  const doneGoals     = goals.filter(g => g.status === 'done');
  const doneLearn     = learnings.filter(l => l.status === 'done');
  const activeGoals   = goals.filter(g => g.status !== 'done');
  const readingBooks  = (books || []).filter(b => b.status === 'Reading');
  const doneBooks     = (books || []).filter(b => b.status === 'Completed');
  const pendingCallFU = (calls || []).filter(c => c.followUpDate && !c.followUpDone);

  // Habits
  const todayStr      = new Date().toISOString().split('T')[0];
  const habitsToday   = habits.filter(h => h.completedDates?.includes(todayStr)).length;
  const habitPct      = habits.length ? Math.round(habitsToday / habits.length * 100) : 0;
  const topStreak     = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);

  // Exercise this week
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const weekExercise  = exerciseSessions.filter(s => new Date(s.date) >= weekAgo);
  const weekMinutes   = weekExercise.reduce((s, e) => s + (parseInt(e.duration) || 0), 0);

  // Mood
  const recentMoods = [...journal].slice(0, 7).map(e => e.mood || 3);
  const moodAvg     = recentMoods.length ? (recentMoods.reduce((s, v) => s + v, 0) / recentMoods.length).toFixed(1) : null;
  const moodTrend   = recentMoods.length >= 2
    ? recentMoods[0] > recentMoods[recentMoods.length - 1] ? 'rising'
    : recentMoods[0] < recentMoods[recentMoods.length - 1] ? 'falling'
    : 'stable' : 'stable';

  /* ── PRODUCTIVITY SCORE (0–100) ── */
  const score = Math.min(100, Math.max(0, Math.round(
    (doneLearn.length   * 8)  +
    (doneGoals.length   * 15) +
    (journal.length     * 4)  +
    (skills.length      * 2)  +
    (doneBooks.length   * 10) +
    (habitsToday        * 6)  +
    (weekExercise.length* 5)  -
    (urgentHacks.length * 8)  -
    (overdueLearn.length* 12) -
    (stalledGoals.length* 5)
  )));

  const scoreColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  const scoreLabel = score >= 70 ? 'Strong' : score >= 40 ? 'Building' : 'Needs Focus';

  /* ── PRIORITY QUEUE ── */
  const pQueue = [];
  urgentHacks.forEach(h => {
    const d = daysUntil(h.deadline);
    pQueue.push({ color: d === 0 ? '#ef4444' : d <= 2 ? '#f97316' : '#f59e0b', label: d === 0 ? 'TODAY' : d <= 2 ? 'CRITICAL' : 'URGENT', title: `🏆 ${h.name}`, action: `Submit before ${fmtDate(h.deadline)}`, reason: d === 0 ? 'Due TODAY' : `${d}d left`, sortKey: d });
  });
  overdueLearn.forEach(l   => pQueue.push({ color: '#ef4444', label: 'OVERDUE',    title: `📚 ${l.topic}`, action: 'Reschedule or mark done', reason: 'Missed date', sortKey: -1 }));
  stalledGoals.forEach(g   => pQueue.push({ color: '#7c3aed', label: 'STALLED',    title: `🎯 ${g.title}`, action: 'Start with one small task', reason: '0% progress', sortKey: 9 }));
  pendingJobs.forEach(j => {
    const d = daysUntil(j.deadline);
    if (d !== null && d >= 0 && d <= 5)
      pQueue.push({ color: '#8b5cf6', label: 'FOLLOW UP', title: `💼 ${j.role} @ ${j.company}`, action: 'Send a follow-up message', reason: `${d}d`, sortKey: d + 2 });
  });
  pendingCallFU.slice(0, 2).forEach(c => {
    if (c.followUpDate === todayStr)
      pQueue.push({ color: '#f59e0b', label: 'TODAY', title: `📞 ${c.name}`, action: c.followUp || 'Follow-up due', reason: 'Call follow-up', sortKey: 0.5 });
  });
  pQueue.sort((a, b) => a.sortKey - b.sortKey);

  /* ── SMART SUGGESTIONS ── */
  const suggestions = [];
  if (urgentHacks.length > 0)       suggestions.push({ icon: '🏆', text: `${urgentHacks.length} competition deadline${urgentHacks.length > 1 ? 's' : ''} within 7 days — submit before anything else.`, color: '#ef4444' });
  if (overdueLearn.length > 0)      suggestions.push({ icon: '📚', text: `${overdueLearn.length} learning session${overdueLearn.length > 1 ? 's are' : ' is'} overdue — reschedule them today to stay on track.`, color: '#f59e0b' });
  if (stalledGoals.length > 0)      suggestions.push({ icon: '🎯', text: `${stalledGoals.length} goal${stalledGoals.length > 1 ? 's have' : ' has'} zero progress — pick one task from each and complete it today.`, color: '#f59e0b' });
  if (moodAvg && parseFloat(moodAvg) < 3)  suggestions.push({ icon: '😐', text: `Your mood average is ${moodAvg}/5 — take time for rest or something you enjoy today.`, color: '#8b5cf6' });
  if (habitPct < 50 && habits.length > 0)  suggestions.push({ icon: '✅', text: `You've completed ${habitsToday}/${habits.length} habits today — finish the remaining ${habits.length - habitsToday} before the day ends.`, color: '#f43f5e' });
  if (topStreak >= 5)                suggestions.push({ icon: '🔥', text: `${topStreak}-day streak on one of your habits — incredible consistency. Protect that streak today.`, color: '#10b981' });
  if (weekExercise.length === 0)     suggestions.push({ icon: '💪', text: `No exercise logged this week — even a 20-minute walk resets your energy and focus.`, color: '#06b6d4' });
  if (weekMinutes >= 150)            suggestions.push({ icon: '💪', text: `${weekMinutes} minutes of exercise this week — you've hit the recommended target. Keep the momentum.`, color: '#10b981' });
  if (readingBooks.length > 0)       suggestions.push({ icon: '📖', text: `You're currently reading "${readingBooks[0].title}" — schedule 20 minutes today to keep progressing.`, color: '#f59e0b' });
  if (doneBooks.length >= 3)         suggestions.push({ icon: '📚', text: `${doneBooks.length} books completed — a reader's advantage compounds over time. Set your next read.`, color: '#10b981' });
  if (skills.filter(s => s.level <= 2).length > 0) {
    const weak = skills.filter(s => s.level <= 2);
    suggestions.push({ icon: '🧩', text: `${weak.length} skill${weak.length > 1 ? 's' : ''} still at beginner level (${weak.slice(0,2).map(s=>s.name).join(', ')}) — schedule focused practice sessions.`, color: '#3b82f6' });
  }
  if (pendingJobs.length > 0)        suggestions.push({ icon: '💼', text: `${pendingJobs.length} active application${pendingJobs.length > 1 ? 's' : ''} — follow up after 5–7 days of no response.`, color: '#8b5cf6' });
  if (medical?.contacts?.length > 0) suggestions.push({ icon: '🏥', text: `Your emergency contacts are on file — review them once a month to make sure numbers are current.`, color: '#ef4444' });
  if (journal.length === 0)          suggestions.push({ icon: '📓', text: `Start journaling — two sentences a day helps you track your growth and spot patterns.`, color: '#64748b' });
  if (suggestions.length === 0)      suggestions.push({ icon: '🎉', text: `Everything looks strong. No urgent items. Focus on deep work and keep building.`, color: '#10b981' });

  return (
    <div className="fade">

      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
          <span style={{ background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            ✦ AI Coach
          </span>
        </h2>
        <p style={{ color: 'var(--txt4)', fontSize: 12 }}>
          Smart analysis of your life — instant · local · private · no API needed
        </p>
      </div>

      {/* TOP STATS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Productivity Score', value: score,                       unit: '/100', color: scoreColor,  sub: scoreLabel },
          { label: 'Mood Average',       value: moodAvg || '—',              unit: '/5',  color: moodAvg >= 4 ? '#10b981' : moodAvg >= 3 ? '#3b82f6' : '#f59e0b', sub: moodTrend === 'rising' ? '↑ Improving' : moodTrend === 'falling' ? '↓ Declining' : '→ Stable' },
          { label: 'Habits Today',       value: `${habitsToday}/${habits.length}`,unit:'',color: habitPct === 100 ? '#10b981' : '#f43f5e', sub: `${habitPct}% complete` },
          { label: 'Active Goals',       value: activeGoals.length,          unit: '',    color: '#00d4ff',    sub: `${doneGoals.length} completed` },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 18px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: s.color, lineHeight: 1 }}>
              {s.value}<span style={{ fontSize: 12, color: 'var(--txt4)', fontWeight: 400 }}>{s.unit}</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--txt3)', marginTop: 5, fontWeight: 700, letterSpacing: .5 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: s.color, marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="g2" style={{ marginBottom: 18 }}>

        {/* MOOD TREND */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 14 }}>
            📊 MOOD TREND — last {recentMoods.length} entries
          </div>
          {journal.length === 0 ? (
            <p style={{ color: 'var(--txt4)', fontSize: 12 }}>Write journal entries to see mood trend</p>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 58, marginBottom: 10 }}>
                {[...recentMoods].reverse().map((m, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <span style={{ fontSize: 13 }}>{MOOD_ICONS[m]}</span>
                    <div style={{ width: '100%', height: `${m * 10}px`, minHeight: 4, borderRadius: 3, background: m >= 4 ? '#10b981' : m >= 3 ? '#3b82f6' : m >= 2 ? '#f59e0b' : '#ef4444', transition: 'height .3s' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--txt4)', fontSize: 11 }}>avg: <strong style={{ color: 'var(--txt2)' }}>{moodAvg}/5</strong></span>
                <span style={{ fontSize: 11, fontWeight: 700, color: moodTrend === 'rising' ? '#10b981' : moodTrend === 'falling' ? '#ef4444' : '#3b82f6' }}>
                  {moodTrend === 'rising' ? '↑ Improving' : moodTrend === 'falling' ? '↓ Declining' : '→ Stable'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* SITUATION SCAN */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 14 }}>⚡ SITUATION SCAN</div>
          {[
            { label: 'Urgent competitions (≤7d)', value: urgentHacks.length,      color: urgentHacks.length  > 0 ? '#ef4444' : '#10b981' },
            { label: 'Overdue learning sessions', value: overdueLearn.length,     color: overdueLearn.length > 0 ? '#f59e0b' : '#10b981' },
            { label: 'Stalled goals (0% done)',   value: stalledGoals.length,     color: stalledGoals.length > 0 ? '#f59e0b' : '#10b981' },
            { label: 'Active job applications',   value: pendingJobs.length,      color: '#3b82f6' },
            { label: 'Exercise sessions / week',  value: weekExercise.length,     color: weekExercise.length >= 3 ? '#10b981' : '#f59e0b' },
            { label: 'Books completed',           value: doneBooks.length,        color: '#10b981' },
            { label: 'Call follow-ups pending',   value: pendingCallFU.length,    color: pendingCallFU.length > 0 ? '#f59e0b' : '#10b981' },
            { label: 'Journal entries',           value: journal.length,          color: '#7c3aed' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid var(--divider)' }}>
              <span style={{ fontSize: 11, color: 'var(--txt3)' }}>{s.label}</span>
              <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PRIORITY QUEUE */}
      <div className="card" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 16 }}>🎯 PRIORITY QUEUE — DO THESE FIRST</div>
        {pQueue.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
            <p style={{ color: 'var(--txt3)', fontSize: 13, fontFamily: 'Syne', fontWeight: 700 }}>Nothing critical right now</p>
            <p style={{ color: 'var(--txt5)', fontSize: 11, marginTop: 4 }}>You're on top of everything. Keep building.</p>
          </div>
        ) : pQueue.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', marginBottom: 8, background: p.color + '0d', border: `1px solid ${p.color}28`, borderRadius: 10, borderLeft: `4px solid ${p.color}` }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: p.color, letterSpacing: .5, background: p.color + '22', padding: '3px 9px', borderRadius: 20, flexShrink: 0 }}>{p.label}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: 'var(--txt)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
              <div style={{ fontSize: 10, color: 'var(--txt4)' }}>{p.action}</div>
            </div>
            <span style={{ fontSize: 10, color: p.color, fontWeight: 700, flexShrink: 0 }}>{p.reason}</span>
          </div>
        ))}
      </div>

      {/* SMART SUGGESTIONS */}
      <div className="card" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 16 }}>💡 SMART SUGGESTIONS</div>
        {suggestions.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', marginBottom: 8, background: s.color + '0d', border: `1px solid ${s.color}22`, borderRadius: 10 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
            <p style={{ fontSize: 12, color: 'var(--txt2)', lineHeight: 1.7 }}>{s.text}</p>
          </div>
        ))}
      </div>

      {/* PROGRESS + SKILLS */}
      <div className="g2" style={{ marginBottom: 18 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 16 }}>📈 PROGRESS BREAKDOWN</div>
          {[
            { label: 'Learning completed', done: doneLearn.length,  total: learnings.length,                  color: '#00d4ff' },
            { label: 'Goals completed',    done: doneGoals.length,  total: goals.length,                      color: '#10b981' },
            { label: 'Books completed',    done: doneBooks.length,  total: Math.max(books?.length || 0, 1),   color: '#f59e0b' },
            { label: 'Habits today',       done: habitsToday,       total: Math.max(habits.length, 1),        color: '#f43f5e' },
            { label: 'Journal entries',    done: journal.length,    total: Math.max(journal.length, 7),       color: '#7c3aed' },
          ].map(p => {
            const pct = p.total > 0 ? Math.round(p.done / p.total * 100) : 0;
            return (
              <div key={p.label} style={{ marginBottom: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: 'var(--txt3)' }}>{p.label}</span>
                  <span style={{ fontSize: 10, color: p.color, fontWeight: 700 }}>{p.done}/{p.total}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: p.color }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 16 }}>🧩 SKILL DISTRIBUTION</div>
          {skills.length === 0 ? (
            <p style={{ color: 'var(--txt4)', fontSize: 12 }}>Add skills to see distribution</p>
          ) : (() => {
            const cats = {};
            skills.forEach(s => { cats[s.category] = (cats[s.category] || 0) + 1; });
            const maxVal = Math.max(...Object.values(cats));
            return Object.entries(cats).sort((a,b) => b[1]-a[1]).map(([cat, count]) => (
              <div key={cat} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--txt3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, paddingRight: 8 }}>{cat}</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 12, color: '#7c3aed', flexShrink: 0 }}>{count}</span>
                </div>
                <div className="progress-bar" style={{ height: 4 }}>
                  <div className="progress-fill" style={{ width: `${Math.round(count / maxVal * 100)}%`, background: '#7c3aed' }} />
                </div>
              </div>
            ));
          })()}

          {/* Exercise mini summary */}
          {weekExercise.length > 0 && (
            <div style={{ marginTop: 16, padding: '12px 14px', background: '#06b6d408', border: '1px solid #06b6d422', borderRadius: 9 }}>
              <div style={{ fontSize: 9, color: '#06b6d4', fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>💪 EXERCISE THIS WEEK</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: '#06b6d4' }}>{weekExercise.length}</div>
                  <div style={{ fontSize: 9, color: 'var(--txt4)' }}>sessions</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: '#10b981' }}>{weekMinutes}</div>
                  <div style={{ fontSize: 9, color: 'var(--txt4)' }}>minutes</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: '#f59e0b' }}>
                    {weekExercise.reduce((s, e) => s + (parseInt(e.calories) || 0), 0) || '—'}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--txt4)' }}>cal</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}