# Vegas App - AI Agent Guide

## Quick Project Overview
- Mobile-first web app for a 3-day Vegas trip (July 10-13)
- Built with Vue 3 + TypeScript + Vite
- Uses Pinia for state management
- PWA features implemented after core functionality
- Hosted on Vercel

## Key Technical Decisions
- No external UI libraries - custom mobile-first design
- Simple hamburger menu navigation
- All state managed in localStorage
- Simple file upload/download for state management
- No complex features - keep it simple and focused

## Important Notes
- Calendar is NOT a real calendar - it's just text output of events
- Maps are static images only - no interactivity
- No search/filter functionality
- No infinite scroll except for networking tips
- No analytics or performance monitoring
- No testing setup
- No complex error handling

## File Structure
- `/src` - Main source code
- `/data` - Static JSON and ICS files
- `/assets` - Static images (maps)
- `/public` - Public assets

## State Management
- All user state in localStorage
- Simple JSON import/export for state
- No server-side state

## Development Rules
- Keep it simple
- Mobile-first design
- No unnecessary features
- Focus on core functionality first
- PWA features come last 