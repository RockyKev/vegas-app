# PWA Testing Guide

## Desktop Testing

### Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to Application tab
3. Check these sections:
   - Manifest: Verify all icons and settings
   - Service Workers: Check registration and updates
   - Cache Storage: Verify cached resources
   - IndexedDB: Check offline data storage

### Lighthouse Testing
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select:
   - Categories: Progressive Web App
   - Device: Mobile
4. Run audit
5. Address any issues in the report

### Offline Testing
1. In Chrome DevTools:
   - Go to Network tab
   - Check "Offline" checkbox
2. Refresh page
3. Verify:
   - Offline indicator appears
   - Core functionality works
   - Cached resources load
   - Offline fallback shows when needed

## Mobile Testing

### Android Testing
1. **Chrome for Android**
   - Open the PWA URL
   - Verify install prompt appears
   - Install the PWA
   - Test offline functionality
   - Check home screen icon

2. **Samsung Internet**
   - Test installation
   - Verify offline mode
   - Check icon quality

### iOS Testing
1. **Safari**
   - Open the PWA URL
   - Use "Add to Home Screen"
   - Verify icon appears
   - Test offline functionality

2. **Chrome for iOS**
   - Test installation
   - Verify offline mode

## Testing Checklist

### Installation
- [ ] Install prompt appears
- [ ] Installation completes successfully
- [ ] App icon appears on home screen
- [ ] App opens in standalone mode

### Offline Functionality
- [ ] App works without internet
- [ ] Offline indicator shows
- [ ] Data persists between sessions
- [ ] Uploaded files available offline
- [ ] Form submissions queue when offline

### Performance
- [ ] App loads quickly
- [ ] Smooth transitions
- [ ] No layout shifts
- [ ] Responsive on all screen sizes

### Data Management
- [ ] LocalStorage data persists
- [ ] Imported files available offline
- [ ] State syncs when back online
- [ ] Cache updates properly

## Common Issues to Check

1. **Installation Issues**
   - HTTPS requirement
   - Valid manifest
   - Service worker registration
   - Icon requirements

2. **Offline Issues**
   - Cache strategies
   - Service worker updates
   - Data persistence
   - Offline fallbacks

3. **Performance Issues**
   - Cache efficiency
   - Resource loading
   - Memory usage
   - Battery impact

## Testing Tools

1. **Chrome DevTools**
   - Application tab
   - Network tab
   - Lighthouse
   - Performance tab

2. **Online Validators**
   - [PWA Builder](https://www.pwabuilder.com/)
   - [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

3. **Device Testing**
   - Physical Android devices
   - Physical iOS devices
   - Different screen sizes
   - Different network conditions

## Debug Tips

1. **Service Worker**
   - Check registration in Application tab
   - Monitor updates
   - Test cache strategies
   - Verify offline functionality

2. **Manifest**
   - Validate JSON format
   - Check icon paths
   - Verify start URL
   - Test display modes

3. **Cache**
   - Monitor cache storage
   - Check cache updates
   - Verify offline resources
   - Test cache invalidation

## Best Practices

1. **Testing Environment**
   - Use incognito mode
   - Clear site data between tests
   - Test on multiple devices
   - Test with different network conditions

2. **Documentation**
   - Record test results
   - Document issues found
   - Track performance metrics
   - Note device-specific behaviors

3. **Continuous Testing**
   - Regular Lighthouse audits
   - Cross-browser testing
   - Cross-device testing
   - Performance monitoring 