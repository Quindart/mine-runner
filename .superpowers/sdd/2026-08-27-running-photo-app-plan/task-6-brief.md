# Task 6: ActiveRunTab Component

**Context:** UI for tracking an active run in real-time. Shows timer, stats, and photo capture. Dependencies: Tasks 1-5 complete (store, utils, hooks).

## File to Create

- `src/components/ActiveRunTab.jsx` — Active run UI component

## Component Specification

**Props:** None (uses Zustand store directly)

**Hooks Used:**
- `useRunStore` — access currentRun, isRunning, startRun, stopRun, addPhotoToRun
- `useRunTracking` — get elapsedSeconds and geoError
- `useRef` — for photo input element

**State:**
- `photoError: string | null` — error message for photo capture failures

**Rendered Elements:**

1. **Timer Display:**
   - Div: className="timer-display"
   - Shows `formatDuration(elapsedSeconds)` in large mono font
   - Updates every 1 second

2. **Stats Display (grid, 3 columns):**
   - Distance: `${distance.toFixed(2)} km` (calculated from currentRun.gpsTrack)
   - Pace: `${formatPace(pace)}` (min/km)
   - Calories: `~${calories} kcal`

3. **Error Messages:**
   - If `geoError`: display in error-message div
   - If `photoError`: display in error-message div

4. **Action Buttons:**
   - "Start Run": onClick `startRun()`, disabled if `isRunning`
   - "Stop Run": onClick `stopRun()`, disabled if not `isRunning`
   - "Take Photo": onClick `handlePhotoClick()`, disabled if not `isRunning`
   - Hidden file input: ref={fileInputRef}, type="file", accept="image/*", capture="environment", onChange={handlePhotoCapture}

5. **Photo Strip:**
   - Shows count of photos: `({currentRun?.photos?.length || 0})`
   - Grid of photo thumbnails (will be placeholders for now)
   - Empty state: "No photos yet"

## Key Logic

**Distance/Pace/Calories Calculation:**
- Use functions from Task 3 (gpsUtils)
- Recalculate on every render (elapsedSeconds changes every second)
- `distance = calculateDistance(currentRun.gpsTrack)`
- `pace = calculatePace(distance, elapsedSeconds * 1000)`
- `calories = calculateCalories(distance)`

**Photo Capture:**
- Clicking "Take Photo" triggers file input
- On file selected: `handlePhotoCapture(e)`
  - Get file from `e.target.files[0]`
  - Compress using `compressImage(file)` (from Task 3)
  - Generate photoId with uuid
  - Get last GPS point from `currentRun.gpsTrack`
  - Call `addPhotoToRun(photoId, lat, lng, Date.now())`
  - Show success toast (or just clear error)
  - If error: set `photoError`

## Dependencies

- `react` (useState, useRef)
- `useRunStore` (Task 2)
- `useRunTracking` (Task 4)
- `formatDuration`, `formatPace` (Task 3)
- `calculateDistance`, `calculatePace`, `calculateCalories`, `compressImage` (Task 3)
- `uuid` (Task 1)

## Steps

1. Create `src/components/ActiveRunTab.jsx` with all UI above
2. No unit tests (component integration tested in Task 10)
3. Commit with message: "feat: add ActiveRunTab component with timer and photo capture"

## Notes

- The photo strip will show placeholders (📷) for now; actual photo display comes in Task 9
- Task 9 will modify this component to actually store photo blobs
- GPS accumulation happens via useRunTracking hook (which calls store's addGpsPoint automatically)
