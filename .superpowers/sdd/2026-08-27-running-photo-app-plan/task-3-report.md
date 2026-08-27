# Task 3 Report: Utility Functions (GPS, Photos, Time)

## Status: DONE

All utility functions have been successfully implemented and tested.

## Files Created

1. **src/utils/gpsUtils.js** (61 lines)
   - `haversine(lat1, lng1, lat2, lng2)` - Calculates distance between two GPS coordinates using Haversine formula
   - `calculateDistance(gpsTrack)` - Sums distances between consecutive GPS points
   - `calculatePace(distanceKm, durationMs)` - Calculates pace in minutes per kilometer
   - `calculateCalories(distanceKm)` - Estimates calories burned (distance * 100)

2. **src/utils/photoUtils.js** (50 lines)
   - `compressImage(blob, maxWidth=1280, maxHeight=720)` - Compresses image blob to max dimensions at 80% JPEG quality
   - `getBlobSizeMB(blob)` - Returns blob size in megabytes, rounded to 2 decimals

3. **src/utils/timeUtils.js** (51 lines)
   - `formatDuration(seconds)` - Formats seconds to "HH:MM:SS" format
   - `formatDate(timestamp)` - Formats Unix timestamp to "DayName, Mon DD" format
   - `formatPace(minPerKm)` - Formats pace to "MM:SS" format or "—" if zero

4. **src/utils/gpsUtils.test.js** (127 lines)
   - 19 tests covering Haversine accuracy, distance calculation, pace math, and calories formula

5. **src/utils/photoUtils.test.js** (89 lines)
   - 8 tests covering blob size reporting and photo utility functionality

6. **src/utils/timeUtils.test.js** (162 lines)
   - 25 tests covering duration edge cases, date formatting, and pace formatting

## Test Results

All tests passing:
```
Test Files  3 passed (3)
      Tests  52 passed (52)
   Start at  16:33:46
   Duration  107ms
```

### Test Coverage by Module

- **gpsUtils**: 19 tests
  - Haversine distance calculation with known reference points
  - Edge cases (same coordinates, single degree latitude)
  - Distance track summation
  - Pace calculation with various inputs
  - Calories formula with rounding to nearest 10

- **photoUtils**: 8 tests
  - Empty blob size (0 MB)
  - Various blob sizes (KB to MB range)
  - Rounding accuracy to 2 decimals
  - Function export verification

- **timeUtils**: 25 tests
  - Duration formatting edge cases (0, 90, 3661 seconds)
  - Date formatting with day names and month abbreviations
  - Zero padding for all time components
  - Pace formatting with rounding and "—" for zero values

## Implementation Notes

### GPS Functions
- Haversine formula uses Earth radius of 6371 km as specified
- All distances rounded to 2 decimal places
- Pace returns 0 when distance is 0 (handles edge case)
- Calories rounded to nearest 10 for cleaner display

### Photo Functions
- Image compression uses Canvas API with 80% JPEG quality
- Blob size calculated from blob.size property in bytes
- Default max dimensions: 1280x720 (maintains aspect ratio)

### Time Functions
- Duration and pace use zero-padding for consistent formatting
- Date formatting supports all 7 days of week and 12 months
- Pace special case: returns "—" (em dash) for zero pace values

## Commit

```
commit ed976bd
feat: add GPS, photo, and time utility functions with tests
```

All 6 files committed successfully with complete test coverage.
