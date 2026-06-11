# ✈️ Trip Expense Tracker

> A clean, multi-day trip expense tracker built with **React**. Works for any trip — just fill in your details and start tracking.

No backend. No account. Everything saved locally in your browser.

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/trip-expense-tracker.git

# 2. Install dependencies
cd trip-expense-tracker
npm install

# 3. Start the app
npm start
```

Opens at [http://localhost:3000](http://localhost:3000) — fill in your trip details and start tracking!

---

## ✨ Features

- **Setup screen** — enter trip name, destination, days, people, budget, hotel & flights on first launch
- **Day-by-day tracking** — add/edit/delete expenses per day with categories
- **Category tagging** — Food, Travel, Shopping, Entertainment, Medical, Bills, Other
- **Fixed costs** — hotel and flights tracked separately from daily spend
- **Budget progress bar** — visual indicator of how much of your budget is used
- **Smart versioning** — every change auto-bumps a version number with full audit log
- **Charts** — bar chart of daily spend across all days
- **Summary tab** — complete trip cost breakdown with percentage bars
- **Breakdown tab** — category-wise spend, per-person split, trip insights
- **Persistent storage** — saved to `localStorage`, survives browser refresh
- **Minimalist design** — clean sage-green theme, mobile-friendly

---

## 📸 App Flow

```
First launch → Setup Screen (enter trip details)
       ↓
Main Tracker (Daily View | Summary | Breakdown)
       ↓
"New Trip" button → reset and start fresh
```

---

## 🗂️ Project Structure

```
trip-expense-tracker/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx                    # Root + tab routing
│   ├── index.js / index.css
│   ├── constants.js               # Theme colors, categories
│   ├── data/                      # (empty — data comes from user setup)
│   ├── utils/
│   │   └── helpers.js             # fmt, computeTotal, bumpVersion, storage, buildInitialState
│   ├── hooks/
│   │   └── useExpenseTracker.js   # All state, CRUD, versioning
│   └── components/
│       ├── SetupScreen.jsx        # ← First-launch onboarding form
│       ├── Header.jsx
│       ├── VersionLog.jsx
│       ├── TripBanner.jsx
│       ├── FixedCosts.jsx
│       ├── TabBar.jsx
│       ├── DayTabs.jsx
│       ├── EntryTable.jsx
│       ├── SpendChart.jsx
│       ├── SummaryTab.jsx
│       └── BreakdownTab.jsx
├── .gitignore
├── package.json
└── README.md
```

---

## 🧠 Versioning System

Every change bumps the version:

```
v{currentDay}.{editCount}.{dayEdited}
```

| Action | Version |
|---|---|
| Trip created | `v1.0` |
| Add entry on Day 1 | `v1.1.1` |
| Move to Day 2 | `v2.0` |
| Edit entry on Day 2 | `v2.1.2` |
| On Day 3, edit Day 1 | `v3.1.1` |

Click the version badge (top right) to view full change history.

---

## 🛠️ Tech Stack

| | |
|---|---|
| React 18 | UI |
| Recharts | Bar charts |
| localStorage | Data persistence |
| Create React App | Build tooling |

---

## 🏗️ Deploy

```bash
npm run build
```

Deploy the `/build` folder to **Netlify**, **Vercel**, or **GitHub Pages** — it's a static app, no server needed.

---

## 📄 License

MIT — free to use, fork, and adapt for any trip!
