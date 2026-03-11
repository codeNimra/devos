import { daysUntil }   from '../utils/dates.js';
import { weekDay }     from '../utils/dates.js';
import { HACK_STATUS } from '../constants/statuses.js';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WeeklyStats({ hackathons, learnings, projects, journal, goals }) {
  const weekDates   = Array.from({ length: 7 }, (_, i) => weekDay(i - 6));
  const journalByDay = weekDates.map((d) => journal.filter((e) => e.date === d).length);
  const learnByDay   = weekDates.map((d) => learnings.filter((l) => l.date === d).length);
  const maxJ         = Math.max(...journalByDay, 1);
  const maxL         = Math.max(...learnByDay, 1);

  const urgentH    = hackathons.filter((h) => { const d = daysUntil(h.deadline); return d !== null && d >= 0 && d <= 7 && h.status !== 'submitted'; });
  const doneGoals  = goals.filter((g) => g.status === 'done').length;

  const WEEK_STATS = [
    { label: 'Topics Scheduled', value: learnings.filter((l) => weekDates.includes(l.date)).length, color: '#00d4ff', icon: '📚' },
    { label: 'Journal Entries',  value: journal.filter((e) => weekDates.includes(e.date)).length,   color: '#7c3aed', icon: '📓' },
    { label: 'Goals Completed',  value: doneGoals,                                                    color: '#10b981', icon: '🎯' },
    { label: 'Urgent Deadlines', value: urgentH.length,                                               color: '#ef4444', icon: '⚡' },
  ];

  const BarChart = ({ data, max, color }) => (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: '100%', background: v > 0 ? color + '33' : 'var(--border)', borderRadius: 3, height: `${(v / max) * 70 + 10}px`, border: v > 0 ? `1px solid ${color}44` : 'none', transition: 'height .3s', position: 'relative', minHeight: 10 }}>
            {v > 0 && <div style={{ position: 'absolute', top: -18, width: '100%', textAlign: 'center', fontSize: 9, color, fontWeight: 700 }}>{v}</div>}
          </div>
          <span style={{ fontSize: 8, color: 'var(--txt5)' }}>{DAY_LABELS[i]}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fade">
      <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--txt)', marginBottom: 6 }}>Weekly Stats</h2>
      <p style={{ color: 'var(--txt4)', fontSize: 11, marginBottom: 22 }}>Your activity over the last 7 days.</p>

      {/* Summary cards */}
      <div className="g4" style={{ marginBottom: 24 }}>
        {WEEK_STATS.map((s) => (
          <div key={s.label} className="card" style={{ padding: 18, borderLeft: `3px solid ${s.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'var(--txt3)', marginTop: 3 }}>{s.label}</div>
              </div>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar charts */}
      <div className="g2">
        <div className="card" style={{ padding: 20 }}>
          <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 12, marginBottom: 16, color: 'var(--txt3)', letterSpacing: 1 }}>📚 LEARNING ACTIVITY</h4>
          <BarChart data={learnByDay}   max={maxL} color="#00d4ff" />
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 12, marginBottom: 16, color: 'var(--txt3)', letterSpacing: 1 }}>📓 JOURNAL ACTIVITY</h4>
          <BarChart data={journalByDay} max={maxJ} color="#7c3aed" />
        </div>
      </div>

      {/* Hackathon breakdown */}
      <div className="card" style={{ padding: 20, marginTop: 16 }}>
        <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 12, marginBottom: 16, color: 'var(--txt3)', letterSpacing: 1 }}>🏆 HACKATHON BREAKDOWN</h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(HACK_STATUS).map(([k, v]) => {
            const count = hackathons.filter((h) => h.status === k).length;
            return count > 0 && (
              <div key={k} style={{ flex: 1, minWidth: 80, padding: '12px 14px', background: v.color + '12', border: `1px solid ${v.color}30`, borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: v.color }}>{count}</div>
                <div style={{ fontSize: 10, color: 'var(--txt4)', marginTop: 2 }}>{v.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
