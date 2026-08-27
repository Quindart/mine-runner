# Task 2: Zustand Store (Data Model & State Management)

**Context:** After Task 1 (project setup), this task creates the core state management layer. All UI components and hooks (Tasks 4, 6, 7, 9) depend on this store.

## Requirements

**File to Create:**
- `src/store/runStore.js` — Zustand store with persist middleware

**Data Structures (from spec Section 3):**
```javascript
// Run object
{
  id: string,                    // UUID
  startTime: number,             // Unix timestamp
  endTime: number | null,        // Unix timestamp (null if in progress)
  distance: number,              // kilometers
  duration: number,              // seconds
  pace: number,                  // minutes per km
  calories: number,              // estimated
  gpsTrack: [{ lat, lng, timestamp }, ...],  // GPS points
  photos: [string],              // array of photo IDs
}

// Zustand state
{
  currentRun: null | Run,
  isRunning: boolean,
  allRuns: Run[],
  selectedRunId: string | null,
  
  // Actions
  startRun: () => void,
  stopRun: () => void,
  addGpsPoint: (lat, lng, timestamp) => void,
  addPhotoToRun: (photoId, lat, lng, timestamp) => void,
  deleteRun: (runId) => void,
  selectRun: (runId) => void,
  updateRunStats: (runId) => void,
}
```

**Export:**
- Default export: `useRunStore` hook (created with `create()` from 'zustand')
- Must use `persist` middleware from 'zustand/middleware'
- Storage name: 'run-store'

**Global Constraints:**
- Zustand version: ≥4.0.0
- All state survives page refresh (persist to IndexedDB)
- Data model matches spec exactly (Section 3)

## Steps

1. Create `src/store/runStore.js` with Zustand store using persist middleware
2. Implement state: currentRun, isRunning, allRuns, selectedRunId, photoBlobs (for Task 9)
3. Implement actions: startRun, stopRun, addGpsPoint, addPhotoToRun, deleteRun, selectRun, updateRunStats, storePhotoBlob, getPhotoBlob, clearPhotoBlob
4. Include Haversine helper function for distance calculation
5. Create `src/store/runStore.test.js` with tests:
   - startRun creates run with correct initial state
   - stopRun saves run to allRuns and resets
   - addGpsPoint appends to gpsTrack
   - deleteRun removes from allRuns
   - selectRun sets selectedRunId
6. Run tests: `npm run test src/store/runStore.test.js`
7. Commit with message: "feat: add Zustand store for run/photo state with persist"

## Testing

- `npm run test src/store/runStore.test.js` → all tests pass
- Store must persist across page reload (test: inspect localStorage/IndexedDB after running tests)

**Note for implementer:** The store's Haversine function is a temporary helper. Task 3 will extract this to gpsUtils.js, but for now, include it in runStore.js for calculateDistance() to work. Task 9 will add photoBlobs state and related actions (storePhotoBlob, getPhotoBlob, clearPhotoBlob).
