import { describe, it, expect } from 'vitest';
import {
  haversine,
  calculateDistance,
  calculatePace,
  calculateCalories,
} from './gpsUtils';

describe('gpsUtils', () => {
  describe('haversine', () => {
    it('should calculate distance between same coordinates as 0', () => {
      const distance = haversine(0, 0, 0, 0);
      expect(distance).toBe(0);
    });

    it('should calculate distance between two points accurately', () => {
      // New York to Los Angeles (approximately 3935 km)
      const distance = haversine(40.7128, -74.006, 34.0522, -118.2437);
      // Allow some tolerance for rounding
      expect(distance).toBeGreaterThan(3930);
      expect(distance).toBeLessThan(3945);
    });

    it('should handle distance of 1 degree of latitude (approximately 111 km)', () => {
      const distance = haversine(0, 0, 1, 0);
      expect(distance).toBeGreaterThan(110);
      expect(distance).toBeLessThan(112);
    });

    it('should return result rounded to 2 decimals', () => {
      const distance = haversine(40.7128, -74.006, 40.7129, -74.0059);
      // Check that it has at most 2 decimal places
      const decimalPlaces = (distance.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });

  describe('calculateDistance', () => {
    it('should return 0 for empty track', () => {
      const distance = calculateDistance([]);
      expect(distance).toBe(0);
    });

    it('should return 0 for single point', () => {
      const track = [{ lat: 0, lng: 0, timestamp: 0 }];
      const distance = calculateDistance(track);
      expect(distance).toBe(0);
    });

    it('should sum distances between consecutive points', () => {
      const track = [
        { lat: 0, lng: 0, timestamp: 0 },
        { lat: 1, lng: 0, timestamp: 1000 },
        { lat: 2, lng: 0, timestamp: 2000 },
      ];
      const distance = calculateDistance(track);
      // Should be approximately 222 km (2 * ~111 km per degree)
      expect(distance).toBeGreaterThan(220);
      expect(distance).toBeLessThan(224);
    });

    it('should handle null or undefined track', () => {
      expect(calculateDistance(null)).toBe(0);
      expect(calculateDistance(undefined)).toBe(0);
    });
  });

  describe('calculatePace', () => {
    it('should return 0 when distance is 0', () => {
      const pace = calculatePace(0, 3600000);
      expect(pace).toBe(0);
    });

    it('should calculate pace correctly', () => {
      // 10 km in 1 hour (60 minutes) = 6 min/km
      const pace = calculatePace(10, 3600000);
      expect(pace).toBe(6);
    });

    it('should handle fractional distances', () => {
      // 5 km in 30 minutes = 6 min/km
      const pace = calculatePace(5, 1800000);
      expect(pace).toBe(6);
    });

    it('should round to 2 decimals', () => {
      // 3 km in 20 minutes = 6.67 min/km
      const pace = calculatePace(3, 1200000);
      expect(pace).toBe(6.67);
    });

    it('should return 0 for 0 distance even with duration', () => {
      const pace = calculatePace(0, 5000000);
      expect(pace).toBe(0);
    });
  });

  describe('calculateCalories', () => {
    it('should return 0 for 0 distance', () => {
      const calories = calculateCalories(0);
      expect(calories).toBe(0);
    });

    it('should calculate calories as distance * 100, rounded to nearest 10', () => {
      // 10 km = 1000 calories
      const calories = calculateCalories(10);
      expect(calories).toBe(1000);
    });

    it('should round to nearest 10', () => {
      // 5.3 km = 530 calories -> rounded to 530
      const calories = calculateCalories(5.3);
      expect(calories).toBe(530);
    });

    it('should handle fractional distances', () => {
      // 2.5 km = 250 calories
      const calories = calculateCalories(2.5);
      expect(calories).toBe(250);
    });

    it('should round properly with decimals', () => {
      // 1.34 km = 134 calories -> rounded to nearest 10 = 130
      const calories = calculateCalories(1.34);
      expect(calories).toBe(130);
    });

    it('should round 135 up to 140', () => {
      // 1.35 km = 135 calories -> rounded to nearest 10 = 140
      const calories = calculateCalories(1.35);
      expect(calories).toBe(140);
    });
  });
});
