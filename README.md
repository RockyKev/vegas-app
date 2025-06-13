# Vegas App (Disposable, Offline-First)

## 📌 Overview

A minimalist, mobile-friendly web app to organize a 3-day work trip to Vegas (July 10–13).

- Works offline (optional PWA)
- Designed for personal use, but can be shared
- Uses checkboxes and JSON-driven content
- UI state saved in `localStorage`
- Manual import/export of UI state as JSON file

---

## 📁 File Structure

vegas-app/
├── index.html # App entry point
├── styles.css # Mobile-friendly styles
├── app.js # Core logic & localStorage state handling
├── data/ # Read-only inputs
│ ├── calendar.ics
│ ├── contacts.json
│ ├── networking_tips.json
│ └── people_to_meet.json
├── state/
│ └── saved_state.json # Optional export/import of app state
├── assets/
│ ├── airport_map.jpg
│ └── vegas_map.jpg
├── manifest.json # (optional) PWA manifest
├── service-worker.js # (optional) Offline cache logic
└── README.md # Project specs (this file)


---

## 🧩 Modules

### 🏠 1. Home Screen
- Dynamic content based on date:
  - **Before July 10**: show checklist + networking prep tips
  - **July 10–13**: show agenda, checklist, daily tip, shortcuts
  - **After July 13**: prompt for follow-ups + recap
- Renders a “daily dashboard” view

---

### 💬 2. Networking Tips
- Source: `data/networking_tips.json`
- Display one tip per day or let user browse
- Features:
  - ✅ Mark as read
  - ⭐ Mark as favorite
- State saved in `localStorage`:
  - `tips_read`: `{ [tip_id]: true }`
  - `tips_starred`: `{ [tip_id]: true }`

---

### 📅 3. Calendar
- Upload or bundle `.ics` calendar file
- Parse and display events by date
- Tap to cross out (mark as "done")
- No UI editing of event details
- State saved in `localStorage`:
  - `calendar_done`: `{ [event_uid]: true }`

---

### 🌍 4. Travel Info
- Static display of:
  - Airport map (`assets/airport_map.jpg`)
  - Vegas map (`assets/vegas_map.jpg`)
  - Optional notes in HTML

---

### 📇 5. Contacts (People I Know)
- Source: `data/contacts.json`
- Display:
  - Name, job title
  - `mailto:` and `tel:` links
  - Optional notes
- No editing via UI

---

### 🧠 6. Networking Targets
- Source: `data/people_to_meet.json`

Example format:
```json
{
  "name": "Jane Smith",
  "title": "Design Lead at GlowCo",
  "details": "Spoke at FigmaConf. Into creative tooling.",
  "questions": [
    "Ask about remote design ops",
    "Mention your mentorship series"
  ],
  "status": "not-met"
}
```
UI:

Show name, title, details, questions

Let user mark status: not-met, connected, followed-up

Save to localStorage: people_status: { [person_id]: "connected" }

## 🔁 Import/Export State
All app state (read tips, checklist, favorites, etc.) saved to localStorage

Export state:

Serialize key data and download as saved_state.json

Import state:

Upload file and rehydrate UI state
```json 
{
  "tips_read": { "tip1": true },
  "tips_starred": { "tip2": true },
  "calendar_done": { "event123": true },
  "people_status": { "jane_smith": "connected" }
}
```

## 🚧 Build Roadmap
### ✅ Version 0.1: Core Setup
 Scaffold file structure
 Set up index.html with shell layout and nav
 Load + display networking tips
 Add read/fav buttons using localStorage

### ✅ Version 0.2: Features
 Parse .ics and display today’s events
 Add check-off calendar UI
 Build home screen with date awareness (pre/during/post)
 Load and render networking targets
 Load and render known contacts

## ✅ Final Polish (Optional)
 Export/import state as JSON

 Add Service Worker for offline caching

 Create PWA manifest and install prompt

 Host on Netlify, GitHub Pages, or ZIP it

## ⚠️ Rules to Follow
Do not mutate .json or .ics files—read-only only

All editable state = in localStorage

All logic should degrade gracefully offline

Do not use server-side logic or databases

Avoid hallucinating new modules—only build what's above

## ✅ Cursor IDE Guidance
Only work with index.html, app.js, and data inside /data

Treat README.md as source of truth

Use only static data files unless user asks to add more

State should always be saved and retrieved from localStorage

## 🤝 License
MIT – disposable app, feel free to reuse or throw away.
