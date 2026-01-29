# Runbound Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Native App                         │
│                           (Cross-Platform)                       │
└─────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
        ┌───────────▼──────┐  ┌──▼────────┐  ┌▼────────────┐
        │   UI Layer       │  │ Services  │  │  External   │
        │  (Components)    │  │  Layer    │  │   APIs      │
        └──────────────────┘  └───────────┘  └─────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
        ┌───────────▼──────┐  ┌──▼────────┐  ┌▼────────────┐
        │ GPS Service      │  │ Territory │  │ Mapbox GL   │
        │ (Location Track) │  │ Service   │  │ (Maps API)  │
        └──────────────────┘  └───────────┘  └─────────────┘
                                  │
                          ┌───────▼────────┐
                          │   Turf.js      │
                          │  (Geospatial)  │
                          └────────────────┘
```

## Component Hierarchy

```
App (Root)
│
└─── MainScreen
     │
     ├─── MapView (Mapbox Integration)
     │    ├─── Current Location Marker
     │    ├─── Running Path (LineString)
     │    └─── Territories (Polygons)
     │
     ├─── StatsDisplay
     │    ├─── Distance Counter
     │    ├─── Point Counter
     │    ├─── Loop Status
     │    └─── Territory Count
     │
     └─── RunControls
          ├─── Start Run Button
          └─── Stop & Claim Button
```

## Data Flow

### 1. Starting a Run
```
User Taps "Start" 
  → MainScreen.handleStartRun()
    → GPSService.startTracking()
      → Geolocation.watchPosition()
        → On each GPS update:
          → Update currentLocation
          → Add to session.coordinates[]
          → Re-render map with new path
```

### 2. Territory Claiming Process
```
User Taps "Stop & Claim"
  → MainScreen.handleStopRun()
    → GPSService.stopTracking()
    → checkAndClaimTerritory()
      → validateTerritory()
        ├─ Check: Loop closed?
        ├─ Check: Minimum distance?
        ├─ Check: Minimum area?
        ├─ Check: GPS accuracy?
        ├─ Check: Speed validation?
        └─ Check: No overlap?
      → If valid:
        → createTerritory()
        → Add to territories[]
        → Show success alert
      → If invalid:
        → Show error reasons
```

## Key Services

### GPS Service (gpsService.ts)
- **Purpose**: Manage device location tracking
- **Key Methods**:
  - `startTracking()`: Begin GPS monitoring
  - `stopTracking()`: End GPS monitoring
  - `getCurrentLocation()`: One-time location fetch
- **Technology**: @react-native-community/geolocation

### Territory Service (territoryService.ts)
- **Purpose**: Validate and manage territories
- **Key Functions**:
  - `validateTerritory()`: Check all territory requirements
  - `createTerritory()`: Generate territory object
  - `calculateDistance()`: GPS point distance
  - `calculateArea()`: Polygon area calculation
  - `isLoopClosed()`: Check start/end proximity
  - `doPolygonsOverlap()`: Detect conflicts
- **Technology**: Turf.js for geospatial math

## Validation Pipeline

```
GPS Coordinates Array
      │
      ├─► Step 1: Minimum Points (>= 3)
      │           FAIL → "Need at least 3 GPS points"
      │
      ├─► Step 2: Loop Closure Check
      │           distance(start, end) <= 20m
      │           FAIL → "Loop not closed"
      │
      ├─► Step 3: Distance Validation
      │           total_distance >= 100m
      │           FAIL → "Distance too small"
      │
      ├─► Step 4: Polygon Creation
      │           Turf.polygon(coordinates)
      │           FAIL → "Invalid polygon"
      │
      ├─► Step 5: Area Validation
      │           area >= 500m²
      │           FAIL → "Area too small"
      │
      ├─► Step 6: GPS Accuracy Check
      │           all accuracy <= 50m
      │           FAIL → "Poor GPS accuracy"
      │
      ├─► Step 7: Speed Validation (Anti-cheat)
      │           all speeds <= 10 m/s
      │           FAIL → "Speed too high"
      │
      └─► Step 8: Overlap Detection
                  no intersection with existing territories
                  FAIL → "Territory overlaps"
                  
      SUCCESS → Territory Claimed! 🎉
