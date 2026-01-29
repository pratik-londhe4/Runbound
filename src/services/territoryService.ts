import * as turf from '@turf/turf';
import {Coordinate, Territory, ValidationResult, TerritoryConfig} from '../types';

// Default configuration
export const DEFAULT_CONFIG: TerritoryConfig = {
  minDistance: 100, // 100 meters minimum loop distance
  minArea: 500, // 500 square meters minimum area
  closureThreshold: 20, // start and end must be within 20 meters
  maxSpeed: 10, // 10 m/s (~36 km/h) maximum speed to prevent cheating
  minAccuracy: 50, // GPS accuracy must be better than 50 meters
};

/**
 * Calculate the distance between two coordinates using Turf.js
 */
export function calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
  const from = turf.point([coord1.longitude, coord1.latitude]);
  const to = turf.point([coord2.longitude, coord2.latitude]);
  return turf.distance(from, to, {units: 'meters'});
}

/**
 * Calculate the total distance of a path
 */
export function calculateTotalDistance(coordinates: Coordinate[]): number {
  if (coordinates.length < 2) {
    return 0;
  }

  let totalDistance = 0;
  for (let i = 1; i < coordinates.length; i++) {
    totalDistance += calculateDistance(coordinates[i - 1], coordinates[i]);
  }
  return totalDistance;
}

/**
 * Check if the loop is closed (start and end points are close enough)
 */
export function isLoopClosed(
  coordinates: Coordinate[],
  threshold: number = DEFAULT_CONFIG.closureThreshold,
): boolean {
  if (coordinates.length < 3) {
    return false;
  }

  const start = coordinates[0];
  const end = coordinates[coordinates.length - 1];
  const distance = calculateDistance(start, end);
  
  return distance <= threshold;
}

/**
 * Create a polygon from coordinates
 */
export function createPolygon(coordinates: Coordinate[]): GeoJSON.Polygon | null {
  if (coordinates.length < 3) {
    return null;
  }

  try {
    // Convert coordinates to GeoJSON format [longitude, latitude]
    // Create a copy to avoid mutating the input array
    const points = coordinates.map(coord => [coord.longitude, coord.latitude]);
    
    // Close the polygon if not already closed
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const polygonPoints = 
      firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]
        ? [...points, firstPoint]
        : points;

    // Create polygon
    const polygon = turf.polygon([polygonPoints]);
    return polygon.geometry;
  } catch (error) {
    console.error('Error creating polygon:', error);
    return null;
  }
}

/**
 * Calculate the area of a polygon in square meters
 */
export function calculateArea(polygon: GeoJSON.Polygon): number {
  try {
    const area = turf.area(polygon);
    return area;
  } catch (error) {
    console.error('Error calculating area:', error);
    return 0;
  }
}

/**
 * Check if two polygons overlap
 */
export function doPolygonsOverlap(
  polygon1: GeoJSON.Polygon,
  polygon2: GeoJSON.Polygon,
): boolean {
  try {
    const poly1 = turf.polygon(polygon1.coordinates);
    const poly2 = turf.polygon(polygon2.coordinates);
    const intersection = turf.intersect(poly1, poly2);
    return intersection !== null;
  } catch (error) {
    console.error('Error checking polygon overlap:', error);
    return false;
  }
}

/**
 * Validate GPS accuracy
 */
export function validateGPSAccuracy(
  coordinates: Coordinate[],
  minAccuracy: number = DEFAULT_CONFIG.minAccuracy,
): ValidationResult {
  const invalidPoints = coordinates.filter(coord => coord.accuracy > minAccuracy);
  
  if (invalidPoints.length > 0) {
    return {
      isValid: false,
      reasons: [
        `${invalidPoints.length} points have accuracy worse than ${minAccuracy}m`,
      ],
    };
  }
  
  return {isValid: true, reasons: []};
}

/**
 * Validate speed to prevent cheating (no teleporting)
 */
