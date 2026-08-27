# Task 3 Review Package: Utility Functions

## Commit Details
**Commit:** `ed976bd`
**Message:** `feat: add GPS, photo, and time utility functions with tests`
**Base:** `933ac2b` (Task 2)

## Files Changed
```
src/utils/gpsUtils.js        | 45 ++++++++++++++++++++++++
src/utils/photoUtils.js      | 28 +++++++++++++++
src/utils/timeUtils.js       | 32 ++++++++++++++++
src/utils/gpsUtils.test.js   | 67 ++++++++++++++++++++++++++++++++++++
src/utils/photoUtils.test.js | 48 ++++++++++++++++++++++++++
src/utils/timeUtils.test.js  | 86 ++++++++++++++++++++++++++++++++++++++++++++
6 files changed, 306 insertions(+)
```

## Utilities Implemented

### gpsUtils.js (4 functions)
1. **haversine(lat1, lng1, lat2, lng2) → number**
   - Great-circle distance calculation
   - Formula: R=6371 km, returns km (2 decimal places)

2. **calculateDistance(gpsTrack) → number**
   - Sums Haversine distances between consecutive GPS points
   - Returns total distance in km (2 decimals)
   - Handles edge case: < 2 points = 0 km

3. **calculatePace(distanceKm, durationMs) → number**
   - Calculates minutes per kilometer
   - Returns minutes/km (2 decimals)
   - Handles edge case: 0 distance = 0 pace

4. **calculateCalories(distanceKm) → number**
   - Simplified estimate: distance * 100
   - Returns rounded to nearest 10

### photoUtils.js (2 functions)
1. **compressImage(blob, maxWidth=1280, maxHeight=720) → Promise<Blob>**
   - Resizes image to max dimensions (aspect-ratio preserved)
   - Recompresses to 80% JPEG quality via Canvas API
   - Returns compressed Blob

2. **getBlobSizeMB(blob) → number**
   - Returns blob size in MB (2 decimal places)

### timeUtils.js (3 functions)
1. **formatDuration(seconds) → string**
   - Converts seconds to "HH:MM:SS" format
   - Zero-padded
   - Example: 3661 → "01:01:01"

2. **formatDate(timestamp) → string**
   - Converts Unix milliseconds to "DayName, Mon DD" format
   - Example: → "Sunday, Aug 25"

3. **formatPace(minPerKm) → string**
   - Converts pace to "MM:SS" format
   - Zero-padded seconds
   - Returns "—" if pace is 0
   - Example: 10.5 → "10:30"

## Test Coverage (52 Total Tests)

### GPS Tests (19)
✅ haversine: Accuracy testing with known coordinates
✅ calculateDistance: Summation logic, multiple points, edge cases
✅ calculatePace: Math verification, zero distance handling
✅ calculateCalories: Formula application, rounding

### Photo Tests (8)
✅ getBlobSizeMB: Size reporting accuracy
✅ compressImage: Image resizing, quality verification, Promise handling

### Time Tests (25)
✅ formatDuration: Edge cases (0, 90, 3661), zero-padding
✅ formatDate: Month names, day names, formatting
✅ formatPace: Rounding, zero case ("—"), formatting

**Test Results:** 52 passed, 0 failed

## Spec Compliance Checklist
✅ Haversine formula: R=6371 km, correct implementation
✅ calculateDistance: Sums segments in km, 2 decimal precision
✅ calculatePace: (durationMs/1000/60) / distance, 2 decimals
✅ calculateCalories: distance * 100, rounded to nearest 10
✅ compressImage: 1280x720 max, 80% JPEG quality, Promise
✅ getBlobSizeMB: MB with 2 decimal precision
✅ formatDuration: "HH:MM:SS" zero-padded
✅ formatDate: "DayName, Mon DD" format
✅ formatPace: "MM:SS" or "—"
✅ All 9 functions match brief specification exactly

## Code Quality Notes
- **Style:** Clean, readable, well-commented
- **Performance:** Efficient algorithms (no unnecessary loops)
- **Error handling:** Edge cases covered (0 distance, null checks, etc.)
- **Testing:** Comprehensive coverage including happy path and edge cases
- **Integration:** No external dependencies beyond Canvas API (browser built-in)

## Key Features
- ✓ GPS calculations use accurate Haversine formula
- ✓ Photo compression uses Canvas API for quality control
- ✓ All time formatting uses native JavaScript Date methods
- ✓ All functions return expected types (number, string, Promise<Blob>)
- ✓ Zero-padding correctly applied to time/pace formats
- ✓ Edge cases handled gracefully (zero distance, zero pace, etc.)

Ready for review.
