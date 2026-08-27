# Task 10: Manual QA Testing - Execution Guide

## Pre-Test Checklist

✅ **All Pre-Test Checks Complete:**
- [x] All 9 tasks completed and committed
- [x] Clean git status: `git status` shows clean
- [x] Dev server running: `npm run dev` (started on port 5173)

## Quick Start

1. **Open your browser** to: `http://localhost:5173`
2. Open **DevTools** (F12) side-by-side if possible
3. Navigate to **Console** tab to watch for errors
4. Work through each flow below
5. Check off items as you verify them
6. Note any issues/failures
7. Fill out the report at the end

---

## Test Execution: 8 Flows

### Flow 1: Start and Stop a Run
**Duration:** 2-3 minutes | **Critical:** Yes

1. [ ] Page loads, Active Run tab is visible
2. [ ] Click **"Start Run"** button
3. [ ] Timer starts displaying in HH:MM:SS format
4. [ ] Watch the seconds increment (wait ~5 seconds to confirm)
5. [ ] Stats display below timer:
   - [ ] Distance (km)
   - [ ] Pace (min/km)
   - [ ] Calories (kcal)
6. [ ] "Stop Run" button is now enabled/visible
7. [ ] "Start Run" button is now disabled
8. [ ] Wait at least 10 seconds
9. [ ] Click **"Stop Run"** button
10. [ ] Timer stops counting (verify it doesn't increment after 2-3 more seconds)
11. [ ] Click **"Past Runs"** tab
12. [ ] Your new run appears in the list with:
    - [ ] Date (e.g., "📍 Sunday, Aug 27")
    - [ ] Distance (likely 0 km if no GPS)
    - [ ] Duration (at least ~00:00:10)
    - [ ] Photo count (0)

**Notes for this flow:**
- Browser may show geolocation permission prompt (block or allow, both are ok)
- If you allow GPS, distance might populate; if blocked, expect 0 km

---

### Flow 2: Capture a Photo (Mock)
**Duration:** 2-3 minutes | **Critical:** Yes

1. [ ] Start a new run (from Flow 1)
2. [ ] Click **"Take Photo"** button
3. [ ] **Expected Behavior (Pick ONE below):**
   - [ ] **Option A:** Browser asks for camera permission
     - [ ] If you block: Error message appears ("Camera permission required")
     - [ ] If you allow: Camera/file picker opens
   - [ ] **Option B:** Error message appears immediately
4. [ ] If camera/picker opened:
   - [ ] Select a photo (from file picker or camera)
   - [ ] Photo thumbnail appears in the photo strip below the button
   - [ ] Photo count increments from 0 to 1
5. [ ] Check **Console (F12)** for any red errors
   - [ ] Should show none or only warnings

**Notes for this flow:**
- If camera is blocked by your OS, error message is acceptable
- The app should not crash

---

### Flow 3: View Past Run Details
**Duration:** 3-4 minutes | **Critical:** Yes

1. [ ] From Flow 2, stop the run
2. [ ] Go to **"Past Runs"** tab
3. [ ] Verify **"My City"** header text is visible
4. [ ] Click on the run card from your active run
5. [ ] A detail modal opens with:
   - [ ] Run title (date/time)
   - [ ] **4 Stats visible:**
     - [ ] Distance (km)
     - [ ] Duration (HH:MM:SS)
     - [ ] Pace (min/km)
     - [ ] Calories (kcal)
   - [ ] **Map container** (may be empty if no GPS)
   - [ ] **Photo gallery section** (if photos were captured)
   - [ ] **"Delete Run"** button
6. [ ] If you captured photos in Flow 2:
   - [ ] Photo thumbnails visible in gallery
   - [ ] Click a photo → fullscreen view opens
   - [ ] Click outside photo → closes fullscreen
7. [ ] Click outside modal or close button → modal closes
8. [ ] Run card still visible in list

**Notes for this flow:**
- Map may show "No location data" message if GPS is blocked
- Gallery may be empty if no photos captured

---

### Flow 4: Delete a Run
**Duration:** 1-2 minutes | **Critical:** Yes

1. [ ] From Flow 3, with modal open
2. [ ] Click **"Delete Run"** button
3. [ ] **Expected:** Either:
   - [ ] Confirmation dialog appears → click confirm
   - [ ] Run deleted immediately
4. [ ] Modal closes
5. [ ] Go back to **"Past Runs"** tab
6. [ ] Run no longer appears in the list
7. [ ] Verify count of runs decreased by 1

**Notes for this flow:**
- If you have multiple runs, delete one and verify only that one is gone

---

### Flow 5: Data Persistence (Critical!)
**Duration:** 3-4 minutes | **Critical:** YES

1. [ ] Create a fresh run with at least **one photo captured**
2. [ ] Stop the run
3. [ ] Verify run and photo visible in **"Past Runs"** tab
4. [ ] **Press F5** to refresh the page
5. [ ] **After reload:**
   - [ ] Run still appears in Past Runs list
   - [ ] Photo is still visible (not placeholder)
   - [ ] Stats (distance, duration) are the same as before
6. [ ] **Open DevTools (F12) → Application tab:**
   - [ ] Click **"Local Storage"** → find `http://localhost:5173`
   - [ ] Look for key: **"run-store"**
   - [ ] [ ] Key exists and has JSON value
7. [ ] **In DevTools → IndexedDB:**
   - [ ] Database: **"running-app-db"** exists
   - [ ] Object store: **"photos"** exists
   - [ ] [ ] Contains photo data (entries visible)

**Notes for this flow:**
- This is the MOST CRITICAL flow for production readiness
- Data must persist across page reloads
- Check both Local Storage AND IndexedDB

---

### Flow 6: Responsive Design
**Duration:** 5-6 minutes | **Critical:** Yes

#### Mobile View (375px - iPhone SE)

1. [ ] Open DevTools (F12)
2. [ ] Click **Toggle Device Toolbar** (or Ctrl+Shift+M)
3. [ ] Set viewport to **375px width** (iPhone SE)
4. [ ] Verify all of the following:
   - [ ] Tabs ("Active Run" / "Past Runs") visible and clickable
   - [ ] All buttons visible (min 44px tall)
   - [ ] Timer readable and not cut off
   - [ ] Stats stack vertically (one per line)
   - [ ] Photo strip scrolls horizontally (no overflow)
   - [ ] Map scales to full width
   - [ ] **NO horizontal scrollbar on page body**
   - [ ] Text is readable (not too small)

#### Tablet View (768px - iPad)

1. [ ] Set viewport to **768px width**
2. [ ] Verify:
   - [ ] Layout adapts (likely 2-column on this size)
   - [ ] All elements accessible and visible
   - [ ] No elements cut off
   - [ ] **NO horizontal scrollbar**

#### Desktop View (1200px+)

1. [ ] Set viewport to **1200px width** or larger
2. [ ] Verify:
   - [ ] Full multi-column layout displays correctly
   - [ ] Spacing looks balanced
   - [ ] All elements properly aligned

**Notes for this flow:**
- Check all 3 breakpoints for completeness
- Most common failure: horizontal scrollbar at mobile sizes

---

### Flow 7: Error Handling
**Duration:** 2-3 minutes | **Critical:** Medium

1. [ ] **Test Camera Permission Denial:**
   - [ ] On a new run, attempt **"Take Photo"**
   - [ ] If browser asks for camera: **DENY permission**
   - [ ] [ ] Error message appears ("Camera permission required" or similar)
   - [ ] [ ] "Take Photo" button disabled
   - [ ] [ ] App remains functional (can still stop run, navigate tabs)

2. [ ] **Test Empty State:**
   - [ ] Delete all runs (from Flow 4)
   - [ ] Go to **"Past Runs"** tab
   - [ ] [ ] "No runs yet" or similar empty state message appears
   - [ ] [ ] App doesn't crash

3. [ ] **Check Console Errors:**
   - [ ] Open DevTools Console (F12 → Console)
   - [ ] Perform all actions in steps 1-2
   - [ ] [ ] **NO red errors** in console
   - [ ] [ ] Only warnings (yellow) or info (blue) messages
   - [ ] [ ] Any errors are NOT blocking app functionality

**Notes for this flow:**
- Minor warnings in console are acceptable
- Critical errors (red) should block you from passing this flow

---

### Flow 8: UI Polish
**Duration:** 3-4 minutes | **Critical:** Medium

1. [ ] **Visual Hierarchy:**
   - [ ] Header visible: "🏃 Running Photo App"
   - [ ] Footer visible: "Local storage only..."
   - [ ] Tab active indicator visible (color/underline change)
   - [ ] Buttons have clear visual state

2. [ ] **Hover/Interactive States:**
   - [ ] Hover over buttons → color changes
   - [ ] Hover over run cards → highlight/shadow appears
   - [ ] Cursor changes to pointer over clickable elements

3. [ ] **Text & Readability:**
   - [ ] No text is cut off or overlapping
   - [ ] Font sizes are readable (not too small)
   - [ ] Line heights provide good spacing
   - [ ] Color contrast is good (can read all text)

4. [ ] **Spacing & Layout:**
   - [ ] Consistent padding around elements
   - [ ] No elements jam together
   - [ ] Buttons are properly spaced
   - [ ] Cards have breathing room

5. [ ] **Browser Compatibility (if applicable):**
   - [ ] Works in your browser without issues
   - [ ] No visual glitches or rendering errors

**Notes for this flow:**
- This is subjective but important for user experience
- Look for any "feels broken" or "looks unpolished" issues

---

## After Testing: Fill Out Report

See: `task-10-report.md`

For each of the 8 flows, mark:
- ✅ **PASS** - All items checked, no critical issues
- ❌ **FAIL** - Items unchecked or critical issues found

Then determine overall status:
- **READY FOR PRODUCTION** - All flows pass
- **BLOCKERS FOUND** - Any critical failures in flows 1, 2, 3, 4, 5, or 6

---

## Common Issues & Troubleshooting

| Issue | Likely Cause | What to Check |
|-------|-------------|---------------|
| Timer doesn't start | Run not starting | Click "Start Run" again, check console errors |
| Photos don't appear | Camera blocked or permission denied | Check browser permissions, look at console |
| Data lost after refresh | Storage not working | Check Local Storage and IndexedDB in DevTools |
| Horizontal scrollbar at mobile | CSS overflow issue | Make viewport exactly 375px, check for wide elements |
| Buttons too small on mobile | Touch target issue | Should be at least 44px tall |
| Console has many red errors | Code issues | Note exact error messages for report |

---

## Success Criteria Checklist

Before declaring **READY FOR PRODUCTION**, verify:

- [ ] **Flow 1 PASS:** Timer and stats work correctly
- [ ] **Flow 2 PASS:** Photos can be captured or error handled
- [ ] **Flow 3 PASS:** Past runs display correctly with details
- [ ] **Flow 4 PASS:** Deletion works without issues
- [ ] **Flow 5 PASS:** Data persists after page reload (MOST CRITICAL)
- [ ] **Flow 6 PASS:** Responsive at 375px, 768px, and 1200px
- [ ] **Flow 7 PASS:** Error handling graceful
- [ ] **Flow 8 PASS:** UI looks polished

**If all checked:** ✅ **READY FOR PRODUCTION**

**If any unchecked:** ❌ **BLOCKERS FOUND** (note in report)

---

## Tips for Testing

1. **Take your time** - Manual testing isn't a race
2. **Note exact errors** - If you see an error, write down the exact message
3. **Test on your actual device** - Use your phone or tablet if possible (not just DevTools)
4. **Try edge cases** - What if you start a run and immediately stop it? What if you take 10 photos?
5. **Use DevTools liberally** - Console, Application, Network tabs will help debug issues
6. **Be thorough on Flow 5** - Data persistence is critical for a running app

**Expected time:** 20-30 minutes for complete testing

Good luck! 🏃
