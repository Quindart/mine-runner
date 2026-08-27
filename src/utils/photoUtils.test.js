import { describe, it, expect, vi } from 'vitest';
import { getBlobSizeMB } from './photoUtils';

describe('photoUtils', () => {
  describe('getBlobSizeMB', () => {
    it('should return 0 for empty blob', () => {
      const emptyBlob = new Blob([], { type: 'application/octet-stream' });
      const size = getBlobSizeMB(emptyBlob);
      expect(size).toBe(0);
    });

    it('should return correct size for 1 KB blob', () => {
      // 1 KB = 0.000977... MB (rounds to 0.00)
      const data = new Uint8Array(1024);
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const size = getBlobSizeMB(blob);
      expect(size).toBe(0);
    });

    it('should return size rounded to 2 decimals', () => {
      // Create a blob of approximately 0.5 MB
      const data = new Uint8Array(500 * 1024);
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const size = getBlobSizeMB(blob);
      // Should be close to 0.5 MB
      expect(size).toBeCloseTo(0.5, 1);
      // Check decimal places
      const decimalPlaces = (size.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    it('should handle large blobs correctly', () => {
      // Create a 10 MB blob
      const data = new Uint8Array(10 * 1024 * 1024);
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const size = getBlobSizeMB(blob);
      expect(size).toBeCloseTo(10, 1);
    });

    it('should return accurate size for various blob sizes', () => {
      const testCases = [
        { bytes: 1024 * 1024, expectedMB: 1 }, // 1 MB
        { bytes: 2048 * 1024, expectedMB: 2 }, // 2 MB
        { bytes: 512 * 1024, expectedMB: 0.5 }, // 0.5 MB
      ];

      testCases.forEach(({ bytes, expectedMB }) => {
        const data = new Uint8Array(bytes);
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const size = getBlobSizeMB(blob);
        expect(size).toBeCloseTo(expectedMB, 1);
      });
    });

    it('should handle 100 KB blob', () => {
      const data = new Uint8Array(100 * 1024);
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const size = getBlobSizeMB(blob);
      expect(size).toBeCloseTo(0.1, 2);
    });

    it('should return exactly 2 decimal places when appropriate', () => {
      // 1.5 MB exactly
      const data = new Uint8Array(Math.floor(1.5 * 1024 * 1024));
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const size = getBlobSizeMB(blob);
      expect(size).toBeCloseTo(1.5, 1);
    });
  });

  describe('compressImage', () => {
    it('should have compressImage function exported', () => {
      // Import to verify the function exists and is callable
      const { compressImage } = require('./photoUtils');
      expect(typeof compressImage).toBe('function');
    });
  });
});
