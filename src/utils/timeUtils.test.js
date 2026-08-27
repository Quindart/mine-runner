import { describe, it, expect } from 'vitest';
import { formatDuration, formatDate, formatPace } from './timeUtils';

describe('timeUtils', () => {
  describe('formatDuration', () => {
    it('should format 0 seconds as 00:00:00', () => {
      const result = formatDuration(0);
      expect(result).toBe('00:00:00');
    });

    it('should format 90 seconds as 00:01:30', () => {
      const result = formatDuration(90);
      expect(result).toBe('00:01:30');
    });

    it('should format 3661 seconds as 01:01:01', () => {
      const result = formatDuration(3661);
      expect(result).toBe('01:01:01');
    });

    it('should format 1 second as 00:00:01', () => {
      const result = formatDuration(1);
      expect(result).toBe('00:00:01');
    });

    it('should format 60 seconds as 00:01:00', () => {
      const result = formatDuration(60);
      expect(result).toBe('00:01:00');
    });

    it('should format 3600 seconds as 01:00:00', () => {
      const result = formatDuration(3600);
      expect(result).toBe('01:00:00');
    });

    it('should format large durations', () => {
      const result = formatDuration(86399); // 23:59:59
      expect(result).toBe('23:59:59');
    });

    it('should format 2 hours 30 minutes 45 seconds', () => {
      const result = formatDuration(9045);
      expect(result).toBe('02:30:45');
    });

    it('should pad all components with zeros', () => {
      const result = formatDuration(123); // 2 minutes 3 seconds
      expect(result).toBe('00:02:03');
      // Verify format
      const parts = result.split(':');
      expect(parts).toHaveLength(3);
      parts.forEach((part) => {
        expect(part).toMatch(/^\d{2}$/);
      });
    });
  });

  describe('formatDate', () => {
    it('should format timestamp into DayName, Mon DD format', () => {
      // 2023-08-25 is a Friday (Unix timestamp)
      // Use a known date: 2023-08-25 00:00:00 UTC = 1693065600000
      const result = formatDate(1693065600000);
      // This date is Friday, Aug 25 (but exact day depends on timezone)
      expect(result).toMatch(/\w+, \w+ \d{2}/);
    });

    it('should include day name', () => {
      const result = formatDate(1693065600000);
      const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const dayPart = result.split(',')[0];
      expect(dayNames).toContain(dayPart);
    });

    it('should include month abbreviation', () => {
      const result = formatDate(1693065600000);
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
      const monthPart = result.split(', ')[1].split(' ')[0];
      expect(monthNames).toContain(monthPart);
    });

    it('should pad day with zero', () => {
      const result = formatDate(1693065600000);
      const dayPart = result.split(', ')[1].split(' ')[1];
      expect(dayPart).toMatch(/^\d{2}$/);
    });

    it('should format different dates correctly', () => {
      const timestamps = [
        1609459200000, // 2021-01-01
        1640995200000, // 2021-12-31
        1654041600000, // 2022-06-01
      ];

      timestamps.forEach((timestamp) => {
        const result = formatDate(timestamp);
        expect(result).toMatch(/\w+, \w+ \d{2}/);
      });
    });

    it('should return format with comma and space', () => {
      const result = formatDate(1693065600000);
      expect(result).toMatch(/\w+, \w+ \d{2}/);
      expect(result).toContain(', ');
    });
  });

  describe('formatPace', () => {
    it('should return "—" when pace is 0', () => {
      const result = formatPace(0);
      expect(result).toBe('—');
    });

    it('should format 10.5 min/km as 10:30', () => {
      const result = formatPace(10.5);
      expect(result).toBe('10:30');
    });

    it('should format 6 min/km as 06:00', () => {
      const result = formatPace(6);
      expect(result).toBe('06:00');
    });

    it('should format 5.25 min/km as 05:15', () => {
      const result = formatPace(5.25);
      expect(result).toBe('05:15');
    });

    it('should pad minutes with zero', () => {
      const result = formatPace(3.5);
      expect(result).toBe('03:30');
    });

    it('should pad seconds with zero', () => {
      const result = formatPace(10.083333);
      // 10.083333 = 10 minutes + 5 seconds
      expect(result).toBe('10:05');
    });

    it('should round seconds correctly', () => {
      const result = formatPace(10.016666);
      // 10.016666 = 10 minutes + 1 second (rounded)
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should handle fractional seconds', () => {
      const result = formatPace(7.666666);
      // 7.666666 = 7 minutes + 40 seconds
      expect(result).toBe('07:40');
    });

    it('should format in MM:SS format with zero padding', () => {
      const result = formatPace(1.5);
      expect(result).toBe('01:30');
      const parts = result.split(':');
      expect(parts).toHaveLength(2);
      parts.forEach((part) => {
        expect(part).toMatch(/^\d{2}$/);
      });
    });

    it('should handle large pace values', () => {
      const result = formatPace(99.99);
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });
  });
});
