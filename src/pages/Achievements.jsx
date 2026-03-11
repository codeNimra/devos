export default function Achievements({ hackathons, learnings, projects, jobs, journal, goals, bookmarks, people }) {
  const BADGES = [
    { id: 'first_hack',   icon: '🏆', title: 'First Hackathon',    desc: 'Registered for your first hackathon',     earned: hackathons.length >= 1 },
    { id: 'hack5',        icon: '⚡', title: 'Hackathon Veteran',   desc: '5+ hackathons tracked',                   earned: hackathons.length >= 5 },
    { id: 'submitted',    icon: '🚀', title: 'Shipped It!',         desc: 'Submitted a hackathon project',           earned: hackathons.some((h) => h.status === 'submitted') },
    { id: 'learn10',      icon: '📚', title: 'Knowledge Seeker',    desc: '10+ learning topics added',               earned: learnings.length >= 10 },
    { id: 'learn_done5',  icon: '✅', title: 'Completionist',       desc: 'Completed 5+ learning topics',            earned: learnings.filter((l) => l.status === 'done').length >= 5 },
    { id: 'project3',     icon: '🛠', title: 'Builder',             desc: '3+ projects tracked',                     earned: projects.length >= 3 },
    { id: 'journal7',     icon: '📓', title: 'Daily Dev',           desc: '7+ journal entries',                      earned: journal.length >= 7 },
    { id: 'goal_done',    icon: '🎯', title: 'Goal Getter',         desc: 'Completed your first goal',               earned: goals.some((g) => g.status === 'done') },
    { id: 'job_offer',    icon: '💼', title: 'Offer Incoming',      desc: 'Got a job/internship offer',              earned: jobs.some((j) => j.status === 'offer') },
    { id: 'network10',    icon: '🤝', title: 'Networker',           desc: '10+ people in your directory',            earned: people.length >= 10 },
    { id: 'bookmark20',   icon: '🔖', title: 'Curator',             desc: '20+ bookmarks saved',                    earned: bookmarks.length >= 20 },
    { id: 'all_socials',  icon: '🌐', title: 'Fully Connected',     desc: '5+ social handles added',                earned: false },
    { id: 'skills10',     icon: '🧩', title: 'Stack Master',        desc: '10+ skills mapped',                       earned: false },
    { id: 'content5',     icon: '📣', title: 'Content Creator',     desc: '5+ content pieces published',            earned: false },
  ];

  const earnedCount = BADGES.filter((b) => b.earned).length;

  return (
    <div className="fade">
      <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)', marginBottom: 6 }}>Achievements & Badges</h2>
      <p style={{ color: 'var(--txt4)', fontSize: 11, marginBottom: 6 }}>{earnedCount}/{BADGES.length} earned</p>

      <div className="progress-bar" style={{ marginBottom: 24 }}>
        <div className="progress-fill" style={{ width: `${BADGES.length ? earnedCount / BADGES.length * 100 : 0}%`, background: 'linear-gradient(90deg,#f59e0b,#ef4444)' }} />
      </div>

      <div className="g3" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {BADGES.map((b) => (
          <div key={b.id} className="card" style={{ padding: 18, textAlign: 'center', opacity: b.earned ? 1 : 0.35, borderTop: b.earned ? '3px solid #f59e0b' : '3px solid var(--border)', transition: 'all .3s' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{b.icon}</div>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 12, marginBottom: 5, color: b.earned ? 'var(--txt)' : 'var(--txt4)' }}>{b.title}</div>
            <p style={{ fontSize: 10, color: 'var(--txt4)', lineHeight: 1.5 }}>{b.desc}</p>
            {b.earned && <div style={{ marginTop: 8, fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>✦ EARNED</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
