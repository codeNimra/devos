import { daysUntil, fmtDate, today } from '../utils/dates.js';
import { urgColorHex, urgLabel }      from '../utils/colors.js';

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Consistency is more important than perfection.", author: "Unknown" },
  { text: "Your habits shape your identity.", author: "James Clear" },
  { text: "One day or day one. You decide.", author: "Unknown" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Small steps every day lead to big results.", author: "Unknown" },
  { text: "Your future self is watching you right now.", author: "Unknown" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "A year from now you'll wish you started today.", author: "Karen Lamb" },
  { text: "Make it happen. Shock everyone.", author: "Unknown" },
  { text: "Work hard in silence. Let success be your noise.", author: "Frank Ocean" },
  { text: "Don't wish for it. Work for it.", author: "Unknown" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
  { text: "Eat well, move daily, sleep enough, think deeply.", author: "Unknown" },
  { text: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
  { text: "Discipline is choosing what you want most over what you want now.", author: "Unknown" },
  { text: "Push yourself — no one else will do it for you.", author: "Unknown" },
  { text: "Be the energy you want to attract.", author: "Unknown" },
  { text: "The only person you should be better than is who you were yesterday.", author: "Unknown" },
  { text: "Build things. Break things. Learn everything.", author: "Unknown" },
  { text: "You don't have to be great to start, but you must start to be great.", author: "Zig Ziglar" },
  { text: "Success is the sum of small efforts repeated every day.", author: "Robert Collier" },
  { text: "Life is what happens when you stop waiting and start doing.", author: "Unknown" },
  { text: "Every day is a chance to be better than yesterday.", author: "Unknown" },
  { text: "You are one decision away from a completely different life.", author: "Unknown" },
  { text: "Don't count the days. Make the days count.", author: "Muhammad Ali" },
  { text: "Your only limit is your mind.", author: "Unknown" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "What you do every day matters more than what you do once in a while.", author: "Unknown" },
];

const dayOfYear  = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
const dailyQuote = QUOTES[dayOfYear % QUOTES.length];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function getGreeting(name) {
  const h = new Date().getHours();
  if (h < 5)  return `Good night, ${name} 🌙`;
  if (h < 12) return `Good morning, ${name} ☀️`;
  if (h < 17) return `Good afternoon, ${name} 👋`;
  if (h < 21) return `Good evening, ${name} 🌆`;
  return `Late night, ${name} 🌙`;
}

export default function Dashboard({ data, user }) {
  const {
    hackathons = [], learnings = [], projects = [], jobs = [],
    goals = [], journal = [], events = [], habits = [],
    calls = [], books = [], exercise = {},
  } = data;

  const now     = new Date();
  const dateStr = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()} ${now.getFullYear()}`;

  /* ── COMPUTED ── */
  const urgentDeadlines = hackathons.filter(h => { const d = daysUntil(h.deadline); return d !== null && d >= 0 && d <= 5 && h.status !== 'submitted'; });
  const activeGoals     = goals.filter(g => g.status !== 'done');
  const upcomingEvents  = events.filter(e => { const d = daysUntil(e.date); return d !== null && d >= 0 && d <= 7; }).slice(0, 4);
  const doneGoals       = goals.filter(g => g.status === 'done').length;
  const doneLearns      = learnings.filter(l => l.status === 'done').length;
  const pendingJobs     = jobs.filter(j => j.status === 'applied' || j.status === 'interviewing');
  const recentMood      = journal[0]?.mood;
  const moodEmoji       = ['','😞','😐','🙂','😊','🚀'][recentMood] || '—';
  const habitsToday     = habits.filter(h => h.completedDates?.includes(today())).length;
  const habitPct        = habits.length ? Math.round(habitsToday / habits.length * 100) : 0;
  const readingNow      = (books || []).find(b => b.status === 'Reading');
  const exerciseSessions= (exercise?.sessions || []).filter(s => {
    const d = new Date(s.date); const ago = new Date(); ago.setDate(ago.getDate() - 7);
    return d >= ago;
  });
  const callFollowups   = (calls || []).filter(c => c.followUpDate === today());

  /* ── PRIORITY QUEUE ── */
  const priorities = [];
  urgentDeadlines.forEach(h => {
    const d = daysUntil(h.deadline);
    priorities.push({ color: d === 0 ? '#ef4444' : d <= 2 ? '#f97316' : '#f59e0b', label: d === 0 ? 'TODAY' : `${d}d left`, title: h.name, sub: 'Competition deadline' });
  });
  learnings.filter(l => { const d = daysUntil(l.date); return d !== null && d < 0 && l.status !== 'done'; })
    .slice(0, 2).forEach(l => priorities.push({ color: '#ef4444', label: 'Overdue', title: l.topic, sub: 'Learning session' }));
  activeGoals.filter(g => g.tasks?.length && g.tasks.filter(t => t.done).length === 0)
    .slice(0, 1).forEach(g => priorities.push({ color: '#7c3aed', label: '0% done', title: g.title, sub: 'Goal — no progress yet' }));
  callFollowups.slice(0, 1).forEach(c => priorities.push({ color: '#f59e0b', label: 'TODAY', title: `📞 ${c.name}`, sub: c.followUp || 'Follow-up call' }));

  /* ── STAT CARDS ── */
  const STATS = [
    { label: 'Competitions',  value: hackathons.length,                                  sub: `${urgentDeadlines.length} urgent`,     color: '#00d4ff', icon: '🏆' },
    { label: 'Opportunities', value: jobs.length,                                         sub: `${pendingJobs.length} active`,         color: '#7c3aed', icon: '💼' },
    { label: 'Goals',         value: goals.length,                                        sub: `${doneGoals} completed`,               color: '#10b981', icon: '🎯' },
    { label: 'Habits Today',  value: `${habitsToday}/${habits.length}`,                  sub: `${habitPct}% done`,                    color: '#f43f5e', icon: '✅' },
    { label: 'Exercise',      value: exerciseSessions.length,                             sub: 'sessions this week',                  color: '#06b6d4', icon: '💪' },
    { label: 'Mood',          value: moodEmoji,                                           sub: recentMood ? `${recentMood}/5` : '—',  color: '#f59e0b', icon: '📓' },
  ];

  return (
    <div className="fade">

      {/* ── HEADER ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: 20, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--txt4)', letterSpacing: 1.5, marginBottom: 8, fontWeight: 600 }}>
            {dateStr}
          </div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800,
            color: 'var(--txt)', lineHeight: 1.1, marginBottom: 6,
          }}>
            {getGreeting(user?.name || 'You')}
          </h1>
          <div style={{ fontSize: 12, color: 'var(--txt4)', display: 'flex', alignItems: 'center', gap: 8 }}>
            {user?.field && <span style={{ color: 'var(--txt3)', fontWeight: 600 }}>{user.field}</span>}
            {user?.field && <span>·</span>}
            <span>LifeOS</span>
          </div>
        </div>

        {/* Quick-access streak */}
        {habits.length > 0 && (
          <div style={{
            padding: '12px 18px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 12,
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 800, color: habitPct === 100 ? '#10b981' : '#00d4ff' }}>
              {habitPct === 100 ? '🎉' : `${habitPct}%`}
            </div>
            <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 3 }}>habits today</div>
          </div>
        )}
      </div>

      {/* ── DAILY QUOTE ── */}
      <div style={{
        padding: '15px 20px', marginBottom: 22,
        background: 'linear-gradient(135deg, #00d4ff08, #7c3aed06)',
        border: '1px solid #00d4ff18', borderLeft: '4px solid #00d4ff',
        borderRadius: 12,
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#00d4ff', letterSpacing: 2, marginBottom: 6 }}>
          ✦ TODAY'S MOTIVATION
        </div>
        <p style={{ fontSize: 13, color: 'var(--txt)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 4 }}>
          "{dailyQuote.text}"
        </p>
        <p style={{ fontSize: 10, color: 'var(--txt4)', fontWeight: 600 }}>— {dailyQuote.author}</p>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
        {STATS.map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderTop: `3px solid ${s.color}`, borderRadius: 12,
            padding: '16px 18px',
            transition: 'transform .18s, box-shadow .18s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px #00000030'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
              <div style={{ fontFamily: 'Syne', fontSize: 30, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt2)' }}>{s.label}</div>
            <div style={{ fontSize: 11, color: 'var(--txt4)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── LOWER FOUR PANELS ── */}
      <div className="g2" style={{ marginBottom: 18 }}>

        {/* PRIORITY QUEUE */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 16 }}>
            ⚡ PRIORITY QUEUE
          </div>
          {priorities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
              <p style={{ fontSize: 13, color: 'var(--txt4)', fontWeight: 600 }}>Nothing critical right now</p>
              <p style={{ fontSize: 11, color: 'var(--txt5)', marginTop: 4 }}>Great work staying on top of things</p>
            </div>
          ) : priorities.slice(0, 5).map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 13px', marginBottom: 8,
              background: p.color + '0c', border: `1px solid ${p.color}22`,
              borderLeft: `3px solid ${p.color}`, borderRadius: 10,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 10, color: 'var(--txt4)' }}>{p.sub}</div>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 800, color: p.color,
                background: p.color + '20', padding: '3px 9px',
                borderRadius: 20, flexShrink: 0, letterSpacing: .5,
              }}>
                {p.label}
              </span>
            </div>
          ))}
        </div>

        {/* HABITS */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1 }}>✅ HABITS TODAY</div>
            <span style={{ fontSize: 12, color: habitPct === 100 ? '#10b981' : '#00d4ff', fontWeight: 700 }}>{habitPct}%</span>
          </div>
          <div className="progress-bar" style={{ marginBottom: 16, height: 6 }}>
            <div className="progress-fill" style={{ width: `${habitPct}%`, background: habitPct === 100 ? '#10b981' : 'linear-gradient(90deg,#00d4ff,#7c3aed)' }} />
          </div>
          {habits.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--txt4)' }}>Add habits in Build → Habits</p>
          ) : habits.slice(0, 6).map(h => {
            const done = h.completedDates?.includes(today());
            return (
              <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--divider)' }}>
                <div style={{
                  width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                  background: done ? h.color || '#10b981' : 'transparent',
                  border: `2px solid ${h.color || '#10b981'}`,
                  transition: 'background .2s',
                }} />
                <span style={{ fontSize: 12, color: done ? 'var(--txt4)' : 'var(--txt2)', textDecoration: done ? 'line-through' : 'none', flex: 1 }}>
                  {h.name}
                </span>
                {h.streak > 0 && <span style={{ fontSize: 10, color: '#f59e0b', flexShrink: 0 }}>🔥{h.streak}</span>}
              </div>
            );
          })}
        </div>

        {/* GOALS */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 16 }}>🎯 ACTIVE GOALS</div>
          {activeGoals.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--txt4)' }}>No active goals — add some in Build → Goals</p>
          ) : activeGoals.slice(0, 4).map(g => {
            const pct = g.tasks?.length ? Math.round(g.tasks.filter(t => t.done).length / g.tasks.length * 100) : 0;
            return (
              <div key={g.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: 'var(--txt2)', flex: 1, paddingRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</span>
                  <span style={{ fontSize: 11, color: pct === 100 ? '#10b981' : '#00d4ff', fontWeight: 700, flexShrink: 0 }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? '#10b981' : '#00d4ff' }} />
                </div>
              </div>
            );
          })}

          {/* Currently reading */}
          {readingNow && (
            <div style={{ marginTop: 16, padding: '10px 12px', background: '#f59e0b08', border: '1px solid #f59e0b22', borderRadius: 9 }}>
              <div style={{ fontSize: 9, color: '#f59e0b', fontWeight: 700, letterSpacing: 1, marginBottom: 5 }}>📖 CURRENTLY READING</div>
              <div style={{ fontSize: 12, color: 'var(--txt)', fontWeight: 600, marginBottom: 4 }}>{readingNow.title}</div>
              {readingNow.totalPages && readingNow.currentPage && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: 'var(--txt4)' }}>p. {readingNow.currentPage}/{readingNow.totalPages}</span>
                    <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>{Math.round(readingNow.currentPage / readingNow.totalPages * 100)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.round(readingNow.currentPage / readingNow.totalPages * 100)}%`, background: '#f59e0b' }} />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* UPCOMING + FOLLOW-UPS */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 16 }}>🗓 UPCOMING (7 DAYS)</div>
          {upcomingEvents.length === 0 && callFollowups.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--txt4)' }}>No events in the next 7 days</p>
          ) : (
            <>
              {upcomingEvents.map(e => {
                const d = daysUntil(e.date);
                return (
                  <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--divider)' }}>
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--txt)', fontWeight: 600, marginBottom: 1 }}>{e.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--txt4)' }}>{fmtDate(e.date)}</div>
                    </div>
                    <span style={{ fontSize: 10, color: urgColorHex(d), fontWeight: 700, flexShrink: 0 }}>{urgLabel(d)}</span>
                  </div>
                );
              })}
              {callFollowups.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--divider)' }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--txt)', fontWeight: 600, marginBottom: 1 }}>📞 {c.name}</div>
                    <div style={{ fontSize: 10, color: '#f59e0b' }}>{c.followUp || 'Follow-up due'}</div>
                  </div>
                  <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>TODAY</span>
                </div>
              ))}
            </>
          )}

          {/* Exercise this week mini */}
          {exerciseSessions.length > 0 && (
            <div style={{ marginTop: 14, padding: '10px 12px', background: '#06b6d408', border: '1px solid #06b6d422', borderRadius: 9 }}>
              <div style={{ fontSize: 9, color: '#06b6d4', fontWeight: 700, letterSpacing: 1, marginBottom: 5 }}>💪 EXERCISE THIS WEEK</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, color: '#06b6d4' }}>{exerciseSessions.length}</div>
                  <div style={{ fontSize: 9, color: 'var(--txt4)' }}>sessions</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, color: '#10b981' }}>
                    {exerciseSessions.reduce((s, e) => s + (parseInt(e.duration) || 0), 0)}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--txt4)' }}>minutes</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, color: '#f59e0b' }}>
                    {exerciseSessions.reduce((s, e) => s + (parseInt(e.calories) || 0), 0) || '—'}
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