```

## Technology Stack Details

### Frontend Framework
- **React Native 0.73**: Cross-platform mobile development
- **TypeScript**: Static typing for reliability
- **React Hooks**: Modern state management

### Mapping
- **Mapbox GL**: Vector maps with custom styling
- **@rnmapbox/maps**: React Native Mapbox bindings
- **Features Used**:
  - MapView with Street style
  - PointAnnotation for location
  - ShapeSource + LineLayer for paths
  - ShapeSource + FillLayer for territories

### Geospatial Computing
- **Turf.js**: Advanced geospatial operations
- **Functions Used**:
  - `turf.distance()`: Haversine distance
  - `turf.polygon()`: Polygon creation
  - `turf.area()`: Geodesic area calculation
  - `turf.intersect()`: Overlap detection

### Location Services
- **@react-native-community/geolocation**: GPS tracking
- **react-native-permissions**: Location permission handling
- **Configuration**: High accuracy, 5m distance filter

### Testing
- **Jest**: Unit testing framework
- **React Native Testing Library**: Component testing
- **Coverage**: Core business logic

## Configuration Constants

```typescript
DEFAULT_CONFIG = {
  minDistance: 100,        // meters
  minArea: 500,           // square meters
  closureThreshold: 20,   // meters
  maxSpeed: 10,           // m/s (~36 km/h)
  minAccuracy: 50,        // meters
}
```

## State Management

### MainScreen State
```typescript
- isRunning: boolean              // Track if run is active
- currentSession: RunSession      // Active running session
- territories: Territory[]        // All claimed territories
- currentLocation: Coordinate     // Latest GPS position
```

### RunSession Structure
```typescript
{
  id: string
  coordinates: Coordinate[]       // GPS path
  startTime: number              // Unix timestamp
  endTime?: number              // Unix timestamp
  isActive: boolean
}
```

### Territory Structure
```typescript
{
  id: string
  coordinates: Coordinate[]      // Original GPS path
  polygon: GeoJSON.Polygon      // Turf.js polygon
  area: number                  // Square meters
  distance: number             // Total loop distance
  createdAt: number           // Unix timestamp
  userId?: string            // Optional user ID
}
```

## Security & Anti-Cheat Measures

1. **Speed Validation**
   - Maximum 10 m/s (36 km/h)
   - Checks each segment
   - Prevents teleporting/vehicle use

2. **GPS Accuracy Filtering**
   - Minimum 50m accuracy required
   - Filters noisy/unreliable data
   - Improves territory quality

3. **Overlap Prevention**
   - Uses Turf.js intersection detection
   - Prevents claiming same area twice
   - Maintains fair gameplay

4. **Physical Constraints**
   - Minimum distance: 100m
   - Minimum area: 500m²
   - Loop closure: 20m max gap

## Performance Considerations

### Optimization Strategies
1. **GPS Updates**: 5m distance filter reduces redundant points
2. **Map Rendering**: GeoJSON for efficient polygon rendering
3. **Memory**: In-memory storage for POC (scalable to database)
4. **Computation**: Turf.js runs on device (no server required)

### Scalability Notes
- Current: Client-side only
- Future: Backend API for:
  - Multi-user support
  - Persistent storage
  - Real-time updates
  - Leaderboards

## Platform-Specific Notes

### iOS
- Location permission: NSLocationWhenInUseUsageDescription
- Maps: Mapbox token in Info.plist
- Testing: Xcode location simulation

### Android
- Location permission: ACCESS_FINE_LOCATION
- Maps: Mapbox token in gradle.properties
- Testing: Android Studio location mock

## Future Architecture Enhancements

### Planned Additions
1. **Backend Integration**
   - REST API for territory sync
   - User authentication
   - Real-time updates (WebSocket)

2. **Offline Support**
   - Local SQLite storage
   - Background sync
   - Cached map tiles

3. **Advanced Features**
   - Territory battles
   - Social features
   - Achievements system
   - ML-based cheat detection

### Scalability Path
```
Current: Mobile App (Client-Side)
    ↓
Phase 2: + Backend API + Database
    ↓
Phase 3: + Real-time Features + Caching
    ↓
Phase 4: + ML Services + Analytics
```
