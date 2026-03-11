import { useState, useEffect }   from 'react';

// Layout
import Sidebar     from './layout/Sidebar.jsx';
import TopBar      from './layout/TopBar.jsx';
import AlertsStrip from './layout/AlertsStrip.jsx';

// Pages
import AuthScreen     from './pages/AuthScreen.jsx';
import Dashboard      from './pages/Dashboard.jsx';
import Hackathons     from './pages/Hackathons.jsx';
import Projects       from './pages/Projects.jsx';
import Jobs           from './pages/Jobs.jsx';
import Learning       from './pages/Learning.jsx';
import Skills         from './pages/Skills.jsx';
import Bookmarks      from './pages/Bookmarks.jsx';
import Journal        from './pages/Journal.jsx';
import Goals          from './pages/Goals.jsx';
import Notes          from './pages/Notes.jsx';
import Pomodoro       from './pages/Pomodoro.jsx';
import Socials        from './pages/Socials.jsx';
import People         from './pages/People.jsx';
import ContentCalendar from './pages/ContentCalendar.jsx';
import Events         from './pages/Events.jsx';
import AIInsights     from './pages/AIInsights.jsx';
import WeeklyStats    from './pages/WeeklyStats.jsx';
import Achievements   from './pages/Achievements.jsx';
import Profile        from './pages/Profile.jsx';

// Hooks & utils
import { useAlerts }  from './hooks/useAlerts.js';
import { today, weekDay } from './utils/dates.js';
import { genId }      from './utils/id.js';

