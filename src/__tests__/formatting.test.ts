import {
  formatDistance,
  formatArea,
  formatDuration,
  msToKmh,
  generateTerritoryColor,
} from '../utils/formatting';

describe('Formatting Utilities', () => {
  describe('formatDistance', () => {
    it('should format meters for distances under 1000m', () => {
      expect(formatDistance(0)).toBe('0m');
      expect(formatDistance(50)).toBe('50m');
      expect(formatDistance(500)).toBe('500m');
      expect(formatDistance(999)).toBe('999m');
    });

    it('should format kilometers for distances 1000m and above', () => {
      expect(formatDistance(1000)).toBe('1.00km');
      expect(formatDistance(1500)).toBe('1.50km');
      expect(formatDistance(5234)).toBe('5.23km');
      expect(formatDistance(10000)).toBe('10.00km');
    });
  });

  describe('formatArea', () => {
    it('should format square meters for areas under 10000m²', () => {
      expect(formatArea(0)).toBe('0m²');
      expect(formatArea(100)).toBe('100m²');
      expect(formatArea(5000)).toBe('5000m²');
      expect(formatArea(9999)).toBe('9999m²');
    });

    it('should format hectares for areas 10000m² and above', () => {
      expect(formatArea(10000)).toBe('1.00 hectares');
      expect(formatArea(25000)).toBe('2.50 hectares');
      expect(formatArea(100000)).toBe('10.00 hectares');
    });
  });

  describe('formatDuration', () => {
    it('should format seconds only for durations under 1 minute', () => {
      expect(formatDuration(0)).toBe('0s');
      expect(formatDuration(1000)).toBe('1s');
      expect(formatDuration(30000)).toBe('30s');
      expect(formatDuration(59000)).toBe('59s');
    });

    it('should format minutes and seconds for durations under 1 hour', () => {
      expect(formatDuration(60000)).toBe('1m 0s');
      expect(formatDuration(90000)).toBe('1m 30s');
      expect(formatDuration(600000)).toBe('10m 0s');
      expect(formatDuration(3599000)).toBe('59m 59s');
    });

    it('should format hours and minutes for durations 1 hour and above', () => {
      expect(formatDuration(3600000)).toBe('1h 0m');
      expect(formatDuration(3660000)).toBe('1h 1m');
      expect(formatDuration(7200000)).toBe('2h 0m');
      expect(formatDuration(7380000)).toBe('2h 3m');
    });
  });

  describe('msToKmh', () => {
    it('should convert meters per second to kilometers per hour', () => {
      expect(msToKmh(0)).toBe(0);
      expect(msToKmh(1)).toBe(3.6);
      expect(msToKmh(10)).toBe(36);
      expect(msToKmh(27.778)).toBeCloseTo(100, 1);
    });

    it('should handle decimal values', () => {
      expect(msToKmh(5.5)).toBeCloseTo(19.8, 1);
      expect(msToKmh(2.78)).toBeCloseTo(10.008, 2);
    });
  });

  describe('generateTerritoryColor', () => {
    const expectedColors = [
      '#22c55e', // green
      '#3b82f6', // blue
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#14b8a6', // teal
      '#f97316', // orange
    ];

    it('should return correct color for indices 0-7', () => {
      expectedColors.forEach((color, index) => {
        expect(generateTerritoryColor(index)).toBe(color);
      });
    });

    it('should cycle through colors for indices beyond 7', () => {
      expect(generateTerritoryColor(8)).toBe(expectedColors[0]);
      expect(generateTerritoryColor(9)).toBe(expectedColors[1]);
      expect(generateTerritoryColor(15)).toBe(expectedColors[7]);
      expect(generateTerritoryColor(16)).toBe(expectedColors[0]);
    });

    it('should handle large indices', () => {
      expect(generateTerritoryColor(100)).toBe(expectedColors[100 % 8]);
      expect(generateTerritoryColor(1000)).toBe(expectedColors[1000 % 8]);
    });
  });
});
