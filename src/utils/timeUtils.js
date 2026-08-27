/**
 * Time Utility Functions
 * Provides formatting for durations, dates, and pace values
 */

/**
 * Format seconds into HH:MM:SS format
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string (HH:MM:SS)
 */
export function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [hours, minutes, secs]
    .map((val) => String(val).padStart(2, '0'))
    .join(':');
}

/**
 * Format Unix timestamp into "DayName, Mon DD" format
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date string (e.g., "Monday, Aug 25")
 */
export function formatDate(timestamp) {
  const date = new Date(timestamp);

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const dayName = dayNames[date.getDay()];
  const monthName = monthNames[date.getMonth()];
  const dayOfMonth = String(date.getDate()).padStart(2, '0');

  return `${dayName}, ${monthName} ${dayOfMonth}`;
}

/**
 * Format pace (minutes per kilometer) into MM:SS format
 * @param {number} minPerKm - Pace in minutes per kilometer
 * @returns {string} Formatted pace string (e.g., "10:30" or "—" if zero)
 */
export function formatPace(minPerKm) {
  if (minPerKm === 0) {
    return '—';
  }

  const minutes = Math.floor(minPerKm);
  const seconds = Math.round((minPerKm - minutes) * 60);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
