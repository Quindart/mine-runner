/**
 * GPS Utility Functions
 * Provides distance and pace calculations for GPS tracking
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point (degrees)
 * @param {number} lng1 - Longitude of first point (degrees)
 * @param {number} lat2 - Latitude of second point (degrees)
 * @param {number} lng2 - Longitude of second point (degrees)
 * @returns {number} Distance in kilometers, rounded to 2 decimals
 */
export function haversine(lat1, lng1, lat2, lng2) {
  // Convert degrees to radians
  const toRad = (deg) => (deg * Math.PI) / 180;

  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);
  const deltaLat = toRad(lat2 - lat1);
  const deltaLng = toRad(lng2 - lng1);

  // Haversine formula: d = 2 * R * asin(sqrt(sin²(Δlat/2) + cos(lat1)*cos(lat2)*sin²(Δlng/2)))
  const sinDeltaLatHalf = Math.sin(deltaLat / 2);
  const sinDeltaLngHalf = Math.sin(deltaLng / 2);

  const a =
    Math.pow(sinDeltaLatHalf, 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.pow(sinDeltaLngHalf, 2);

  const c = 2 * Math.asin(Math.sqrt(a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 100) / 100;
}

/**
 * Calculate total distance of a GPS track
 * @param {Array<{lat: number, lng: number, timestamp: number}>} gpsTrack - Array of GPS points
 * @returns {number} Total distance in kilometers, rounded to 2 decimals
 */
export function calculateDistance(gpsTrack) {
  if (!gpsTrack || gpsTrack.length < 2) {
    return 0;
  }

  let totalDistance = 0;

  for (let i = 0; i < gpsTrack.length - 1; i++) {
    const current = gpsTrack[i];
    const next = gpsTrack[i + 1];

    totalDistance += haversine(
      current.lat,
      current.lng,
      next.lat,
      next.lng
    );
  }

  return Math.round(totalDistance * 100) / 100;
}

/**
 * Calculate pace (minutes per kilometer)
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} durationMs - Duration in milliseconds
 * @returns {number} Pace in minutes per kilometer, rounded to 2 decimals
 */
export function calculatePace(distanceKm, durationMs) {
  if (distanceKm === 0) {
    return 0;
  }

  const durationMinutes = durationMs / 1000 / 60;
  const pace = durationMinutes / distanceKm;

  return Math.round(pace * 100) / 100;
}

/**
 * Estimate calories burned based on distance
 * @param {number} distanceKm - Distance in kilometers
 * @returns {number} Estimated calories, rounded to nearest 10
 */
export function calculateCalories(distanceKm) {
  const calories = distanceKm * 100;
  return Math.round(calories / 10) * 10;
}
