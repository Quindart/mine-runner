# Task 3: Utility Functions (GPS, Photos, Time)

**Context:** Pure utility functions used by hooks, components, and state management. Dependencies: Tasks 1-2 complete.

## Files to Create

- `src/utils/gpsUtils.js` — GPS distance and pace calculations
- `src/utils/photoUtils.js` — Image compression and sizing
- `src/utils/timeUtils.js` — Time and date formatting
- `src/utils/gpsUtils.test.js` — Tests for GPS functions
- `src/utils/photoUtils.test.js` — Tests for photo functions
- `src/utils/timeUtils.test.js` — Tests for time functions

## Functions to Implement

**gpsUtils.js:**
```javascript
haversine(lat1, lng1, lat2, lng2) => number  // km
calculateDistance(gpsTrack) => number        // km
calculatePace(distanceKm, durationMs) => number  // min/km
calculateCalories(distanceKm) => number      // kcal estimate
```

**photoUtils.js:**
```javascript
compressImage(blob, maxWidth=1280, maxHeight=720) => Promise<Blob>
getBlobSizeMB(blob) => number
```

**timeUtils.js:**
```javascript
formatDuration(seconds) => string  // "HH:MM:SS"
formatDate(timestamp) => string    // "Monday, Aug 25"
formatPace(minPerKm) => string     // "10:30"
```

## Specifications

**Haversine (from spec Section 5.4):**
- Formula: `d = 2 * R * asin(sqrt(sin²((lat2-lat1)/2) + cos(lat1)*cos(lat2)*sin²((lng2-lng1)/2)))`
- R (Earth radius) = 6371 km
- Return in km, rounded to 2 decimals

**calculateDistance:**
- Input: gpsTrack array of `{lat, lng, timestamp}` objects
- Sum distances between consecutive points using Haversine
- Return rounded to 2 decimals
- If fewer than 2 points, return 0

**calculatePace:**
- Input: distanceKm (number), durationMs (number)
- Return `(durationMs / 1000 / 60) / distanceKm` (minutes per km)
- Rounded to 2 decimals
- If distance is 0, return 0

**calculateCalories:**
- Input: distanceKm
- Formula (spec Section 5.4): `distance * 100` (simplified)
- Rounded to nearest 10

**compressImage:**
- Input: blob, maxWidth=1280, maxHeight=720
- Resize image to fit max dimensions (preserve aspect ratio)
- Use Canvas API to draw + recompress at 80% quality
- Return Promise<Blob> (JPEG format)

**formatDuration:**
- Input: seconds (number)
- Output: "HH:MM:SS" (zero-padded)
- Example: 3661 seconds → "01:01:01"

**formatDate:**
- Input: timestamp (Unix milliseconds)
- Output: "DayName, Mon DD" format
- Example: 1693080000000 → "Sunday, Aug 25"

**formatPace:**
- Input: minPerKm (number)
- Output: "MM:SS" format (zero-padded seconds)
- Example: 10.5 → "10:30"
- If 0, return "—"

## Steps

1. Create `src/utils/gpsUtils.js` with all 4 functions
2. Create `src/utils/photoUtils.js` with both functions
3. Create `src/utils/timeUtils.js` with all 3 functions
4. Create test files with comprehensive test cases
5. Run all tests: `npm run test src/utils/`
6. Ensure all tests pass
7. Commit with message: "feat: add GPS, photo, and time utility functions with tests"

## Testing

Each test file should verify:
- **gpsUtils:** Haversine accuracy (test against known distances), calculateDistance sums correctly, calculatePace math, calculateCalories formula
- **photoUtils:** Blob size reporting, image compression (can create test image and compress it)
- **timeUtils:** formatDuration edge cases (0, 90, 3661), formatDate month/day/day-of-week, formatPace rounding

Run: `npm run test src/utils/` — all tests pass
