import Geolocation from '@react-native-community/geolocation';
import {Coordinate} from '../types';

export type LocationCallback = (coordinate: Coordinate) => void;
export type ErrorCallback = (error: Error) => void;

/**
 * GPS Tracking Service
 * Handles location tracking for running sessions
 * 
 * Note: This is a singleton service. Only one tracking session
 * can be active at a time. Attempting to start tracking while
 * already active will log a warning and be ignored.
 */
class GPSService {
  private watchId: number | null = null;
  private isTracking = false;

  /**
   * Start tracking GPS location
   */
  startTracking(
    onLocation: LocationCallback,
    onError: ErrorCallback,
    options = {
      enableHighAccuracy: true,
      distanceFilter: 5, // Update every 5 meters
      interval: 1000, // Check every second
      fastestInterval: 500,
    },
  ): void {
    if (this.isTracking) {
      console.warn('GPS tracking is already active');
      return;
    }

    this.watchId = Geolocation.watchPosition(
      position => {
        const coordinate: Coordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
          accuracy: position.coords.accuracy,
        };
        onLocation(coordinate);
      },
      error => {
        onError(new Error(`GPS Error: ${error.message}`));
      },
      options,
    );

    this.isTracking = true;
  }

  /**
   * Stop tracking GPS location
   */
  stopTracking(): void {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isTracking = false;
    }
  }

  /**
   * Get current location once
   */
  getCurrentLocation(
    onLocation: LocationCallback,
    onError: ErrorCallback,
  ): void {
    Geolocation.getCurrentPosition(
      position => {
        const coordinate: Coordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
          accuracy: position.coords.accuracy,
        };
        onLocation(coordinate);
      },
      error => {
        onError(new Error(`GPS Error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }

  /**
   * Check if currently tracking
   */
  getIsTracking(): boolean {
    return this.isTracking;
  }
}

// Export singleton instance
export default new GPSService();
