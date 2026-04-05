export const HACK_STATUS = {
  interested: { label: 'Interested', color: '#3b82f6' },
  registered: { label: 'Registered', color: '#8b5cf6' },
  ongoing:    { label: 'Ongoing',    color: '#f59e0b' },
  submitted:  { label: 'Submitted',  color: '#10b981' },
  missed:     { label: 'Missed',     color: '#ef4444' },
};

export const PROJ_STATUS = {
  planning:  { label: 'Planning',  color: '#64748b' },
  building:  { label: 'Building',  color: '#3b82f6' },
  submitted: { label: 'Submitted', color: '#8b5cf6' },
  done:      { label: 'Done',      color: '#10b981' },
  paused:    { label: 'Paused',    color: '#f59e0b' },
};

export const JOB_STATUS = {
  wishlist:     { label: 'Wishlist',     color: '#64748b' },
  applied:      { label: 'Applied',      color: '#3b82f6' },
  interviewing: { label: 'Interviewing', color: '#f59e0b' },
  offer:        { label: 'Offer',        color: '#10b981' },
  rejected:     { label: 'Rejected',     color: '#ef4444' },
  ghosted:      { label: 'Ghosted',      color: '#334155' },
};

export const CONTENT_STATUS = {
  idea:      { label: 'Idea',      color: '#64748b' },
  drafting:  { label: 'Drafting',  color: '#3b82f6' },
  scheduled: { label: 'Scheduled', color: '#f59e0b' },
  published: { label: 'Published', color: '#10b981' },
};

export const EVENT_TYPES = {
  hackathon:   { label: 'Hackathon',   color: '#00d4ff', icon: '🏆' },
  meetup:      { label: 'Meetup',      color: '#10b981', icon: '🤝' },
  conference:  { label: 'Conference',  color: '#7c3aed', icon: '🎤' },
  workshop:    { label: 'Workshop',    color: '#f59e0b', icon: '🛠' },
  webinar:     { label: 'Webinar',     color: '#3b82f6', icon: '💻' },
  appointment: { label: 'Appointment', color: '#f43f5e', icon: '🏥' },
  family:      { label: 'Family',      color: '#10b981', icon: '👨‍👩‍👧' },
  other:       { label: 'Other',       color: '#64748b', icon: '📅' },
};

export const SKILL_LEVELS = [
  { label: 'Beginner',   color: '#ef4444', val: 1 },
  { label: 'Familiar',   color: '#f59e0b', val: 2 },
  { label: 'Proficient', color: '#3b82f6', val: 3 },
  { label: 'Advanced',   color: '#8b5cf6', val: 4 },
  { label: 'Expert',     color: '#10b981', val: 5 },
];

/* ── UNIVERSAL SKILL CATEGORIES — works for any field ── */
export const SKILL_CATS = [
  /* Tech */
  'Programming', 'Framework/Library', 'Database', 'DevOps/Cloud', 'AI/ML', 'Tools & Software',
  /* Medical & Health */
  'Clinical/Medical', 'Healthcare', 'Research',
  /* Creative & Design */
  'Design', 'Creative Arts', 'Writing',
  /* Business & Management */
  'Management', 'Finance & Accounting', 'Marketing', 'Sales',
  /* Personal & Soft */
  'Language', 'Communication', 'Leadership',
  /* Other */
  'Other',
];

export const LEARN_CATS   = [
  'Technology', 'Medicine & Health', 'Business', 'Design & Art',
  'Science', 'Language', 'Finance', 'Personal Development',
  'Engineering', 'Law', 'Education', 'Other',
];

export const CONTENT_TYPES = ['Blog Post', 'Tweet Thread', 'LinkedIn Post', 'YouTube Video', 'Dev.to Article', 'Tutorial', 'Newsletter', 'Other'];
export const NOTE_COLORS   = ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#f43f5e', '#06b6d4'];

export const CAT_COLORS = {
  'Programming':        '#00d4ff',
  'Framework/Library':  '#7c3aed',
  'Database':           '#f59e0b',
  'DevOps/Cloud':       '#3b82f6',
  'AI/ML':              '#10b981',
  'Tools & Software':   '#06b6d4',
  'Clinical/Medical':   '#ef4444',
  'Healthcare':         '#f43f5e',
  'Research':           '#8b5cf6',
  'Design':             '#f59e0b',
  'Creative Arts':      '#7c3aed',
  'Writing':            '#10b981',
  'Management':         '#3b82f6',
  'Finance & Accounting':'#f59e0b',
  'Marketing':          '#00d4ff',
  'Sales':              '#10b981',
  'Language':           '#8b5cf6',
  'Communication':      '#06b6d4',
  'Leadership':         '#f43f5e',
  'Other':              '#64748b',
};

export const ROLE_COLORS = {
  Mentor:       '#00d4ff',
  Teammate:     '#10b981',
  Friend:       '#f59e0b',
  Recruiter:    '#8b5cf6',
  Collaborator: '#3b82f6',
  Doctor:       '#ef4444',
  Teacher:      '#f43f5e',
  Other:        '#64748b',
};

export const MOODS = [
  { val: 1, icon: '😞', label: 'Rough' },
  { val: 2, icon: '😐', label: 'Meh'   },
  { val: 3, icon: '🙂', label: 'Okay'  },
  { val: 4, icon: '😊', label: 'Good'  },
  { val: 5, icon: '🚀', label: 'Epic'  },
];

export const BM_COLORS = {
  Tutorial: '#00d4ff',
  Docs:     '#3b82f6',
  Article:  '#8b5cf6',
  Video:    '#ef4444',
  Tool:     '#10b981',
  Course:   '#f59e0b',
  Book:     '#f43f5e',
  Other:    '#64748b',
};