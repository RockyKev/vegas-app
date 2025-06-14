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
- [ ] Home Screen
  - [ ] Pull data from data/home_todo.json
  - [ ] Date-aware content based on data/home_todo.json
  - [ ] Dynamic checklist
- [ ] Networking Tips
  - [ ] List view with infinite scroll
  - [ ] I can import my own tips in the json format, and it follows the shape of networking_tips.json
  - [ ] The tips I imported are saved in localStorage in "custom_data > networking_tips" 
  - [ ] Both custom data tips and the default networking_tips.json are showing.
- [ ] Calendar
  - [ ] I can import a ics file
  - [ ] ICS file parsing
  - [ ] The ICS event I imported are saved in localStorage in "custom_data > calendar" 
  - [ ] Check-off functionality
- [ ] Contacts
  - [ ] I can import my own contacts in the json format, and it follows the shape of contacts.json
  - [ ] The contacts I imported are saved in localStorage in "custom_data > contacts" 
- [ ] Networking Targets
  - [ ] I can import my own networking targets in the json format, and it follows the shape of networking_targets.json
  - [ ] The contacts I imported are saved in localStorage in "custom_data > networking" 


## Phase 5: PWA Features
- [ ] Service Worker implementation
  - [ ] Cache user state
  - [ ] Cache uploaded files
- [ ] PWA manifest
- [ ] Install prompt
- [ ] Offline functionality

## Phase 6: Polish
- [ ] Mobile UI refinements
- [ ] Basic error handling
- [ ] Loading states
- [ ] Final testing
- [ ] Deployment 