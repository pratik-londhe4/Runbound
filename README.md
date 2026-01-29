# Runbound 🏃‍♂️📍

A cross-platform (iOS & Android) proof-of-concept running game where users claim territory by running closed loops.

## Overview

Runbound turns running into a territory-claiming game. Users track their GPS path while running, and when they complete a closed loop that meets specific criteria, the enclosed area becomes their territory. All territories are visualized on an interactive map using Mapbox.

## Features

### Core Gameplay
- **GPS Tracking**: Real-time location tracking during running sessions
- **Territory Claiming**: Close loops to claim the enclosed area as your territory
- **Map Visualization**: Interactive map showing:
  - Current running path in blue
  - Claimed territories in green with semi-transparent fill
  - Real-time location marker

### Validation System
Territories must meet the following requirements to be claimed:
- **Loop Closure**: Start and end points must be within 20 meters
- **Minimum Distance**: Loop must be at least 100 meters long
- **Minimum Area**: Enclosed area must be at least 500 square meters
- **GPS Accuracy**: All points must have accuracy better than 50 meters

### Anti-Cheat Measures
- **Speed Validation**: Maximum speed limited to 10 m/s (~36 km/h) to prevent teleporting
- **GPS Accuracy Checks**: Filters out low-accuracy GPS points
- **No Overlapping**: New territories cannot overlap with existing ones

### Real-Time Feedback
- Distance counter showing current loop length
- Point counter tracking GPS data points
- Loop status indicator (open/closed)
- Territory count display

## Technology Stack

- **React Native 0.73**: Cross-platform mobile framework
- **Mapbox GL**: Interactive maps and visualization
- **Turf.js**: Geospatial calculations and polygon operations
- **TypeScript**: Type-safe code
- **Jest**: Unit testing framework

## Project Structure

```
src/
├── App.tsx                    # Main app component
├── screens/
│   └── MainScreen.tsx         # Main screen with map and controls
├── components/
│   ├── MapView.tsx            # Mapbox map component
│   ├── RunControls.tsx        # Start/Stop buttons
│   └── StatsDisplay.tsx       # Stats overlay
├── services/
│   ├── gpsService.ts          # GPS tracking service
│   └── territoryService.ts    # Territory validation and management
├── types/
│   └── index.ts               # TypeScript type definitions
└── __tests__/
    └── territoryService.test.ts # Unit tests
```

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- React Native development environment set up
- Mapbox account and access token

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pratik-londhe4/Runbound.git
cd Runbound
```

2. Install dependencies:
```bash
npm install
```

3. Set up Mapbox token:
   - Create a [Mapbox account](https://www.mapbox.com/)
   - Get your access token
   - Update `src/App.tsx` with your token or set `MAPBOX_ACCESS_TOKEN` environment variable

4. iOS Setup:
```bash
cd ios
pod install
cd ..
```

5. Run the app:

For iOS:
```bash
npm run ios
```

For Android:
```bash
npm run android
```

## Configuration

Default territory validation thresholds can be customized in `src/services/territoryService.ts`:

```typescript
export const DEFAULT_CONFIG: TerritoryConfig = {
  minDistance: 100,        // Minimum loop distance (meters)
  minArea: 500,           // Minimum area (square meters)
  closureThreshold: 20,   // Max distance to close loop (meters)
  maxSpeed: 10,           // Max speed for anti-cheat (m/s)
  minAccuracy: 50,        // Min GPS accuracy (meters)
};
```

## How to Play

1. **Start a Run**: Tap the "Start Run" button to begin GPS tracking
2. **Run Your Loop**: Run in any pattern, creating a closed loop
3. **Monitor Progress**: Watch the real-time stats:
   - Distance traveled
   - Number of GPS points recorded
   - Whether your loop is closed
4. **Claim Territory**: When ready, tap "Stop & Claim Territory"
5. **Validation**: The app validates your loop:
   - ✅ If valid: Territory is claimed and highlighted on the map
   - ❌ If invalid: You'll see specific reasons why

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## API Reference

### Territory Service

Key functions in `src/services/territoryService.ts`:

- `validateTerritory(coordinates, existingTerritories, config)`: Validates if coordinates form a valid territory
- `createTerritory(coordinates, userId)`: Creates a territory object from coordinates
- `calculateDistance(coord1, coord2)`: Calculates distance between two points
- `isLoopClosed(coordinates, threshold)`: Checks if a loop is closed
- `calculateArea(polygon)`: Calculates polygon area in square meters
- `doPolygonsOverlap(polygon1, polygon2)`: Checks if two territories overlap

### GPS Service

Methods in `src/services/gpsService.ts`:

- `startTracking(onLocation, onError, options)`: Start GPS tracking
- `stopTracking()`: Stop GPS tracking
- `getCurrentLocation(onLocation, onError)`: Get current location once

## Limitations & Future Enhancements

### Current Limitations
- Territories are stored in memory only (lost on app restart)
- No multi-user support or backend integration
- No persistence of claimed territories
- Basic anti-cheat measures (can be improved)

### Potential Enhancements
- User authentication and profiles
- Backend API for territory persistence
- Leaderboards and statistics
- Territory battles/challenges
- Social features (share territories, compete with friends)
- Enhanced anti-cheat with ML-based detection
- Offline mode with sync
- Territory decay over time
- Power-ups and special abilities

## Geospatial Calculations

The app uses [Turf.js](https://turfjs.org/) for precise geospatial calculations:

- **Distance**: Haversine formula for accurate GPS distances
- **Area**: Geodesic area calculation for polygons
- **Intersection**: Detects overlapping territories
- **Polygon Creation**: Converts GPS paths to valid GeoJSON polygons

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Mapbox for mapping services
- Turf.js for geospatial operations
- React Native community for the excellent framework