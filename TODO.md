# Vegas App - Implementation TODO

## Phase 1: Project Setup
- [x] Initialize Vue 3 + TypeScript project with Vite
  - [x] Set up strict TypeScript configuration
  - [x] Configure Pinia store
  - [x] Set up basic routing
- [x] Configure Vercel deployment
  - [x] Set up Vercel project
  - [x] Configure build settings
  - [x] Set up environment variables
- [x] Set up basic error logging
  - [x] Add error boundary component
  - [x] Implement console logging
  - [x] Add error state to store

## Phase 2: Core Structure
- [x] Create mobile-first layout
  - [x] Implement hamburger menu
  - [x] Set up responsive container
- [ ] Set up main routes:
  - [x] Home Screen
  - [x] Networking Tips
  - [x] Calendar
  - [x] Travel Info
  - [x] Contacts
  - [x] Networking Targets

## Phase 3: Data Management
- [x] Create TypeScript interfaces
  - [x] Contacts interface
  - [x] Networking Tips interface
  - [x] Calendar Events interface
  - [x] Networking Targets interface
- [x] Implement localStorage state management
  - [x] Tips read/favorite state
  - [x] Calendar completion state
  - [x] Networking target status
- [x] Create state import/export functionality
  - [x] Simple file upload/download
  - [x] Basic JSON validation

## Phase 4: Core Features
- [x] Home Screen
  - [x] Pull data from data/home_todo.json
  - [x] Date-aware content based on data/home_todo.json
  - [x] Dynamic checklist
- [x] Networking Tips
  - [x] List view with infinite scroll
  - [x] I can import my own tips in the json format, and it follows the shape of networking_tips.json
  - [x] The tips I imported are saved in localStorage in "customData > networkingTips" 
  - [x] Both custom data tips and the default networking_tips.json are showing.
- [x] Calendar
  - [x] I can import a ics file
  - [x] ICS file parsing
  - [x] The ICS event I imported are saved in localStorage in "customData > calendar" 
  - [x] Check-off functionality
- [x] Contacts
  - [x] I can import my own contacts in the json format, and it follows the shape of contacts.json
  - [x] The contacts I imported are saved in localStorage in "customData > contacts" 
- [x] Networking Targets
  - [x] I can import my own networking targets in the json format, and it follows the shape of networking_targets.json
  - [x] The contacts I imported are saved in localStorage in "customData > networking" 

## Phase 5: PWA Features
### 1. Basic PWA Setup
- [x] Install vite-plugin-pwa
- [x] Configure PWA plugin in vite.config.ts
- [x] Set up basic caching strategies

### 2. PWA Manifest & Icons
- [x] Configure basic manifest (name, description, colors)
- [x] Add PWA icons (192x192, 512x512)
- [x] Add maskable icons for better Android support
- [x] Add theme color meta tags

### 3. Service Worker & Caching
- [x] Implement offline fallback page (simple "You're offline" message)
- [x] Cache static assets (images, CSS, JS)
- [x] Cache imported files (JSON/ICS, with 2MB size limit)
- [x] Add error handling for:
  - [x] File size limits (2MB)
  - [x] Storage quota exceeded
  - [x] Invalid file formats
  - [x] Failed imports when offline

### 4. Offline Functionality
- [x] Add offline detection
- [x] Add offline indicator UI (non-intrusive)
- [x] Add offline fallback content for:
  - [x] Home screen
  - [x] Networking tips
  - [x] Calendar
  - [x] Contacts
  - [x] Networking targets
- [x] Add storage usage indicator in footer

### 5. Installation Experience
- [x] Add install prompt UI
- [x] Add "Add to Home Screen" instructions
- [x] Test installation on different devices
- [x] Add installation success feedback

### 6. Testing & Validation
- [x] Test on Chrome desktop
- [x] Test on Android devices
- [x] Test on iOS devices
- [x] Validate PWA requirements
- [x] Test offline functionality
- [x] Test file imports in offline mode
- [x] Test localStorage persistence

## Phase 6: Polish
- [x] Rename "Networking Targets" to "Networking"
- [x] Rename "Networking tips" to "social tips"
- [x] Make sure that imports, if it doesn't match the right shape, does get a error warning.
- [x] Add a tab to explain how to use it, and that tab can be minimized.
- [x] Make it more like a app. So menu on the bottom.
- [x] Create a mode where if default mode is on, it uses all the default data + import data. Else, it's blank and only relies on import data.
- [x] Add github link, and how to fix issues.
- [ ] Deployment 
- [ ] Improve UI Experience (needs notes here)