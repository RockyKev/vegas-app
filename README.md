# Vegas App (Disposable, Offline-First)

## 📌 Overview

A minimalist, mobile-friendly web app to organize a 3-day work trip to Vegas (July 10–13). Written with AI.

- Works offline (optional PWA)
- Designed for personal use, but can be shared
- Uses checkboxes and JSON-driven content
- UI state saved in `localStorage`
- Manual import/export of UI state as JSON file

## 🛠 Technical Stack

- Vue 3 + TypeScript + Vite
- Pinia for state management
- Mobile-first design with hamburger menu
- PWA features (implemented after core functionality)
- Hosted on Vercel

## 📁 File Structure

vegas-app/
├── src/ # Main source code
│   ├── components/ # Vue components
│   ├── stores/ # Pinia stores
│   ├── types/ # TypeScript interfaces
│   ├── views/ # Page components
│   └── App.vue # Root component
├── data/ # Read-only inputs
│   ├── calendar.ics
│   ├── contacts.json
│   ├── networking_tips.json
│   └── people_to_meet.json
├── assets/ # Static assets
│   ├── airport_map.jpg
│   └── vegas_map.jpg
├── public/ # Public assets
├── manifest.json # PWA manifest
├── service-worker.js # Offline cache logic
└── README.md # Project specs

---

## 🧩 Modules

### 🏠 1. Home Screen
- Dynamic content based on date:
  - **Before July 10**: show checklist + networking prep tips
  - **July 10–13**: show agenda, checklist, daily tip, shortcuts
  - **After July 13**: prompt for follow-ups + recap
- Renders a "daily dashboard" view

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
- Initialize Vue 3 + TypeScript project
- Set up Pinia store
- Create mobile-first layout
- Implement basic routing

### ✅ Version 0.2: Features
- Implement all core features
- Add state management
- Create import/export functionality

### ✅ Version 0.3: PWA
- Add service worker
- Implement offline caching
- Create PWA manifest

## ⚠️ Rules to Follow
- Keep it simple - no unnecessary features
- Mobile-first design
- All state in localStorage
- No server-side logic
- No complex UI libraries
- No search/filter functionality
- No map interactivity
- No infinite scroll (except networking tips)

## 🔄 State Management
All app state saved to localStorage:
- Tips read/favorite status
- Calendar completion status
- Networking target status
- User preferences

Export/Import:
- Simple file upload/download
- Basic JSON validation
- No complex migration needed

## 📱 Mobile Design
- Hamburger menu navigation
- List-based layouts
- Simple text-based calendar
- Static map images
- No complex interactions

## 🚀 Deployment
- Hosted on Vercel
- Automatic deployments
- No complex CI/CD needed

## 🤝 License
MIT – disposable app, feel free to reuse or throw away.
