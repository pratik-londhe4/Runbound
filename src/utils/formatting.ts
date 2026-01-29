/**
 * Utility functions for formatting and display
 */

/**
 * Format distance in meters to human-readable string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters.toFixed(0)}m`;
  }
  return `${(meters / 1000).toFixed(2)}km`;
}

/**
 * Format area in square meters to human-readable string
 */
export function formatArea(squareMeters: number): string {
  if (squareMeters < 10000) {
    return `${squareMeters.toFixed(0)}m²`;
  }
  return `${(squareMeters / 10000).toFixed(2)} hectares`;
}

/**
 * Format time duration in milliseconds
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Calculate speed in km/h from m/s
 */
export function msToKmh(metersPerSecond: number): number {
  return metersPerSecond * 3.6;
}

/**
 * Generate a random color for territory visualization
 */
export function generateTerritoryColor(index: number): string {
  const colors = [
    '#22c55e', // green
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
  ];
  return colors[index % colors.length];
}
