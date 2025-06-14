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
- [ ] Add maskable icons for better Android support
- [ ] Add splash screen images for iOS
- [ ] Add theme color meta tags

### 3. Service Worker & Caching
- [ ] Implement offline fallback page (simple "You're offline" message)
- [ ] Cache static assets (images, CSS, JS)
- [ ] Cache imported files (JSON/ICS, with 2MB size limit)
- [ ] Add error handling for:
  - [ ] File size limits (2MB)
  - [ ] Storage quota exceeded
  - [ ] Invalid file formats
  - [ ] Failed imports when offline

### 4. Offline Functionality
- [ ] Add offline detection
- [ ] Add offline indicator UI (non-intrusive)
- [ ] Add offline fallback content for:
  - [ ] Home screen
  - [ ] Networking tips
  - [ ] Calendar
  - [ ] Contacts
  - [ ] Networking targets
- [ ] Add storage usage indicator (optional)

### 5. Installation Experience
- [ ] Add install prompt UI
- [ ] Add "Add to Home Screen" instructions
- [ ] Test installation on different devices
- [ ] Add installation success feedback

### 6. Testing & Validation
- [ ] Test on Chrome desktop
- [ ] Test on Android devices
- [ ] Test on iOS devices
- [ ] Validate PWA requirements
- [ ] Test offline functionality
- [ ] Test file imports in offline mode
- [ ] Test localStorage persistence

## Phase 6: Polish
- [ ] Rename "Networking Targets" to "Networking"
- [ ] Rename "Networking tips" to "social tips"
- [ ] Make sure that imports, if it doesn't match the right shape, does get a error warning.
- [ ] Add a tab to explain how to use it, and that tab can be minimized.
- [ ] Make it more like a app. So menu on the bottom.
- [ ] Create a mode where if default mode is on, it uses all the default data + import data. Else, it's blank and only relies on import data.
- [ ] There's a src/style.css, a src/assets/main.css, and styling in the app.vue
- [ ] Deployment 