export function validateSpeed(
  coordinates: Coordinate[],
  maxSpeed: number = DEFAULT_CONFIG.maxSpeed,
): ValidationResult {
  const reasons: string[] = [];
  
  for (let i = 1; i < coordinates.length; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];
    
    const distance = calculateDistance(prev, curr);
    const timeDiff = (curr.timestamp - prev.timestamp) / 1000; // convert to seconds
    
    if (timeDiff > 0) {
      const speed = distance / timeDiff;
      if (speed > maxSpeed) {
        reasons.push(
          `Speed of ${speed.toFixed(2)} m/s exceeds maximum of ${maxSpeed} m/s`,
        );
      }
    }
  }
  
  if (reasons.length > 0) {
    return {isValid: false, reasons};
  }
  
  return {isValid: true, reasons: []};
}

/**
 * Validate a territory claim
 */
export function validateTerritory(
  coordinates: Coordinate[],
  existingTerritories: Territory[] = [],
  config: TerritoryConfig = DEFAULT_CONFIG,
): ValidationResult {
  // Validate config parameters
  if (
    config.minDistance <= 0 ||
    config.minArea <= 0 ||
    config.closureThreshold <= 0 ||
    config.maxSpeed <= 0 ||
    config.minAccuracy <= 0
  ) {
    return {
      isValid: false,
      reasons: ['Invalid configuration: all values must be positive'],
    };
  }

  const reasons: string[] = [];

  // Check minimum number of points
  if (coordinates.length < 3) {
    reasons.push('Need at least 3 GPS points to form a territory');
    return {isValid: false, reasons};
  }

  // Check if loop is closed
  if (!isLoopClosed(coordinates, config.closureThreshold)) {
    reasons.push(
      `Loop not closed. Start and end must be within ${config.closureThreshold}m`,
    );
    return {isValid: false, reasons};
  }

  // Check minimum distance
  const totalDistance = calculateTotalDistance(coordinates);
  if (totalDistance < config.minDistance) {
    reasons.push(
      `Total distance ${totalDistance.toFixed(0)}m is less than minimum ${config.minDistance}m`,
    );
    return {isValid: false, reasons};
  }

  // Create polygon
  const polygon = createPolygon(coordinates);
  if (!polygon) {
    reasons.push('Failed to create valid polygon from coordinates');
    return {isValid: false, reasons};
  }

  // Check minimum area
  const area = calculateArea(polygon);
  if (area < config.minArea) {
    reasons.push(
      `Area ${area.toFixed(0)}m² is less than minimum ${config.minArea}m²`,
    );
    return {isValid: false, reasons};
  }

  // Validate GPS accuracy
  const accuracyValidation = validateGPSAccuracy(coordinates, config.minAccuracy);
  if (!accuracyValidation.isValid) {
    reasons.push(...accuracyValidation.reasons);
    return {isValid: false, reasons};
  }

  // Validate speed (anti-cheat)
  const speedValidation = validateSpeed(coordinates, config.maxSpeed);
  if (!speedValidation.isValid) {
    reasons.push(...speedValidation.reasons);
    return {isValid: false, reasons};
  }

  // Check for overlapping territories
  for (const territory of existingTerritories) {
    if (doPolygonsOverlap(polygon, territory.polygon)) {
      reasons.push('Territory overlaps with existing territory');
      return {isValid: false, reasons};
    }
  }

  return {isValid: true, reasons: []};
}

/**
 * Create a territory from validated coordinates
 */
export function createTerritory(
  coordinates: Coordinate[],
  userId?: string,
): Territory | null {
  const polygon = createPolygon(coordinates);
  if (!polygon) {
    return null;
  }

  const area = calculateArea(polygon);
  const distance = calculateTotalDistance(coordinates);

  return {
    id: `territory_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    coordinates,
    polygon,
    area,
    distance,
    createdAt: Date.now(),
    userId,
  };
}
