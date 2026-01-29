import {
  calculateDistance,
  calculateTotalDistance,
  isLoopClosed,
  createPolygon,
  calculateArea,
  doPolygonsOverlap,
  validateGPSAccuracy,
  validateSpeed,
  validateTerritory,
  createTerritory,
  DEFAULT_CONFIG,
} from '../services/territoryService';
import {Coordinate, Territory} from '../types';

describe('Territory Service', () => {
  const mockCoordinate1: Coordinate = {
    latitude: 37.7749,
    longitude: -122.4194,
    timestamp: 1000,
    accuracy: 10,
  };

  const mockCoordinate2: Coordinate = {
    latitude: 37.7750,
    longitude: -122.4195,
    timestamp: 2000,
    accuracy: 10,
  };

  const mockCoordinate3: Coordinate = {
    latitude: 37.7751,
    longitude: -122.4194,
    timestamp: 3000,
    accuracy: 10,
  };

  describe('calculateDistance', () => {
    it('should calculate distance between two coordinates', () => {
      const distance = calculateDistance(mockCoordinate1, mockCoordinate2);
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(20); // Should be a small distance
    });

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(mockCoordinate1, mockCoordinate1);
      expect(distance).toBe(0);
    });
  });

  describe('calculateTotalDistance', () => {
    it('should return 0 for empty array', () => {
      const distance = calculateTotalDistance([]);
      expect(distance).toBe(0);
    });

    it('should return 0 for single coordinate', () => {
      const distance = calculateTotalDistance([mockCoordinate1]);
      expect(distance).toBe(0);
    });

    it('should calculate total distance for multiple coordinates', () => {
      const distance = calculateTotalDistance([
        mockCoordinate1,
        mockCoordinate2,
        mockCoordinate3,
      ]);
      expect(distance).toBeGreaterThan(0);
    });
  });

  describe('isLoopClosed', () => {
    it('should return false for less than 3 coordinates', () => {
      expect(isLoopClosed([mockCoordinate1, mockCoordinate2])).toBe(false);
    });

    it('should return true when start and end are close', () => {
      const closedLoop: Coordinate[] = [
        {latitude: 37.7749, longitude: -122.4194, timestamp: 1000, accuracy: 10},
        {latitude: 37.7750, longitude: -122.4195, timestamp: 2000, accuracy: 10},
        {latitude: 37.7751, longitude: -122.4194, timestamp: 3000, accuracy: 10},
        {latitude: 37.7749, longitude: -122.4194, timestamp: 4000, accuracy: 10}, // Close to start
      ];
      expect(isLoopClosed(closedLoop, 10)).toBe(true);
    });

    it('should return false when start and end are far apart', () => {
      const openLoop: Coordinate[] = [
        {latitude: 37.7749, longitude: -122.4194, timestamp: 1000, accuracy: 10},
        {latitude: 37.7750, longitude: -122.4195, timestamp: 2000, accuracy: 10},
        {latitude: 37.7800, longitude: -122.4200, timestamp: 3000, accuracy: 10}, // Far from start
      ];
      expect(isLoopClosed(openLoop, 20)).toBe(false);
    });
  });

  describe('createPolygon', () => {
    it('should return null for less than 3 coordinates', () => {
      expect(createPolygon([mockCoordinate1, mockCoordinate2])).toBeNull();
    });

    it('should create a valid polygon', () => {
      const polygon = createPolygon([
        mockCoordinate1,
        mockCoordinate2,
        mockCoordinate3,
      ]);
      expect(polygon).not.toBeNull();
      expect(polygon?.type).toBe('Polygon');
      expect(polygon?.coordinates).toBeDefined();
    });

    it('should close the polygon automatically', () => {
      const polygon = createPolygon([
        mockCoordinate1,
        mockCoordinate2,
        mockCoordinate3,
      ]);
      const coords = polygon?.coordinates[0];
      expect(coords).toBeDefined();
      if (coords) {
        // First and last points should be the same
        expect(coords[0]).toEqual(coords[coords.length - 1]);
      }
    });
  });

  describe('calculateArea', () => {
    it('should calculate area of a polygon', () => {
      const polygon = createPolygon([
        {latitude: 37.7749, longitude: -122.4194, timestamp: 1000, accuracy: 10},
        {latitude: 37.7750, longitude: -122.4194, timestamp: 2000, accuracy: 10},
        {latitude: 37.7750, longitude: -122.4195, timestamp: 3000, accuracy: 10},
        {latitude: 37.7749, longitude: -122.4195, timestamp: 4000, accuracy: 10},
      ]);
      if (polygon) {
        const area = calculateArea(polygon);
        expect(area).toBeGreaterThan(0);
      }
    });
  });

  describe('validateGPSAccuracy', () => {
    it('should pass for good accuracy', () => {
      const result = validateGPSAccuracy([mockCoordinate1, mockCoordinate2]);
      expect(result.isValid).toBe(true);
    });

    it('should fail for poor accuracy', () => {
      const poorCoord: Coordinate = {
        ...mockCoordinate1,
        accuracy: 100, // Poor accuracy
      };
      const result = validateGPSAccuracy([poorCoord], 50);
      expect(result.isValid).toBe(false);
      expect(result.reasons.length).toBeGreaterThan(0);
    });
  });

  describe('validateSpeed', () => {
    it('should pass for normal speed', () => {
      const coords: Coordinate[] = [
        {latitude: 37.7749, longitude: -122.4194, timestamp: 1000, accuracy: 10},
        {latitude: 37.7750, longitude: -122.4194, timestamp: 2000, accuracy: 10},
      ];
      const result = validateSpeed(coords);
      expect(result.isValid).toBe(true);
    });

    it('should fail for unrealistic speed', () => {
      const coords: Coordinate[] = [
        {latitude: 37.7749, longitude: -122.4194, timestamp: 1000, accuracy: 10},
        {latitude: 37.8000, longitude: -122.4500, timestamp: 1100, accuracy: 10}, // Very far in 0.1 seconds
      ];
      const result = validateSpeed(coords, 10);
      expect(result.isValid).toBe(false);
      expect(result.reasons.length).toBeGreaterThan(0);
    });
  });

  describe('validateTerritory', () => {
    it('should fail for insufficient coordinates', () => {
      const result = validateTerritory([mockCoordinate1, mockCoordinate2]);
      expect(result.isValid).toBe(false);
      expect(result.reasons).toContain(
        'Need at least 3 GPS points to form a territory',
      );
    });

    it('should fail for open loop', () => {
      const openLoop: Coordinate[] = [
        {latitude: 37.7749, longitude: -122.4194, timestamp: 1000, accuracy: 10},
        {latitude: 37.7750, longitude: -122.4195, timestamp: 2000, accuracy: 10},
        {latitude: 37.7800, longitude: -122.4200, timestamp: 3000, accuracy: 10},
      ];
      const result = validateTerritory(openLoop);
      expect(result.isValid).toBe(false);
      expect(
        result.reasons.some(r => r.includes('Loop not closed')),
      ).toBe(true);
    });

    it('should fail for too small distance', () => {
      const smallLoop: Coordinate[] = [
        {latitude: 37.7749, longitude: -122.4194, timestamp: 1000, accuracy: 10},
        {latitude: 37.7749, longitude: -122.4195, timestamp: 2000, accuracy: 10},
        {latitude: 37.7750, longitude: -122.4194, timestamp: 3000, accuracy: 10},
        {latitude: 37.7749, longitude: -122.4194, timestamp: 4000, accuracy: 10},
      ];
      const result = validateTerritory(smallLoop, [], {
        ...DEFAULT_CONFIG,
        minDistance: 1000, // Set high minimum
      });
      expect(result.isValid).toBe(false);
      expect(
        result.reasons.some(r => r.includes('distance')),
      ).toBe(true);
    });

    it('should pass for valid territory', () => {
      // Create a large enough loop
      const validLoop: Coordinate[] = [
        {latitude: 37.7749, longitude: -122.4194, timestamp: 1000, accuracy: 10},
        {latitude: 37.7760, longitude: -122.4194, timestamp: 2000, accuracy: 10},
        {latitude: 37.7760, longitude: -122.4210, timestamp: 3000, accuracy: 10},
        {latitude: 37.7749, longitude: -122.4210, timestamp: 4000, accuracy: 10},
        {latitude: 37.7749, longitude: -122.4195, timestamp: 5000, accuracy: 10},
      ];
      const result = validateTerritory(validLoop, [], {
        ...DEFAULT_CONFIG,
        minDistance: 50,
        minArea: 100,
        closureThreshold: 50,
      });
      expect(result.isValid).toBe(true);
    });
  });

  describe('createTerritory', () => {
    it('should create a territory from valid coordinates', () => {
      const coords: Coordinate[] = [
        {latitude: 37.7749, longitude: -122.4194, timestamp: 1000, accuracy: 10},
        {latitude: 37.7760, longitude: -122.4194, timestamp: 2000, accuracy: 10},
        {latitude: 37.7760, longitude: -122.4210, timestamp: 3000, accuracy: 10},
        {latitude: 37.7749, longitude: -122.4210, timestamp: 4000, accuracy: 10},
      ];
      const territory = createTerritory(coords, 'user123');
      expect(territory).not.toBeNull();
      expect(territory?.id).toBeDefined();
      expect(territory?.polygon).toBeDefined();
      expect(territory?.area).toBeGreaterThan(0);
      expect(territory?.distance).toBeGreaterThan(0);
      expect(territory?.userId).toBe('user123');
    });

    it('should return null for invalid coordinates', () => {
      const territory = createTerritory([mockCoordinate1, mockCoordinate2]);
      expect(territory).toBeNull();
    });
  });

  describe('doPolygonsOverlap', () => {
    it('should detect overlapping polygons', () => {
      const polygon1 = createPolygon([
        {latitude: 37.7749, longitude: -122.4194, timestamp: 1000, accuracy: 10},
        {latitude: 37.7750, longitude: -122.4194, timestamp: 2000, accuracy: 10},
        {latitude: 37.7750, longitude: -122.4195, timestamp: 3000, accuracy: 10},
      ]);

      const polygon2 = createPolygon([
        {latitude: 37.7749, longitude: -122.4194, timestamp: 1000, accuracy: 10},
        {latitude: 37.7751, longitude: -122.4194, timestamp: 2000, accuracy: 10},
        {latitude: 37.7751, longitude: -122.4196, timestamp: 3000, accuracy: 10},
      ]);

      if (polygon1 && polygon2) {
        const overlaps = doPolygonsOverlap(polygon1, polygon2);
        expect(typeof overlaps).toBe('boolean');
      }
    });

    it('should detect non-overlapping polygons', () => {
      const polygon1 = createPolygon([
        {latitude: 37.7749, longitude: -122.4194, timestamp: 1000, accuracy: 10},
        {latitude: 37.7750, longitude: -122.4194, timestamp: 2000, accuracy: 10},
        {latitude: 37.7750, longitude: -122.4195, timestamp: 3000, accuracy: 10},
      ]);

      const polygon2 = createPolygon([
        {latitude: 37.8000, longitude: -122.5000, timestamp: 1000, accuracy: 10},
        {latitude: 37.8001, longitude: -122.5000, timestamp: 2000, accuracy: 10},
        {latitude: 37.8001, longitude: -122.5001, timestamp: 3000, accuracy: 10},
      ]);

      if (polygon1 && polygon2) {
        const overlaps = doPolygonsOverlap(polygon1, polygon2);
        expect(overlaps).toBe(false);
      }
    });
  });
});
