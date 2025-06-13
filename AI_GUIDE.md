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

## AI Development Guide

### Project Overview
This is a Vue.js application for managing networking targets and contacts. The application uses a modern tech stack including Vue 3, TypeScript, and Vite.

### Key Components and Features

#### Networking Targets
- Located in `src/views/NetworkingTargetsView.vue`
- Displays a list of networking targets with their details
- Features:
  - Status tracking (Not Met → Connected → Followed Up)
  - Detailed information display including connections, personal details, work details, and questions
  - Clean, modern UI with responsive design
  - Status toggle functionality

### UI/UX Guidelines
1. **Card Design**
   - Use slim, clean cards with subtle shadows
   - Maintain consistent padding and spacing
   - Use a white background with light borders
   - Implement responsive design for all screen sizes

2. **Typography**
   - Use clear hierarchy with distinct heading sizes
   - Maintain consistent font sizes across components
   - Use appropriate color contrast for readability
   - Implement responsive font sizes for different screen sizes

3. **Status Indicators**
   - Use color-coded status buttons
   - Implement clear status transitions
   - Maintain consistent button styling
   - Use appropriate color contrast for accessibility

4. **Layout Best Practices**
   - Use flexbox for layout management
   - Implement consistent spacing using gap properties
   - Group related information logically
   - Use conditional rendering for optional content

### State Management
- Use Pinia for state management
- Implement status updates through the store
- Maintain local state for UI components
- Handle data fetching in component lifecycle hooks

### Data Fetching
- Fetch data from JSON files in the public directory
- Implement error handling for failed requests
- Use async/await for data operations
- Handle loading states appropriately

### Component Structure
1. **Template Organization**
   - Group related elements logically
   - Use semantic HTML elements
   - Implement conditional rendering for optional content
   - Maintain clean, readable markup

2. **Script Organization**
   - Define interfaces at the top
   - Group related functions together
   - Use TypeScript for type safety
   - Implement clear function naming

3. **Style Organization**
   - Use scoped styles
   - Group related styles together
   - Implement responsive design
   - Use CSS variables for theming

### Best Practices
1. **Code Organization**
   - Keep components focused and single-purpose
   - Use TypeScript for type safety
   - Implement proper error handling
   - Follow Vue 3 composition API patterns

2. **Performance**
   - Use v-for with proper keys
   - Implement lazy loading where appropriate
   - Optimize component rendering
   - Use proper caching strategies

3. **Accessibility**
   - Use semantic HTML
   - Maintain proper color contrast
   - Implement proper ARIA attributes
   - Ensure keyboard navigation

4. **Maintenance**
   - Keep components modular
   - Document complex logic
   - Use consistent naming conventions
   - Implement proper error boundaries

### Development Workflow
1. Create new components in the appropriate directories
2. Follow the established component structure
3. Implement proper TypeScript interfaces
4. Add necessary styles following the design system
5. Test components across different screen sizes
6. Ensure proper error handling
7. Document any complex logic or decisions

### Future Improvements
1. Implement proper loading states
2. Add error boundaries
3. Implement proper form validation
4. Add unit tests
5. Implement proper data persistence
6. Add proper documentation
7. Implement proper logging
8. Add proper analytics

### Notes
- Always check the actual data structure before implementing interfaces
- Use proper TypeScript types for all data
- Implement proper error handling
- Follow the established design patterns
- Maintain consistent styling
- Use proper semantic HTML
- Implement proper accessibility features
- Follow Vue 3 best practices
- Use proper state management
- Implement proper data fetching
- Use proper component structure
- Follow proper naming conventions
- Implement proper documentation
- Use proper testing strategies
- Follow proper security practices
- Implement proper performance optimizations
- Use proper debugging tools
- Follow proper version control practices
- Implement proper deployment strategies
- Use proper monitoring tools 