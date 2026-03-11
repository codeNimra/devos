# ⌘ DevOS-Personal Developer Command Center

<div align="center">

![DevOS Banner](https://img.shields.io/badge/DevOS-AI%20Powered-00d4ff?style=for-the-badge&logo=react&logoColor=white)
![Built with React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude-AI%20Coach-7c3aed?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)

**The all-in-one OS for developers who want to ship more, miss less, and grow faster.**

[🚀 Live Demo](#) · [📖 Architecture](#architecture) · [⚡ Quick Start](#quick-start)

</div>

---

## 🧠 What is DevOS?

DevOS is a personal developer dashboard that centralizes everything a developer needs to stay productive — hackathons, jobs, learning goals, projects, journal, notes, and more — all in one dark-themed command center with a built-in **AI Coach** powered by Claude.

Built for developers who:
- Miss hackathon deadlines
- Lose track of job applications
- Forget what they planned to learn
- Want an AI that actually knows their situation

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

### ✦ AI Coach (Claude-Powered)
The crown feature. Click **Generate AI Insights** and Claude reads your entire dev life journal entries, deadlines, goals, skill gaps and returns a **personalized action plan**:

- **Headline**:  honest 1-line assessment of where you stand
- **Mood Pattern**: trend analysis from your journal
- **Today's Plan**: specific tasks ranked by urgency
- **Struggle Areas**:  skills/topics you seem to avoid
- **Hidden Insight**: non-obvious pattern Claude noticed
- **This Week's Milestone**: the single most important thing to do

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
    │   └── colors.js             # urgColorHex, urgLabel — deadline urgency colors
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
        ├── Dashboard.jsx
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
        ├── AIInsights.jsx        # ✦ Claude AI Coach
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

The `dist/` folder is ready to deploy anywhere.

---

## 🚀 Deploy to Netlify

### Option 1: Drag & Drop (fastest)
1. Run `npm run build`
2. Go to [netlify.com](https://devos.netlify.com) → **Add new site**
3. Drag the `dist/` folder into the deploy area
4. Done live in 30 seconds ⚡

### Option 2 — Connect GitHub (recommended)
1. Push this repo to GitHub
2. Go to Netlify → **Add new site → Import from Git**
3. Select your repo and set:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Every push to `main` auto-deploys

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

Themes switch via `data-theme` attribute on `<html>` — no flash, instant.

---

## 🤖 AI Coach - How It Works

```
User clicks "Generate AI Insights"
         ↓
App serializes: journal entries + hackathons + goals
              + skills + notes + jobs + learnings
         ↓
POST → api.anthropic.com/v1/messages
       model: claude-sonnet-4-20250514
       system: "You are a developer coach..."
         ↓
Claude returns structured JSON:
{
  headline, mood_pattern, struggle_areas,
  coach_message, today_plan, hidden_insight,
  next_milestone
}
         ↓
UI renders personalized action plan
```

> **Note:** The API key is sent from the browser. Fine for personal use don't share your deployed URL publicly with your key in it.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Build Tool | Vite 5 |
| Styling | Pure CSS + CSS Variables (no Tailwind) |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Fonts | Google Fonts + Space Mono + Syne |
| State | React useState (no Redux, no localStorage) |
| Auth | Simulated local auth (demo mode) |
| Deploy | Netlify |

---

## 📋 .gitignore

```
node_modules/
dist/
.env
.env.local
```

Everything else including `package-lock.json` — is committed intentionally.

---

## 🏁 Built For

This project was built for the **Frostbyte Hackathon** (March 2025) under the theme: *Business & Management Tools + AI/ML*.

---

## 📄 License

MIT free to use, fork, and build on.

---

<div align="center">
  Made with 🤖 + ☕ by a developer who kept missing deadlines
</div>