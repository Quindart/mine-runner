# Running Photo App - Design Specification

**Date:** 2026-08-27  
**Status:** Design Review

---

## 1. Overview

**Running Photo App** is a personal record-keeping web application for runners. Users can track their runs in real-time (distance, duration, pace, calories) while capturing beautiful moments along their route via photo. Each photo is automatically geotagged with GPS location and timestamp. Users can later review past runs, viewing the route traced on a map with photo markers pinned at capture locations, plus a gallery of all photos from that run.

**Core Purpose:** Personal record-keeping — helping runners remember and reflect on scenic moments from their runs.

**Platform:** Web app (works on phones via browser or PWA)  
**Storage:** Browser-local (IndexedDB), no backend required  
**Tech Stack:** React, Zustand (with persist), Leaflet, Geolocation API, Web Camera API

---

## 2. Architecture

### 2.1 System Overview

```
┌─────────────────────────────────────────┐
│         Browser (Client-side)           │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │    React UI (Tab-based)         │   │
│  │  ├─ Active Run Tab              │   │
│  │  └─ Past Runs Tab               │   │
│  └─────────────────────────────────┘   │
│                 ↓                       │
│  ┌─────────────────────────────────┐   │
│  │  Zustand State Management       │   │
│  │  (currentRun, allRuns, ...)     │   │
│  └─────────────────────────────────┘   │
│                 ↓                       │
│  ┌─────────────────────────────────┐   │
│  │  IndexedDB (Zustand Persist)    │   │
│  │  Stores: Runs, Photos, Metadata │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Geolocation API (GPS)          │   │
│  │  Leaflet (Map Rendering)        │   │
│  │  Web Camera API (Photo Capture) │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**No backend:** All data is stored locally in the browser. No server, no authentication, no sync across devices.

---

## 3. Data Model

### 3.1 Run Object

```javascript
{
  id: string,                    // UUID
  startTime: number,             // Unix timestamp
  endTime: number,               // Unix timestamp (null if in progress)
  distance: number,              // kilometers
  duration: number,              // seconds
  pace: number,                  // minutes per km
  calories: number,              // estimated
  gpsTrack: [                    // array of GPS points for route line
    { lat: number, lng: number, timestamp: number },
    ...
  ],
  photos: [string],              // array of photo IDs (foreign keys to photos)
}
```

### 3.2 Photo Object

```javascript
{
  id: string,                    // UUID
  runId: string,                 // which run it belongs to
  blob: Blob,                    // image data (stored as binary)
  lat: number,                   // latitude at capture
  lng: number,                   // longitude at capture
  timestamp: number,             // Unix timestamp of capture
}
```

### 3.3 Zustand State Structure

```javascript
{
  // Active run tracking
  currentRun: null | Run,        // null if no run in progress
  isRunning: boolean,
  
  // All saved runs
  allRuns: Run[],
  
  // Navigation/UI state
  selectedRunId: string | null,  // which past run is being viewed
  
  // Actions
  startRun: () => void,
  stopRun: () => void,
  addPhotoToRun: (blob, lat, lng) => void,
  loadAllRuns: () => void,
  deleteRun: (runId) => void,
  selectRun: (runId) => void,
}
```

**Storage:** All state is persisted to IndexedDB via Zustand persist plugin. Data survives page refresh and browser restart.

---

## 4. UI Design

### 4.1 Layout Structure

Two-tab interface:

```
┌──────────────────────────────┐
│  [Active Run] [Past Runs]    │  ← Tab navigation
├──────────────────────────────┤
│                              │
│      Tab Content             │
│   (changes based on tab)     │
│                              │
└──────────────────────────────┘
```

### 4.2 Tab 1: Active Run

**Purpose:** Track the current run, display live stats, capture photos.

**Layout:**
```
┌──────────────────────────────┐
│     🏃 Running Timer         │
│       00:12:34               │  ← time elapsed
├──────────────────────────────┤
│  Distance:    2.5 km         │
│  Pace:        4:48 min/km    │
│  Calories:    ~280 kcal      │
├──────────────────────────────┤
│                              │
│  [START RUN]  [STOP RUN]    │  ← main controls
│  [TAKE PHOTO]               │
│                              │
├──────────────────────────────┤
│ Photos in this run:          │
│ [thumb] [thumb] [thumb]     │  ← photo strip
│                              │
└──────────────────────────────┘
```

**Features:**
- **Timer:** Updates every second during active run
- **Live Stats:** Recalculate distance/pace as GPS points stream in
- **Start Run Button:** Begins GPS polling (every 1-2 seconds); disabled if run already in progress
- **Stop Run Button:** Ends GPS polling, saves run to storage; disabled if no run in progress
- **Take Photo Button:** Opens device camera, captures image with current GPS location and timestamp
- **Photo Strip:** Shows thumbnails of all photos taken during this run; click to preview

**Behavior:**
- When app loads, check if there's a run in progress (from persisted state). If yes, resume GPS polling.
- If user closes browser during a run and returns, the run is still active and can continue.

### 4.3 Tab 2: Past Runs

**Purpose:** Browse and review past runs.

**Layout:**
```
┌──────────────────────────────┐
│     My City                  │  ← section header
├──────────────────────────────┤
│                              │
│  📍 Sunday, Aug 25  | 5.2 km │
│     00:52:15 | 3 photos     │  ← run card 1
│                              │
│  📍 Saturday, Aug 24 | 3.1 km│
│     00:38:20 | 5 photos     │  ← run card 2
│                              │
│  📍 Friday, Aug 23 | 8.7 km │
│     01:24:15 | 12 photos    │  ← run card 3
│                              │
│  ...                         │
│                              │
└──────────────────────────────┘
```

**Run Card Shows:**
- Date (human-readable)
- Distance
- Duration
- Photo count
- Click to open detail view

**Run Detail View (Modal/Page):**
```
┌──────────────────────────────┐
│  Sunday, Aug 25              │  ← run title
│  5.2 km | 00:52:15           │
│  Pace: 10:10 min/km          │
│  Calories: ~520 kcal         │
├──────────────────────────────┤
│                              │
│  [Map with route + markers] │  ← Leaflet map
│  ┌──────────────────────────┐│
│  │ ╱╲ route line            ││
│  │ 📍 photo markers         ││
│  │                          ││
│  └──────────────────────────┘│
│                              │
├──────────────────────────────┤
│  Photo Gallery:              │
│  [photo1] [photo2] [photo3] │
│  [photo4] [photo5] ...      │
│                              │
│  [DELETE RUN]               │
│                              │
└──────────────────────────────┘
```

**Features:**
- **Map:** Leaflet renders OpenStreetMap
  - **Route Line:** Polyline connecting all GPS points in chronological order
  - **Photo Markers:** Custom pin icons at each photo's GPS location
- **Photo Gallery:** Click a photo → fullscreen/expanded view
- **Delete Run:** Removes run and all associated photos from IndexedDB
- **Back:** Return to past runs list

---

## 5. Feature Details

### 5.1 GPS Tracking & Route Recording

**During Active Run:**
- Call `navigator.geolocation.watchPosition()` to get GPS updates every 1-2 seconds (configurable)
- Store each point as `{ lat, lng, timestamp }`
- Accumulate in current run's `gpsTrack` array
- If GPS permission denied, show error and disable run start

**Accuracy:**
- GPS accuracy varies by device (typically 5-20m on phones)
- Route line will be approximate but visually represent the path

**Edge Cases:**
- GPS signal lost during run: continue with last known position until signal returns
- User minimizes browser: GPS polling continues in background (depends on browser behavior)

### 5.2 Photo Capture

**When User Taps "Take Photo":**
1. Open device camera (native UI via `<input type="file" accept="image/*" capture="environment">` or Web Camera API)
2. User captures image
3. App grabs current GPS location from the last known position in `gpsTrack`
4. Store photo as Blob in a temporary state
5. Generate UUID for photo
6. Add photo object to `currentRun.photos`
7. Show thumbnail in photo strip
8. Display feedback (toast: "Photo saved")

**Photo Storage:**
- Blob stored in IndexedDB (size limit typically ~50MB per app)
- Compress images before storing to save space (max dimensions: 1280x720)
- If photo capture fails, show error message

### 5.3 Map Display (Past Runs)

**Leaflet Integration:**
- Use OpenStreetMap (free, no API key required)
- Render route line as a polyline (light blue or green color)
- Render photo markers as custom icons (camera icon or numbered pins)
- Center map on first GPS point; zoom level: auto-fit all points
- Allow user to pan/zoom manually

**Interactions:**
- Click a photo marker → show photo in fullscreen or open gallery
- Markers are clickable; hover shows photo thumbnail or description

### 5.4 Stats Calculations

**Distance:**
- Use Haversine formula to calculate great-circle distance between consecutive GPS points
- Sum all segments to get total distance
- Formula: `d = 2 * R * asin(sqrt(sin²((lat2-lat1)/2) + cos(lat1)*cos(lat2)*sin²((lng2-lng1)/2)))`
- R (Earth radius) = 6371 km
- Result in km, rounded to 2 decimals

**Pace:**
- `pace = duration / distance` (minutes per km)
- Rounded to 2 decimals
- If distance is 0, show "—"

**Calories:**
- Simple estimate based on running speed
- Formula: `calories ≈ speed * weight * time` (simplified MET-based approach)
- For demo, use placeholder: `calories = distance * 100` (rough estimate)
- Can be refined later based on user preference

**Duration:**
- `endTime - startTime` in seconds
- Display as HH:MM:SS

### 5.5 Data Persistence

**Zustand Persist:**
- Configure Zustand to auto-save state to IndexedDB on every change
- Load persisted state on app startup
- No explicit "save" button needed; all changes are automatic

**Storage Limits:**
- IndexedDB quota: typically 50MB per app (varies by browser/device)
- Photos can consume significant space; warn user if approaching limit
- Consider data cleanup: offer to archive/delete old runs

---

## 6. Technical Implementation

### 6.1 Dependencies

```json
{
  "react": "^18.0.0",
  "zustand": "^4.0.0",
  "leaflet": "^1.9.0",
  "uuid": "^9.0.0"
}
```

### 6.2 Folder Structure

```
src/
├── components/
│   ├── TabNavigation.jsx
│   ├── ActiveRunTab.jsx
│   ├── PastRunsTab.jsx
│   ├── RunDetail.jsx
│   ├── Map.jsx
│   └── PhotoGallery.jsx
├── store/
│   └── runStore.js          // Zustand store with persist
├── utils/
│   ├── gpsUtils.js          // Haversine, distance calc
│   ├── photoUtils.js        // image compression
│   └── timeUtils.js         // format time/date
├── hooks/
│   ├── useGeolocation.js    // GPS polling logic
│   └── useRunTracking.js    // active run logic
├── App.jsx
└── App.css
```

### 6.3 Key Implementation Notes

**Geolocation:**
- Request permission once on app startup
- Use `watchPosition()` for continuous updates
- Handle permission denied gracefully (disable run tracking)

**Photo Capture:**
- Use native camera input: `<input type="file" accept="image/*" capture="environment">`
- Compress image to max 1280x720 before storing (use Canvas API or library like `compressorjs`)
- Check IndexedDB quota before storing; warn if low

**Map Rendering:**
- Import Leaflet CSS globally
- Create map instance per run detail view
- Render route as polyline, photos as markers
- Use Leaflet icons for photo markers (can customize appearance)

**Responsive Design:**
- Tab layout adapts to mobile (full-width tabs)
- Map scales to container width
- Photo strip uses horizontal scroll on mobile
- Buttons sized for touch (min 44px)

---

## 7. User Flows

### 7.1 Start a Run

1. User opens app
2. Clicks **[START RUN]** on Active Run tab
3. App requests geolocation permission (if not granted)
4. GPS polling begins; timer starts
5. Stats show 0.0 km, 00:00:00

### 7.2 Capture a Photo

1. During active run, user clicks **[TAKE PHOTO]**
2. Device camera opens (native UI)
3. User frames and captures image
4. App stores photo with current GPS location + timestamp
5. Thumbnail appears in photo strip

### 7.3 End a Run

1. User clicks **[STOP RUN]**
2. GPS polling stops
3. Final stats calculated
4. Run saved to IndexedDB (persisted)
5. UI resets; timer shows 00:00:00
6. User can now see the completed run in Past Runs tab

### 7.4 Review a Past Run

1. Switch to **Past Runs** tab
2. Click a run card from the list
3. Run Detail modal opens
4. User sees:
   - Map with route line + photo markers
   - Stats (distance, pace, duration, calories)
   - Photo gallery
5. Click a photo to view fullscreen
6. Click **[DELETE RUN]** to remove (with confirmation)
7. Click back/close to return to list

---

## 8. Error Handling

| Scenario | Behavior |
|----------|----------|
| GPS permission denied | Show toast: "GPS permission required to track runs"; disable run start button |
| GPS signal lost | Continue with last known position; show warning |
| Photo capture fails | Show toast: "Failed to capture photo"; allow retry |
| Camera permission denied | Show toast: "Camera permission required"; disable photo capture |
| IndexedDB quota exceeded | Show warning: "Storage nearly full; consider deleting old runs" |
| Browser doesn't support Geolocation | Disable run tracking; show message: "GPS not available" |
| Corrupt data in IndexedDB | Clear and reinitialize on startup (or offer to export/restore) |

---

## 9. Future Enhancements (Out of Scope)

- **Cloud sync:** Upload runs to a backend for multi-device access
- **Social sharing:** Share runs/photos with friends
- **Photo editing:** Crop, filter, annotate photos before saving
- **Running goal tracking:** Set distance/time targets
- **Export:** Save runs as GPX files or PDF reports
- **Offline mode:** Pre-download maps for offline use
- **Social map:** See other runners' routes in your area
- **Detailed analytics:** Heart rate, elevation gain, split times

---

## 10. Success Criteria

✅ Users can start/stop runs with real-time GPS tracking  
✅ Users can capture photos with automatic geotagging  
✅ Users can view past runs with route map + photo markers  
✅ All data persists in browser IndexedDB (no backend needed)  
✅ App works on mobile browsers (responsive design)  
✅ Photos and runs display correctly after page refresh  
✅ No backend infrastructure required

---

## 11. Design Review Notes

- **Tech Stack Rationale:** React + Zustand chosen for simplicity; Leaflet for lightweight mapping; no backend keeps complexity low and data private
- **Local Storage Only:** Aligns with personal record-keeping use case; ensures user privacy
- **Tab-based UI:** Simple, mobile-friendly, clear separation between active tracking and historical review
- **GPS + Photos:** Core value prop — capturing moments in context of actual route
- **No Backend:** Scope constraint; keeps this MVP focused and deployable as a static web app

