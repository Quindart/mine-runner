# Task 10: Testing & Verification (Manual QA)

**Context:** End-to-end manual testing and verification of the complete running-photo-app. Dependencies: Tasks 1-9 complete.

## Scope

This is NOT an implementation task — no new code is written. Instead, you will:
1. Start the dev server
2. Test all user flows
3. Verify spec compliance
4. Check responsive design
5. Confirm data persistence
6. Report findings

## Test Plan

### Pre-Test Checks
- [ ] All 9 tasks completed and committed
- [ ] No uncommitted changes: `git status` shows clean
- [ ] Dev server ready: `npm run dev`
- [ ] Open browser to http://localhost:5173

### Flow 1: Start and Stop a Run
- [ ] Click "Start Run" button
- [ ] Timer starts counting (HH:MM:SS format)
- [ ] Stats display: Distance (km), Pace (min/km), Calories (kcal)
- [ ] "Stop Run" button becomes enabled; "Start Run" becomes disabled
- [ ] Wait 10 seconds, observe timer increment
- [ ] Click "Stop Run"
- [ ] Timer stops
- [ ] Run appears in "Past Runs" tab
- [ ] New run shows: date, distance, duration, photo count (0)

### Flow 2: Capture a Photo (Mock)
- [ ] Start a run
- [ ] Click "Take Photo" button
- [ ] (Browser may block camera — this is expected)
- [ ] If permission denied: error message appears
- [ ] If permission granted: camera UI opens (select existing image or test image)
- [ ] Photo captured → thumbnail appears in photo strip below button
- [ ] Photo count increments
- [ ] No errors in browser console

### Flow 3: View Past Run Details
- [ ] Stop the run (from Flow 1)
- [ ] Switch to "Past Runs" tab
- [ ] Verify "My City" header is present
- [ ] Verify run card displays:
  - [ ] Date (e.g., "📍 Sunday, Aug 27")
  - [ ] Distance (e.g., "0.5 km")
  - [ ] Duration (e.g., "00:01:23")
  - [ ] Photo count
- [ ] Click the run card
- [ ] Detail modal opens with:
  - [ ] Run title/date
  - [ ] All 4 stats (distance, duration, pace, calories)
  - [ ] Map container (likely empty if no real GPS data)
  - [ ] Photo gallery section
  - [ ] "Delete Run" button
- [ ] If photos captured: thumbnails visible in gallery
- [ ] Click a photo → fullscreen view
- [ ] Click outside → modal closes
- [ ] Back in list, run card still visible

### Flow 4: Delete a Run
- [ ] From Past Runs list, click a run
- [ ] Detail modal opens
- [ ] Click "Delete Run" button
- [ ] Confirmation may appear (browser or custom)
- [ ] Run disappears from list
- [ ] Modal closes
- [ ] Past Runs list updated

### Flow 5: Data Persistence
- [ ] Capture a run with at least one photo
- [ ] Stop run
- [ ] Verify run and photo in Past Runs tab
- [ ] Press F5 to reload page
- [ ] Run should still be in Past Runs tab
- [ ] Photo should still be visible (not placeholder)
- [ ] Browser DevTools → Application → Local Storage
  - [ ] Verify "run-store" key exists
  - [ ] Verify IndexedDB "running-app-db" database exists
  - [ ] Verify "photos" object store contains photo blobs

### Flow 6: Responsive Design
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (mobile view)
- [ ] Test at 375px (iPhone SE)
  - [ ] Tabs visible, clickable
  - [ ] Buttons visible, min 44px tall
  - [ ] Timer readable
  - [ ] Stats stack vertically
  - [ ] Photo strip scrolls horizontally
  - [ ] Map scales to full width
  - [ ] No horizontal scroll on page
- [ ] Test at 768px (iPad)
  - [ ] Layout adapts
  - [ ] All elements accessible
- [ ] Test at 1200px (desktop)
  - [ ] Full layout displays
  - [ ] Multi-column grids render correctly

### Flow 7: Error Handling
- [ ] Attempt to take photo without GPS signal (or simulator)
  - [ ] Error message appears (if applicable)
  - [ ] App remains functional
- [ ] Attempt camera access → deny permission
  - [ ] Error message: "Camera permission required"
  - [ ] "Take Photo" button disabled
- [ ] Delete all runs → "No runs yet" message appears
- [ ] No JavaScript errors in console (F12 → Console)

### Flow 8: UI Polish
- [ ] Header is visible (🏃 Running Photo App)
- [ ] Footer text visible ("Local storage only...")
- [ ] Tab indicator shows active tab (color/underline)
- [ ] Hover states on buttons (color change)
- [ ] Hover states on run cards (highlight)
- [ ] No text is cut off
- [ ] Fonts are readable (not too small)
- [ ] Colors are accessible (good contrast)

## Pass Criteria

✅ **PASS if:**
- All 8 flows complete without crashes
- No Critical errors in console
- Data persists across reload
- Responsive design works at 3+ breakpoints
- All user interactions work as expected
- All buttons are accessible (44px+ touch target)
- App conforms to spec requirements

❌ **FAIL if:**
- Any flow crashes or locks up
- Critical errors in console
- Data doesn't persist
- Responsive design breaks at any breakpoint
- Users cannot interact with primary features
- Buttons too small for touch

## Report

After testing, verify:
1. All flows passed ✓ or ✗ with notes
2. No console errors (or minor warnings only)
3. Data persistence confirmed in DevTools
4. Responsive design verified at 3 breakpoints
5. All success criteria met

**Status:** If all tests pass → app is ready for production (or future iterations)

## Notes

- GPS tracking will show mock/simulator locations (or no data if Geolocation blocked)
- Photos will be from device camera or simulator
- This is end-to-end user testing, not unit testing (unit tests already ran in Tasks 2-3)
- If issues found, note them but do NOT fix them here — return findings for triage

## Time Estimate

Full manual testing: 20-30 minutes
