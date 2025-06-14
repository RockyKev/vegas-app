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
- Do not mess with CSS stylings/Semantic HTML directly. Always ask first.

## AI Development Guide

## Overview
This guide outlines the development approach and best practices for this project. The application is built using Vue 3 with TypeScript, focusing on a clean, maintainable architecture.

## Architecture

### Core Principles
- **Type Safety**: TypeScript is used throughout the application to ensure type safety and better development experience.
- **Component-Based**: The application is built using Vue 3's Composition API with TypeScript.
- **State Management**: Uses Pinia for state management with a focus on type-safe stores.

### Key Components
- **App.vue**: Main application component
- **SystemInfo.vue**: Handles system information display and state management
  - Shows build time, storage usage, and last updated time
  - Provides state import/export functionality
  - Updates automatically when state changes
- **AppHeader.vue**: Application header with navigation
- **AppFooter.vue**: Application footer with system information

### State Management
- Uses Pinia for state management
- State can be exported/imported via JSON
- State changes are tracked and displayed in the UI
- Storage usage is monitored and displayed

## Development Guidelines

### Component Structure
- Use TypeScript for all components
- Follow Vue 3 Composition API patterns
- Keep components focused and single-responsibility
- Use proper typing for props and emits

### State Management
- Use Pinia stores for global state
- Keep store logic clean and well-typed
- Implement proper state persistence
- Provide state import/export functionality

### Styling
- Use scoped CSS in components
- Follow responsive design principles
- Use CSS variables for theming
- Maintain consistent spacing and typography

### Error Handling
- Implement proper error boundaries
- Show user-friendly error messages
- Log errors appropriately
- Handle edge cases gracefully

## Best Practices

### Code Organization
- Keep components small and focused
- Use proper file naming conventions
- Maintain clear component hierarchy
- Document complex logic

### Performance
- Implement proper component lifecycle management
- Use efficient state updates
- Monitor storage usage
- Optimize asset loading

### User Experience
- Provide clear feedback for actions
- Show loading states appropriately
- Handle errors gracefully
- Maintain responsive design

### Testing
- Write unit tests for components
- Test state management logic
- Verify error handling
- Test responsive behavior

## Deployment
- Build process includes environment variables
- Proper error handling for production
- Optimized asset loading
- Responsive design implementation

## Maintenance
- Regular dependency updates
- Code quality monitoring
- Performance optimization
- Security updates

## Future Considerations
- Enhanced state management features
- Improved error handling
- Additional testing coverage
- Performance optimizations

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
- Do not mess with CSS stylings/Semantic HTML directly. Always ask first.

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

## Core Principles

1. **Reuse Existing Composables**
   - Use `useImportableData` for managing importable data
   - Use `useImportData` for handling file imports
   - Use `useErrorHandler` for error management
   - Use `useLoadingState` for loading states
   - Only create new composables when functionality is truly unique (e.g., `useCalendarData` for ICS parsing)

2. **Keep It Simple**
   - Avoid over-engineering solutions
   - Don't split components unnecessarily
   - Maintain single-file components when appropriate
   - Focus on reusing existing patterns rather than creating new ones

3. **Consistent Patterns**
   - Use consistent error handling across views
   - Use consistent loading states
   - Use consistent data import/export patterns
   - Use consistent type checking

4. **Type Safety**
   - Use TypeScript type guards for data validation
   - Ensure proper typing for all composables
   - Validate imported data before use

5. **Store Integration**
   - Use the app store for persistent data
   - Handle store initialization consistently
   - Manage store updates safely

## Common Patterns

1. **Data Import**
   - See `useImportableData` composable for implementation
   - Used in `ContactsView.vue`, `NetworkingTipsView.vue`, and `NetworkingTargetsView.vue`
   - Handles default data loading, store initialization, and data validation

2. **File Import**
   - See `useImportData` composable for implementation
   - Used in `ContactsView.vue`, `NetworkingTipsView.vue`, and `NetworkingTargetsView.vue`
   - Handles file validation, import errors, and success callbacks

3. **Error Handling**
   - See `useErrorHandler` composable for implementation
   - Used across all views for consistent error management
   - Provides error state and handler function

4. **Loading State**
   - See `useLoadingState` composable for implementation
   - Used across all views for consistent loading management
   - Provides loading state and wrapper function

5. **Type Guards**
   - See type guards in each view (e.g., `isContactArray`, `isNetworkingTipArray`)
   - Follow the pattern in `ContactsView.vue` for implementation
   - Ensures type safety for imported data

## When to Create New Composables

1. **Unique Functionality**
   - When handling unique file formats (e.g., ICS for calendar)
   - When implementing complex business logic
   - When managing specialized state

2. **Reusable Logic**
   - When logic is used across multiple components
   - When logic is complex enough to warrant separation
   - When logic needs to be tested independently

3. **State Management**
   - When managing complex state
   - When state needs to be shared across components
   - When state needs to be persisted

## When to Keep It Simple

1. **Single-File Components**
   - When component logic is straightforward
   - When component is not reused
   - When component is specific to a view

2. **Direct Store Usage**
   - When store operations are simple
   - When store operations are view-specific
   - When no complex state management is needed

3. **Inline Logic**
   - When logic is simple and view-specific
   - When logic is not reused
   - When logic is easy to understand

## Common Pitfalls to Avoid

1. **Over-Engineering**
   - Don't split components unnecessarily
   - Don't create new composables when existing ones work
   - Don't add complexity without clear benefit

2. **Inconsistent Patterns**
   - Don't mix different error handling approaches
   - Don't use different loading state patterns
   - Don't implement different data import patterns

3. **Type Safety Issues**
   - Don't skip type validation
   - Don't use `any` types
   - Don't ignore TypeScript errors

4. **Store Management**
   - Don't update store directly without proper checks
   - Don't forget to handle store initialization
   - Don't ignore store persistence

5. **Error Handling**
   - Don't swallow errors
   - Don't show technical error messages to users
   - Don't ignore error states

## Testing Guidelines

1. **Composable Testing**
   - Test composable logic independently
   - Test error handling
   - Test loading states
   - Test data validation

2. **Component Testing**
   - Test component rendering
   - Test user interactions
   - Test error states
   - Test loading states

3. **Integration Testing**
   - Test composable integration
   - Test store integration
   - Test data flow
   - Test error handling

## Performance Considerations

1. **Data Loading**
   - Load data efficiently
   - Handle loading states
   - Cache data when appropriate
   - Validate data before use

2. **Component Rendering**
   - Avoid unnecessary re-renders
   - Use computed properties
   - Use proper key attributes
   - Optimize template complexity

3. **Store Updates**
   - Batch store updates
   - Avoid unnecessary updates
   - Handle updates efficiently
   - Persist data appropriately

## Security Considerations

1. **Data Validation**
   - Validate all imported data
   - Sanitize user input
   - Handle edge cases
   - Prevent data injection

2. **Error Handling**
   - Don't expose sensitive information
   - Handle errors gracefully
   - Log errors appropriately
   - Show user-friendly messages

3. **Store Management**
   - Validate store data
   - Handle store errors
   - Secure sensitive data
   - Manage data persistence safely 