export default function App() {
  const [user,        setUser]        = useState(null);
  const [tab,         setTab]         = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark,      setIsDark]      = useState(true);

  /* ── DATA STATE ── */
  const [hackathons, setHackathons] = useState([
    { id: genId(), name: 'ETHGlobal Bangkok', platform: 'ETHGlobal', deadline: weekDay(2),  link: '', prize: '$50,000',    status: 'registered', notes: 'Build a DeFi project' },
    { id: genId(), name: 'NASA Space Apps',   platform: 'NASA',      deadline: weekDay(10), link: '', prize: 'Recognition', status: 'interested', notes: '' },
  ]);

  const [learnings, setLearnings] = useState([
    { id: genId(), topic: 'Solidity Smart Contracts', category: 'Blockchain',     date: weekDay(1),  duration: '3 hrs',   resource: '', status: 'pending', notes: '' },
    { id: genId(), topic: 'System Design Basics',      category: 'System Design', date: weekDay(5),  duration: '2 hrs',   resource: '', status: 'pending', notes: '' },
    { id: genId(), topic: 'React Query Patterns',      category: 'Frontend',      date: today(),     duration: '1.5 hrs', resource: '', status: 'done',    notes: '' },
  ]);

  const [projects, setProjects] = useState([
    { id: genId(), name: 'EcoTrack AI', hackathonId: '', stack: 'React, Python, TensorFlow', github: '', demo: '', status: 'building', description: 'AI carbon footprint tracker' },
  ]);

  const [jobs, setJobs] = useState([
    { id: genId(), company: 'Vercel', role: 'Frontend Engineer', status: 'applied', deadline: weekDay(5), link: '', salary: '$120k', notes: 'Applied via LinkedIn' },
  ]);

  const [skills, setSkills] = useState([
    { id: genId(), name: 'React',    category: 'Framework', level: 4, yearsExp: '3',   note: '' },
    { id: genId(), name: 'Python',   category: 'Language',  level: 3, yearsExp: '2',   note: '' },
    { id: genId(), name: 'Node.js',  category: 'Framework', level: 3, yearsExp: '2',   note: '' },
    { id: genId(), name: 'Solidity', category: 'Language',  level: 2, yearsExp: '0.5', note: '' },
  ]);

  const [bookmarks, setBookmarks] = useState([
    { id: genId(), title: 'React Official Docs', url: 'https://react.dev', category: 'Docs', tags: 'react,frontend', note: '', saved: today() },
  ]);

  const [journal, setJournal] = useState([
    { id: genId(), date: today(), mood: 4, title: 'Shipped the first hackathon project!', content: 'Finally got the MVP working. The AI integration took longer than expected but it\'s working. Need to polish the UI tomorrow before submission.', tags: 'hackathon,win' },
  ]);

  const [goals, setGoals] = useState([
    { id: genId(), title: 'Win a hackathon this quarter', category: 'Career', deadline: weekDay(30), status: 'active', tasks: [
      { id: genId(), text: 'Register for 3 hackathons', done: true  },
      { id: genId(), text: 'Build a complete project',  done: false },
      { id: genId(), text: 'Submit before deadline',    done: false },
    ]},
  ]);

  const [notes, setNotes] = useState([
    { id: genId(), title: 'Hackathon Checklist', content: '[ ] README\n[ ] Deploy\n[ ] Demo video\n[ ] Devpost submission', color: '#00d4ff', pinned: true, created: today() },
  ]);

  const [socials, setSocials] = useState([
    { id: genId(), platform: 'github',  handle: '@yourhandle', url: 'https://github.com',  followers: '200', bio: 'Open source contributor' },
    { id: genId(), platform: 'twitter', handle: '@devhandle',  url: 'https://twitter.com', followers: '500', bio: 'Tweeting about dev life' },
  ]);

  const [people, setPeople] = useState([
    { id: genId(), name: 'Alex Chen', role: 'Mentor', handle: '@alexchen', platform: 'twitter', metAt: 'ETHGlobal', note: 'Amazing Solidity mentor' },
  ]);

  const [content, setContent] = useState([
    { id: genId(), title: 'How I almost missed my hackathon deadline', type: 'Blog Post', platform: 'Dev.to', scheduledDate: weekDay(7), status: 'drafting', topic: 'Time management for developers', link: '' },
  ]);

  const [events, setEvents] = useState([
    { id: genId(), name: 'React Summit 2025', type: 'conference', date: weekDay(14), location: 'Online', link: '', price: 'Free', registered: false, notes: '' },
  ]);

  /* ── ALERTS ── */
  const { alerts, dismiss } = useAlerts(hackathons, learnings, events, user);

  /* ── APPLY THEME ── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  /* ── ALL DATA bundle passed to pages that need it ── */
  const allData = { hackathons, learnings, projects, jobs, goals, journal, events, bookmarks, people, socials, skills, notes, content };

  /* ── RENDER TAB ── */
  const renderTab = () => {
    switch (tab) {
      case 'dashboard':    return <Dashboard      data={allData} />;
      case 'hackathons':   return <Hackathons     data={hackathons}  setData={setHackathons} />;
      case 'projects':     return <Projects       data={projects}    setData={setProjects}   hackathons={hackathons} />;
      case 'jobs':         return <Jobs           data={jobs}        setData={setJobs} />;
      case 'learning':     return <Learning       data={learnings}   setData={setLearnings} />;
      case 'skills':       return <Skills         data={skills}      setData={setSkills} />;
      case 'bookmarks':    return <Bookmarks      data={bookmarks}   setData={setBookmarks} />;
      case 'journal':      return <Journal        data={journal}     setData={setJournal} />;
      case 'goals':        return <Goals          data={goals}       setData={setGoals} />;
      case 'notes':        return <Notes          data={notes}       setData={setNotes} />;
      case 'pomodoro':     return <Pomodoro />;
      case 'socials':      return <Socials        data={socials}     setData={setSocials} />;
      case 'people':       return <People         data={people}      setData={setPeople} />;
      case 'content':      return <ContentCalendar data={content}    setData={setContent} />;
      case 'events':       return <Events         data={events}      setData={setEvents} />;
      case 'ai':           return <AIInsights     data={allData}     user={user} />;
      case 'stats':        return <WeeklyStats    hackathons={hackathons} learnings={learnings} projects={projects} journal={journal} goals={goals} />;
      case 'achievements': return <Achievements   hackathons={hackathons} learnings={learnings} projects={projects} jobs={jobs} journal={journal} goals={goals} bookmarks={bookmarks} people={people} />;
      case 'profile':      return <Profile        user={user} setUser={setUser} hackathons={hackathons} socials={socials} projects={projects} />;
      default:             return null;
    }
  };

  /* ── AUTH WALL ── */
  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  /* ── MAIN SHELL ── */
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)', color: 'var(--txt)', transition: 'background .25s, color .25s' }}>

      <Sidebar
        open={sidebarOpen}
        tab={tab}
        onTabChange={setTab}
        alerts={alerts}
        user={user}
        onLogout={() => setUser(null)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar
          tab={tab}
          alerts={alerts}
          isDark={isDark}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          onToggleTheme={() => setIsDark((d) => !d)}
        />

        <AlertsStrip alerts={alerts} onDismiss={dismiss} />

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 48px' }}>
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
