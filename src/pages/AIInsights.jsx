import { useState }              from 'react';
import { daysUntil, fmtDate }    from '../utils/dates.js';
import { urgColorHex }           from '../utils/colors.js';

const URGENCY_COL = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6' };
const MOOD_ICONS  = ['', '😞', '😐', '🙂', '😊', '🚀'];

export default function AIInsights({ data, user }) {
  const { hackathons, learnings, jobs, goals, journal, notes, skills } = data;
  const [loading,  setLoading]  = useState(false);
  const [insights, setInsights] = useState(null);
  const [error,    setError]    = useState(null);

  /* ── STATIC ANALYSIS (instant, no API) ── */
  const urgentHacks  = hackathons.filter((h) => { const d = daysUntil(h.deadline); return d !== null && d >= 0 && d <= 7 && h.status !== 'submitted'; });
  const overdueLearn = learnings.filter((l) =>  { const d = daysUntil(l.date);     return d !== null && d < 0  && l.status !== 'done'; });
  const stalledGoals = goals.filter((g) => {
    const tasks = g.tasks || [];
    return g.status !== 'done' && tasks.length > 0 && tasks.filter((t) => t.done).length === 0;
  });
  const pendingJobs = jobs.filter((j) => j.status === 'interviewing' || j.status === 'applied');
  const recentMoods = [...journal].slice(0, 7).map((e) => e.mood || 3);
  const moodAvg     = recentMoods.length ? (recentMoods.reduce((s, v) => s + v, 0) / recentMoods.length).toFixed(1) : null;
  const moodTrend   =
    recentMoods.length >= 2
      ? recentMoods[0] > recentMoods[recentMoods.length - 1] ? 'rising'
      : recentMoods[0] < recentMoods[recentMoods.length - 1] ? 'falling'
      : 'stable'
    : 'stable';

  /* ── PRIORITY QUEUE ── */
  const pQueue = [];
  urgentHacks.forEach((h) => {
    const d = daysUntil(h.deadline);
    pQueue.push({
      color:   urgColorHex(d),
      label:   d === 0 ? 'TODAY' : d <= 2 ? 'CRITICAL' : 'URGENT',
      title:   `🏆 ${h.name}`,
      action:  `Submit before ${fmtDate(h.deadline)}`,
      reason:  d === 0 ? 'Due TODAY!' : `${d}d left`,
      sortKey: d,
    });
  });
  overdueLearn.forEach((l) =>
    pQueue.push({ color: '#ef4444', label: 'OVERDUE',    title: `📚 ${l.topic}`, action: 'Reschedule or mark done',      reason: 'Missed scheduled date', sortKey: -1 })
  );
  stalledGoals.forEach((g) =>
    pQueue.push({ color: '#f59e0b', label: 'STALLED',    title: `🎯 ${g.title}`, action: 'Complete at least 1 task now', reason: '0% — not started',      sortKey: 9  })
  );
  pendingJobs.forEach((j) => {
    const d = daysUntil(j.deadline);
    if (d !== null && d >= 0 && d <= 5)
      pQueue.push({ color: '#8b5cf6', label: 'FOLLOW UP', title: `💼 ${j.role} @ ${j.company}`, action: 'Send a follow-up message', reason: `Follow-up in ${d}d`, sortKey: d + 2 });
  });
  pQueue.sort((a, b) => a.sortKey - b.sortKey);

  /* ── CLAUDE API CALL ── */
  const generateAI = async () => {
    setLoading(true); setError(null); setInsights(null);

    const context = {
      name:            user?.name,
      journal_entries: [...journal].slice(0, 15).map((e) => ({ date: e.date, mood: e.mood, title: e.title, content: e.content?.slice(0, 250), tags: e.tags })),
      hackathons:      hackathons.map((h) => ({ name: h.name, deadline: h.deadline, status: h.status, daysLeft: daysUntil(h.deadline) })),
      goals:           goals.map((g)      => ({ title: g.title, status: g.status, progress: g.tasks?.length ? Math.round(g.tasks.filter((t) => t.done).length / g.tasks.length * 100) : 0, deadline: g.deadline })),
      learnings:       learnings.map((l)  => ({ topic: l.topic, category: l.category, status: l.status, date: l.date })),
      skills:          skills.map((s)     => ({ name: s.name, level: s.level, category: s.category })),
      notes:           [...notes].slice(0, 8).map((n) => ({ title: n.title, content: n.content?.slice(0, 120) })),
      jobs:            jobs.map((j)       => ({ role: j.role, company: j.company, status: j.status })),
    };

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model:      'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are an AI coach inside DevOS, a personal developer command center app.
Analyze the developer data and return ONLY a valid JSON object — no markdown fences, no explanation, just raw JSON.
Be specific and personal — reference their actual hackathon names, goal titles, skill names.
The JSON must exactly match this schema:
{
  "headline": "1 honest sentence about where they stand right now — be direct",
  "mood_pattern": "1 sentence about their energy/mood trend from journal data",
  "struggle_areas": ["2-4 specific topics or skills they seem to struggle with"],
  "coach_message": "2-3 sentence personal message — reference their actual goals/hackathons by name, be encouraging but honest",
  "today_plan": [
    { "task": "very specific actionable task", "why": "1 line reason tied to their data", "urgency": "critical|high|medium" }
  ],
  "hidden_insight": "1 non-obvious pattern you noticed that they might not see themselves",
  "next_milestone": "the single most important thing to accomplish this week — be specific"
}`,
          messages: [{ role: 'user', content: `Analyze this developer data and return JSON insights:\n${JSON.stringify(context)}` }],
        }),
      });

      const d = await res.json();
      if (!res.ok) throw new Error(d.error?.message || 'API error');
      const raw   = d.content.map((c) => c.text || '').join('');
      const clean = raw.replace(/```json|```/g, '').trim();
      setInsights(JSON.parse(clean));
    } catch (e) {
      setError(e.message || 'Something went wrong. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="fade">

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800 }}>
            <span style={{ background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>✦ AI Coach</span>
          </h2>
          <p style={{ color: 'var(--txt4)', fontSize: 11, marginTop: 2 }}>Real-time pattern analysis + personalized action plan across all your data</p>
        </div>
        <button
          onClick={generateAI}
          disabled={loading}
          style={{ padding: '10px 22px', borderRadius: 10, fontSize: 11, fontWeight: 700, border: 'none', letterSpacing: .5, transition: 'all .2s', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? 'var(--border)' : 'linear-gradient(135deg,#00d4ff,#7c3aed)', color: loading ? 'var(--txt4)' : '#fff' }}
        >
          {loading ? '⏳ Thinking…' : '✦ Generate AI Insights'}
        </button>
      </div>

      {/* STATIC PANELS — always visible */}
      <div className="g2" style={{ marginBottom: 16 }}>

        {/* Mood bars */}
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
                      <div style={{ width: '100%', height: `${m * 9}px`, minHeight: 4, borderRadius: 3, transition: 'height .3s', background: m >= 4 ? '#10b981' : m >= 3 ? '#3b82f6' : m >= 2 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--txt4)', fontSize: 10 }}>avg mood: {moodAvg} / 5</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: moodTrend === 'rising' ? '#10b981' : moodTrend === 'falling' ? '#ef4444' : '#3b82f6' }}>
                    {moodTrend === 'rising' ? '↑ Improving' : moodTrend === 'falling' ? '↓ Declining' : '→ Stable'}
                  </span>
                </div>
              </div>
            )}
        </div>

        {/* Situation scan */}
        <div className="card" style={{ padding: 18 }}>
          <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 12 }}>⚡ SITUATION SCAN</h4>
          {[
            { label: 'Urgent hackathons (≤7d)', value: urgentHacks.length,  color: urgentHacks.length  > 0 ? '#ef4444' : '#10b981' },
            { label: 'Overdue learning topics', value: overdueLearn.length, color: overdueLearn.length > 0 ? '#f59e0b' : '#10b981' },
            { label: 'Stalled goals (0% done)', value: stalledGoals.length, color: stalledGoals.length > 0 ? '#f59e0b' : '#10b981' },
            { label: 'Active job applications', value: pendingJobs.length,   color: '#3b82f6' },
            { label: 'Journal entries total',   value: journal.length,       color: '#7c3aed' },
          ].map((s) => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--divider)' }}>
              <span style={{ fontSize: 11, color: 'var(--txt3)' }}>{s.label}</span>
              <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PRIORITY QUEUE */}
      <div className="card" style={{ padding: 20, marginBottom: 18 }}>
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

      {/* ERROR */}
      {error && (
        <div style={{ padding: '14px 18px', background: '#ef444410', border: '1px solid #ef444430', borderRadius: 10, marginBottom: 16 }}>
          <p style={{ color: '#ef4444', fontSize: 11 }}>⚠ {error}</p>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="card" style={{ padding: 44, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12, animation: 'pulse 1.5s infinite' }}>🤖</div>
          <p style={{ color: 'var(--txt2)', fontSize: 13, fontFamily: 'Syne', fontWeight: 700, marginBottom: 4 }}>Reading your journal, goals & deadlines…</p>
          <p style={{ color: 'var(--txt5)', fontSize: 10 }}>Building your personalized action plan</p>
        </div>
      )}

      {/* AI RESULTS */}
      {insights && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div className="card" style={{ padding: 22, borderTop: '3px solid #00d4ff' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <span style={{ fontSize: 32, flexShrink: 0 }}>🤖</span>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, color: 'var(--txt)', marginBottom: 6 }}>{insights.headline}</div>
                <div style={{ fontSize: 11, color: 'var(--txt3)', lineHeight: 1.7 }}>{insights.mood_pattern}</div>
              </div>
            </div>
          </div>

          <div className="g2">
            <div className="card" style={{ padding: 20 }}>
              <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 14 }}>📋 TODAY'S AI PLAN</h4>
              {(insights.today_plan || []).map((task, i) => {
                const col = URGENCY_COL[task.urgency] || '#3b82f6';
                return (
                  <div key={i} style={{ padding: '10px 12px', marginBottom: 8, background: col + '0d', border: `1px solid ${col}28`, borderRadius: 9, borderLeft: `3px solid ${col}` }}>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: 'var(--txt)', marginBottom: 3 }}>{i + 1}. {task.task}</div>
                    <div style={{ fontSize: 10, color: 'var(--txt4)' }}>{task.why}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="card" style={{ padding: 18 }}>
                <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 10 }}>🔍 STRUGGLE AREAS</h4>
                {(insights.struggle_areas || []).map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid var(--divider)' }}>
                    <span style={{ fontSize: 10, color: '#f59e0b' }}>⚠</span>
                    <span style={{ fontSize: 11, color: 'var(--txt2)' }}>{s}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: 18, borderTop: '3px solid #7c3aed' }}>
                <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 11, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 10 }}>💡 HIDDEN INSIGHT</h4>
                <p style={{ fontSize: 11, color: 'var(--txt2)', lineHeight: 1.7 }}>{insights.hidden_insight}</p>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg,#00d4ff08,#7c3aed08)', border: '1px solid #00d4ff28' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>🎯</span>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 10, color: '#00d4ff', letterSpacing: 1.5, marginBottom: 6 }}>THIS WEEK'S MILESTONE</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: 'var(--txt)', marginBottom: 10 }}>{insights.next_milestone}</div>
                <p style={{ fontSize: 11, color: 'var(--txt2)', lineHeight: 1.8, fontStyle: 'italic', borderLeft: '3px solid #00d4ff44', paddingLeft: 12 }}>
                  "{insights.coach_message}"
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', paddingBottom: 8 }}>
            <button onClick={generateAI} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--txt4)', padding: '8px 20px', borderRadius: 20, fontSize: 10, cursor: 'pointer', fontWeight: 700 }}>
              ↺ Regenerate Insights
            </button>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!insights && !loading && !error && (
        <div className="card" style={{ padding: 44, textAlign: 'center', border: '1px dashed var(--border-strong)' }}>
          <div style={{ fontSize: 36, marginBottom: 14 }}>✦</div>
          <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--txt)', marginBottom: 6 }}>Your AI Coach is ready</p>
          <p style={{ fontSize: 11, color: 'var(--txt4)', maxWidth: 340, margin: '0 auto', lineHeight: 1.7 }}>
            Click Generate above. The AI reads your journal entries, deadlines, goals, skill gaps, and notes — then tells you exactly what to focus on and why.
          </p>
        </div>
      )}
    </div>
  );
}
