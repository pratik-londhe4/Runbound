export interface Coordinate {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy: number;
}

export interface Territory {
  id: string;
  coordinates: Coordinate[];
  polygon: GeoJSON.Polygon;
  area: number; // in square meters
  distance: number; // total distance of the loop in meters
  createdAt: number;
  userId?: string;
}

export interface RunSession {
  id: string;
  coordinates: Coordinate[];
  startTime: number;
  endTime?: number;
  isActive: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  reasons: string[];
}

export interface TerritoryConfig {
  minDistance: number; // minimum loop distance in meters
  minArea: number; // minimum area in square meters
  closureThreshold: number; // max distance between start and end to consider loop closed (meters)
  maxSpeed: number; // maximum allowed speed in m/s for anti-cheat
  minAccuracy: number; // minimum GPS accuracy in meters
}
