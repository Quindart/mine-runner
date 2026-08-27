# Task 7: PastRunsTab & Component Suite (Map, PhotoGallery, RunDetail)

**Context:** UI for viewing past runs, including map visualization and photo gallery. Dependencies: Tasks 1-6 complete (store, utils, hooks, TabNav, ActiveRunTab).

## Files to Create

- `src/components/PastRunsTab.jsx` — List of past runs
- `src/components/RunDetail.jsx` — Modal for run details (map + stats + photos)
- `src/components/Map.jsx` — Leaflet map with route + photo markers
- `src/components/PhotoGallery.jsx` — Photo thumbnails + fullscreen view

## Component Specifications

### Map.jsx

**Props:**
```javascript
Map({ 
  gpsTrack: [{lat, lng, timestamp}, ...],
  photos: [{id, lat, lng}, ...],  // optional
})
```

**Behavior:**
- Initialize Leaflet map on mount
- Render polyline connecting all GPS points (route line)
- Render photo markers at each photo location (numbered pins)
- Fit map bounds to route (auto-zoom)
- Allow manual pan/zoom

**Implementation notes:**
- Import `leaflet` and `leaflet/dist/leaflet.css`
- Use OpenStreetMap tile layer (free, no API key)
- Polyline color: light blue (#3388ff)
- Photo markers: numbered divIcon (1, 2, 3, ...)
- Container: div with className="map-container", height 400px

### PhotoGallery.jsx

**Props:**
```javascript
PhotoGallery({
  photos: [{id, blob}, ...]  // blobs are actual Blob objects
})
```

**Behavior:**
- Show empty state if no photos
- Grid of photo thumbnails (className="photo-grid")
- Click thumbnail → fullscreen modal
- Modal shows full-size image, click to close

**Implementation:**
- Use `URL.createObjectURL(blob)` to display blobs
- Modal overlay with div.photo-modal
- Navigation: click image or click outside to close

### RunDetail.jsx

**Props:**
```javascript
RunDetail({
  runId: string,
  onClose: () => void,
  photos: { [photoId]: Blob }  // optional, from Task 9
})
```

**Behavior:**
- Modal displaying full run details
- Header: date, distance, duration, pace, calories
- Map component showing route and photo markers
- Photo gallery showing photos
- Delete button (confirms before deleting)
- Close button (X in top right)

**Consumes from store:**
- `allRuns` — to find the run by ID
- `deleteRun` — to delete the run

### PastRunsTab.jsx

**Props:** None (uses store directly)

**Behavior:**
- Header: "My City"
- Empty state if no runs
- List of run cards (sorted by date, newest first)
- Each card shows: date, distance, duration, photo count
- Click card → open RunDetail modal
- Close modal → back to list

**Card layout:**
- Date (e.g., "📍 Sunday, Aug 25")
- Distance (e.g., "5.2 km")
- Duration (e.g., "00:52:15")
- Photo count (e.g., "3 photos")

**Uses:**
- `allRuns`, `selectRun`, `selectedRunId` from store
- `formatDate`, `formatDuration` from utils

## Dependencies

- `react` (useState)
- `leaflet` (L.map, L.polyline, L.marker, L.tileLayer)
- `useRunStore` (Task 2)
- `formatDate`, `formatDuration` (Task 3)

## Steps

1. Create `src/components/Map.jsx` with Leaflet integration
2. Create `src/components/PhotoGallery.jsx` with modal
3. Create `src/components/RunDetail.jsx` with all features
4. Create `src/components/PastRunsTab.jsx` with list and detail view
5. No unit tests required (integration tested in Task 10)
6. Commit with message: "feat: add PastRunsTab, RunDetail, Map, and PhotoGallery components"

## Notes

- Task 9 will modify RunDetail and PastRunsTab to actually load and display photo blobs
- For now, Map component shows empty photo array or test markers
- PhotoGallery shows empty state or test photos
- All photos display comes after Task 9
