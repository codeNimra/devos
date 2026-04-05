import { daysUntil, fmtDate, today } from '../utils/dates.js';
import { urgColorHex, urgLabel }      from '../utils/colors.js';

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Consistency is more important than perfection.", author: "Unknown" },
  { text: "Small steps every day lead to big results.", author: "Unknown" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Build things. Break things. Learn everything.", author: "Unknown" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
  { text: "Every day is a chance to be better than yesterday.", author: "Unknown" },
  { text: "Your future self is watching you right now.", author: "Unknown" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "A year from now you'll wish you started today.", author: "Karen Lamb" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "You are one decision away from a completely different life.", author: "Unknown" },
  { text: "Don't count the days. Make the days count.", author: "Muhammad Ali" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Your habits shape your identity.", author: "James Clear" },
  { text: "The only person you should try to be better than is who you were yesterday.", author: "Unknown" },
  { text: "One day or day one. You decide.", author: "Unknown" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Unknown" },
  { text: "Eat well, move daily, sleep enough, think deeply.", author: "Unknown" },
  { text: "Life is what happens when you stop waiting and start doing.", author: "Unknown" },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { text: "Your only limit is your mind.", author: "Unknown" },
  { text: "Make it happen. Shock everyone.", author: "Unknown" },
  { text: "Work hard in silence. Let success be your noise.", author: "Frank Ocean" },
  { text: "Be the energy you want to attract.", author: "Unknown" },
  { text: "Don't wish for it. Work for it.", author: "Unknown" },
  { text: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
];

const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
const dailyQuote = QUOTES[dayOfYear % QUOTES.length];

function getGreeting(name) {
  const h = new Date().getHours();
  if (h < 5)  return `Good night, ${name} 🌙`;
  if (h < 12) return `Good morning, ${name} ☀️`;
  if (h < 17) return `Good afternoon, ${name} 👋`;
  if (h < 21) return `Good evening, ${name} 🌆`;
  return `Late night, ${name} 🌙`;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function Dashboard({ data, user }) {
  const {
    hackathons = [], learnings = [], projects = [], jobs = [],
    goals = [], journal = [], events = [], habits = [], calls = [],
  } = data;

  const now  = new Date();
  const dateStr = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()} ${now.getFullYear()}`;

  /* ── COMPUTED ── */
  const urgentDeadlines = hackathons.filter(h => {
    const d = daysUntil(h.deadline);
    return d !== null && d >= 0 && d <= 5 && h.status !== 'submitted';
  });
  const todayHabits    = habits.filter(h => !h.completedDates?.includes(today()));
  const activeGoals    = goals.filter(g => g.status !== 'done');
  const upcomingEvents = events.filter(e => { const d = daysUntil(e.date); return d !== null && d >= 0 && d <= 7; }).slice(0, 3);
  const doneGoals      = goals.filter(g => g.status === 'done').length;
  const doneLearns     = learnings.filter(l => l.status === 'done').length;
  const pendingJobs    = jobs.filter(j => j.status === 'applied' || j.status === 'interviewing');
  const recentMood     = journal[0]?.mood;
  const moodEmoji      = ['','😞','😐','🙂','😊','🚀'][recentMood] || '—';
  const habitsToday    = habits.filter(h => h.completedDates?.includes(today())).length;
  const habitPct       = habits.length ? Math.round(habitsToday / habits.length * 100) : 0;

  /* ── PRIORITY ITEMS (top 4 most urgent) ── */
  const priorities = [];
  urgentDeadlines.forEach(h => {
    const d = daysUntil(h.deadline);
    priorities.push({ color: d === 0 ? '#ef4444' : d <= 2 ? '#f97316' : '#f59e0b', label: d === 0 ? 'TODAY' : `${d}d left`, title: h.name, type: 'Deadline' });
  });
  const overdueLearn = learnings.filter(l => { const d = daysUntil(l.date); return d !== null && d < 0 && l.status !== 'done'; });
  overdueLearn.slice(0, 2).forEach(l => priorities.push({ color: '#ef4444', label: 'Overdue', title: l.topic, type: 'Learning' }));
  const stalledGoals = activeGoals.filter(g => g.tasks?.length && g.tasks.filter(t => t.done).length === 0);
  stalledGoals.slice(0, 1).forEach(g => priorities.push({ color: '#7c3aed', label: '0% done', title: g.title, type: 'Goal' }));

  /* ── STAT CARDS ── */
  const STATS = [
    { label: 'Competitions', value: hackathons.length, sub: `${urgentDeadlines.length} urgent`,       color: '#00d4ff', icon: '🏆' },
    { label: 'Opportunities', value: jobs.length,       sub: `${pendingJobs.length} active`,           color: '#7c3aed', icon: '💼' },
    { label: 'Goals',         value: goals.length,      sub: `${doneGoals} completed`,                 color: '#10b981', icon: '🎯' },
    { label: 'Learning',      value: learnings.length,  sub: `${doneLearns} done`,                     color: '#f59e0b', icon: '📚' },
    { label: 'Habits Today',  value: `${habitsToday}/${habits.length}`, sub: `${habitPct}% complete`,  color: '#f43f5e', icon: '✅' },
    { label: 'Mood',          value: moodEmoji,          sub: recentMood ? `${recentMood}/5 last entry` : 'No entries yet', color: '#06b6d4', icon: '📓' },
  ];

  return (
    <div className="fade">

      {/* ── TOP HEADER ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: 'var(--txt4)', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
          {dateStr}
        </div>
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800,
          color: 'var(--txt)', lineHeight: 1.2, marginBottom: 4,
        }}>
          {getGreeting(user?.name || 'You')}
        </h1>
        {user?.field && (
          <div style={{ fontSize: 12, color: 'var(--txt4)' }}>
            {user.field} · LifeOS
          </div>
        )}
      </div>

      {/* ── DAILY QUOTE ── */}
      <div style={{
        padding: '16px 20px', marginBottom: 24,
        background: 'linear-gradient(135deg, #00d4ff08, #7c3aed08)',
        border: '1px solid #00d4ff1e',
        borderLeft: '4px solid #00d4ff',
        borderRadius: 12,
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#00d4ff', letterSpacing: 2, marginBottom: 7 }}>
          ✦ TODAY'S MOTIVATION
        </div>
        <p style={{ fontSize: 13, color: 'var(--txt)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 5 }}>
          "{dailyQuote.text}"
        </p>
        <p style={{ fontSize: 10, color: 'var(--txt4)', fontWeight: 700 }}>— {dailyQuote.author}</p>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 22,
      }}>
        {STATS.map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)',
            border: `1px solid var(--border)`,
            borderTop: `3px solid ${s.color}`,
            borderRadius: 12,
            padding: '16px 18px',
            transition: 'transform .18s, box-shadow .18s',
            cursor: 'default',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px #00000033'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt2)' }}>{s.label}</div>
            <div style={{ fontSize: 11, color: 'var(--txt4)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── TWO COLUMN LOWER ── */}
      <div className="g2" style={{ marginBottom: 20 }}>

        {/* PRIORITY QUEUE */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 16 }}>
            ⚡ PRIORITY QUEUE
          </div>
          {priorities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
              <p style={{ fontSize: 12, color: 'var(--txt4)' }}>Nothing critical right now!</p>
            </div>
          ) : priorities.slice(0, 5).map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', marginBottom: 8,
              background: p.color + '0c',
              border: `1px solid ${p.color}25`,
              borderLeft: `3px solid ${p.color}`,
              borderRadius: 9,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 10, color: 'var(--txt4)' }}>{p.type}</div>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 800, color: p.color,
                background: p.color + '20', padding: '3px 8px', borderRadius: 20,
                flexShrink: 0, letterSpacing: .5,
              }}>
                {p.label}
              </span>
            </div>
          ))}
        </div>

        {/* TODAY'S HABITS */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1 }}>
              ✅ HABITS TODAY
            </div>
            <span style={{ fontSize: 11, color: habitPct === 100 ? '#10b981' : '#00d4ff', fontWeight: 700 }}>
              {habitPct}%
            </span>
          </div>
          <div className="progress-bar" style={{ marginBottom: 14, height: 6 }}>
            <div className="progress-fill" style={{ width: `${habitPct}%`, background: habitPct === 100 ? '#10b981' : 'linear-gradient(90deg,#00d4ff,#7c3aed)' }} />
          </div>
          {habits.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--txt4)' }}>No habits set up yet — add some in Build → Habits</p>
          ) : habits.slice(0, 5).map(h => {
            const done = h.completedDates?.includes(today());
            return (
              <div key={h.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', borderBottom: '1px solid var(--divider)',
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                  background: done ? h.color || '#10b981' : 'transparent',
                  border: `2px solid ${h.color || '#10b981'}`,
                }} />
                <span style={{
                  fontSize: 12, color: done ? 'var(--txt4)' : 'var(--txt2)',
                  textDecoration: done ? 'line-through' : 'none', flex: 1,
                }}>
                  {h.name}
                </span>
                {h.streak > 0 && (
                  <span style={{ fontSize: 10, color: '#f59e0b' }}>🔥{h.streak}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* ACTIVE GOALS */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 16 }}>
            🎯 ACTIVE GOALS
          </div>
          {activeGoals.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--txt4)' }}>No active goals — add some in Build → Goals</p>
          ) : activeGoals.slice(0, 4).map(g => {
            const pct = g.tasks?.length
              ? Math.round(g.tasks.filter(t => t.done).length / g.tasks.length * 100) : 0;
            return (
              <div key={g.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--txt2)', flex: 1, paddingRight: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</span>
                  <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700, flexShrink: 0 }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: '#10b981' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* UPCOMING EVENTS */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt3)', letterSpacing: 1, marginBottom: 16 }}>
            🗓 UPCOMING (7 DAYS)
          </div>
          {upcomingEvents.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--txt4)' }}>No events in the next 7 days</p>
          ) : upcomingEvents.map(e => {
            const d = daysUntil(e.date);
            return (
              <div key={e.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid var(--divider)',
              }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--txt)', fontWeight: 600, marginBottom: 2 }}>{e.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--txt4)' }}>{fmtDate(e.date)}</div>
                </div>
                <span style={{ fontSize: 10, color: urgColorHex(d), fontWeight: 700, flexShrink: 0 }}>
                  {urgLabel(d)}
                </span>
              </div>
            );
          })}

          {/* Follow-up calls if any */}
          {calls?.filter(c => c.followUpDate === today()).slice(0,2).map(c => (
            <div key={c.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid var(--divider)',
            }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--txt)', fontWeight: 600, marginBottom: 2 }}>📞 {c.name}</div>
                <div style={{ fontSize: 10, color: '#f59e0b' }}>Follow-up due today</div>
              </div>
              <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>TODAY</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}