# Task 4: Custom Hooks (Geolocation & Run Tracking)

**Context:** React hooks that encapsulate GPS and run tracking logic. Used by components in Task 6. Dependencies: Tasks 1-3 complete.

## Files to Create

- `src/hooks/useGeolocation.js` — GPS watchPosition wrapper
- `src/hooks/useRunTracking.js` — Active run lifecycle management

## Hook Specifications

**useGeolocation():**
```javascript
returns {
  position: { lat, lng, timestamp } | null,
  error: string | null,
  watching: boolean,
  startWatching: () => void,
  stopWatching: () => void,
}
```

- Calls `navigator.geolocation.watchPosition()` when startWatching() called
- Accumulates position as `{ lat, lng, timestamp: Date.now() }`
- Handles errors gracefully (missing Geolocation API, permission denied, etc.)
- Returns error string if failure
- `watching` boolean tracks if watchPosition is active
- `stopWatching()` calls `navigator.geolocation.clearWatch()`
- Cleanup: useEffect return should clearWatch on unmount

**useRunTracking():**
```javascript
returns {
  elapsedSeconds: number,
  geoError: string | null,
}
```

- Consumes: `useRunStore` (isRunning, currentRun, addGpsPoint)
- Consumes: `useGeolocation` hook
- Timer: updates every 1 second when isRunning is true
- GPS: calls startWatching() when isRunning is true, stopWatching() when false
- GPS accumulation: calls `addGpsPoint(lat, lng, timestamp)` on each new position
- Returns elapsed seconds since run started and any geolocation error

## Dependencies

- `react` (useState, useEffect, useCallback)
- `useRunStore` (from Task 2)
- Uses Geolocation API (browser built-in)

## Steps

1. Create `src/hooks/useGeolocation.js` with full implementation
2. Create `src/hooks/useRunTracking.js` with full implementation
3. No unit tests required (integration with browser APIs difficult; rely on component testing)
4. Test manually: verify GPS permission handling works
5. Commit with message: "feat: add useGeolocation and useRunTracking hooks"

## Manual Testing

These hooks are tricky to unit test due to browser API dependencies. Manual testing:
1. Load the app (will request Geolocation permission)
2. Verify hooks accept/deny permission gracefully
3. Verify no console errors from watchPosition or timer

Actual GPS accumulation will be tested in Task 6 (ActiveRunTab integration test).
