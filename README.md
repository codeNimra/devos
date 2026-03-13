# ⌘ DevOS — Personal Developer Command Center

<div align="center">

![DevOS Banner](https://img.shields.io/badge/DevOS-AI%20Powered-00d4ff?style=for-the-badge&logo=react&logoColor=white)
![Built with React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude-AI%20Coach-7c3aed?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)

**The all-in-one OS for developers who want to ship more, miss less, and grow faster.**

[🚀 Live Demo](https://codenimra.github.io/devos/)

</div>

---

## 🧠 What is DevOS?

DevOS is a personal developer dashboard that centralizes everything a developer needs to stay productive hackathons, jobs, learning goals, projects, journal, notes, and more all in one dark-themed command center with a built-in **AI Coach** that analyzes your data and tells you exactly what to focus on.

Built for developers who:
- Miss hackathon deadlines
- Lose track of job applications
- Forget what they planned to learn
- Want smart insights without switching between 10 tools

---

## ✨ Features

### 🏆 Work Tracking
| Feature | Description |
|---|---|
| **Hackathons** | Track deadlines with urgency colors — red if due today, amber if urgent |
| **Projects** | Link projects to hackathons, track build status and GitHub/demo links |
| **Jobs** | Full job application pipeline from wishlist → offer with deadline alerts |

### 📚 Learning & Skills
| Feature | Description |
|---|---|
| **Learning** | Schedule learning sessions with categories, durations, and status tracking |
| **Skills Map** | Visual skill levels (Beginner → Expert) across languages, frameworks, tools |
| **Bookmarks** | Save resources by category with tags and notes |

### 🧘 Personal Dev Life
| Feature | Description |
|---|---|
| **Dev Journal** | Daily logs with mood tracking (1–5 scale) and tags |
| **Goals** | Goal tracking with sub-tasks, progress bars, and deadlines |
| **Quick Notes** | Color-coded pinnable notes |
| **Pomodoro** | Built-in focus timer |

### 🌐 Network & Social
| Feature | Description |
|---|---|
| **Socials** | Track all your developer profiles in one place |
| **People** | CRM for mentors, teammates, recruiters you meet |
| **Content Calendar** | Plan blog posts, tweets, videos with scheduled dates |
| **Events** | Track conferences, meetups, hackathons with registration status |

### ✦ AI Coach (Smart Analysis)
The crown feature. The AI Coach analyzes your entire dev life — deadlines, goals, mood, skills, journal entries — and returns a personalized action plan instantly:

- **Productivity Score**: calculated from your real data
- **Priority Queue**: color-coded urgent items (red = today, amber = urgent, purple = follow up)
- **Smart Suggestions**: specific advice based on your actual hackathons, goals and mood
- **Mood Trend**: visual chart from your journal entries
- **Progress Breakdown**: learning, goals, and journal completion rates
- **Skill Distribution**: breakdown of your skills by category

### 💡 Daily Motivation
Every time you open the Dashboard, a fresh developer quote greets you — rotates daily, always relevant.

---

## 🏗 Architecture

![DevOS Architecture](docs/architecture.svg)

### Project Structure

```
devos/
├── index.html
├── package.json
├── vite.config.js
├── docs/
│   └── architecture.svg
└── src/
    ├── main.jsx                  # Entry point
    ├── App.jsx                   # Root state + routing
    ├── styles/
    │   └── globals.css           # CSS variables, dark/light themes, utility classes
    ├── constants/
    │   ├── nav.js                # Sidebar navigation structure
    │   ├── statuses.js           # All status enums + color maps
    │   └── platforms.js          # Social platform colors + icons
    ├── utils/
    │   ├── id.js                 # genId() unique ID generator
    │   ├── dates.js              # daysUntil, fmtDate, today, weekDay
    │   └── colors.js             # urgColorHex, urgLabel deadline urgency colors
    ├── hooks/
    │   └── useAlerts.js          # Auto-generates alerts for urgent deadlines
    ├── components/
    │   ├── index.js              # Barrel export
    │   ├── Modal.jsx             # Reusable modal overlay
    │   ├── Field.jsx             # Form field with label
    │   ├── Empty.jsx             # Empty state component
    │   └── ThemeToggle.jsx       # Dark/light switch
    ├── layout/
    │   ├── Sidebar.jsx           # Navigation sidebar
    │   ├── TopBar.jsx            # Header with tab title + controls
    │   └── AlertsStrip.jsx       # Dismissible alert bar
    └── pages/                    # 19 page components
        ├── AuthScreen.jsx
        ├── Dashboard.jsx         # ✦ Daily motivational quote
        ├── Hackathons.jsx
        ├── Projects.jsx
        ├── Jobs.jsx
        ├── Learning.jsx
        ├── Skills.jsx
        ├── Bookmarks.jsx
        ├── Journal.jsx
        ├── Goals.jsx
        ├── Notes.jsx
        ├── Pomodoro.jsx
        ├── Socials.jsx
        ├── People.jsx
        ├── ContentCalendar.jsx
        ├── Events.jsx
        ├── AIInsights.jsx        # ✦ Smart AI Coach (no API needed)
        ├── WeeklyStats.jsx
        ├── Achievements.jsx
        └── Profile.jsx
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/codeNimra/devos.git
cd devos

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` and log in with:
```
Email:    demo@dev.com
Password: demo123
```

### Build for Production

```bash
npm run build
```

---

## 🚀 Deploy to GitHub Pages

This project is live at [codenimra.github.io/devos](https://codenimra.github.io/devos/).

### Deploy your own fork

```bash
# Install gh-pages
npm install gh-pages --save-dev

# Build and deploy in one command
npm run deploy
```

Your site goes live at `https://<your-username>.github.io/devos` in ~2 minutes.

The `deploy` script builds the app and pushes `dist/` to the `gh-pages` branch automatically GitHub Pages serves from there.

---

## 🎨 Design System

| Token | Dark | Light |
|---|---|---|
| Background | `#070711` | `#f0f4f8` |
| Surface | `#0c0c1a` | `#ffffff` |
| Cyan Accent | `#00d4ff` | `#00d4ff` |
| Purple Accent | `#7c3aed` | `#7c3aed` |
| Text Primary | `#e2e8f0` | `#0f172a` |
| Font | Space Mono + Syne | Space Mono + Syne |

Themes switch via `data-theme` attribute on `<html>`  no flash, instant.

---

## 🤖 AI Coach - How It Works

```
User opens AI Coach page
         ↓
App analyzes: hackathons + goals + learnings
            + journal mood + skills + jobs
         ↓
Instant results no API call needed:
{
  productivity_score,
  priority_queue,
  smart_suggestions,
  mood_trend,
  progress_breakdown,
  skill_distribution
}
         ↓
UI renders personalized action plan
```

All analysis runs locally in the browser instant, private, no API key required.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Build Tool | Vite 5 |
| Styling | Pure CSS + CSS Variables (no Tailwind) |
| AI Analysis | Smart client-side logic + Anthropic Claude API ready |
| Fonts | Google Fonts Space Mono + Syne |
| State | React useState (no Redux, no localStorage) |
| Auth | Simulated local auth (demo mode) |
| Deploy | GitHub Pages |

---

## 📋 .gitignore

```
node_modules/
dist/
.env
.env.local
```

Everything else including `package-lock.json` is committed intentionally.

---

## 🏁 Built For

This project was built for the **Frostbyte Hackathon 2026** under the theme: *Business & Management Tools + AI/ML*.

---

## 📄 License

MIT free to use, fork, and build on.

---

<div align="center">
  Made with 🤖 + ☕ by a developer who kept missing deadlines
  <br/>
  <sub>Built with React · Smart AI Analysis · Hosted on GitHub Pages</sub>
</div>