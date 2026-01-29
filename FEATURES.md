# Runbound - Feature Specifications

## Overview
This document provides detailed specifications for all features implemented in the Runbound proof-of-concept.

---

## Feature 1: GPS Tracking

### Description
Real-time GPS location tracking during running sessions with high accuracy settings.

### Technical Implementation
- **Service**: `gpsService.ts`
- **Library**: `@react-native-community/geolocation`
- **Update Frequency**: Every 1 second
- **Distance Filter**: 5 meters (updates only when moved 5m+)
- **Accuracy Mode**: High accuracy enabled

### Configuration
```typescript
{
  enableHighAccuracy: true,
  distanceFilter: 5,        // meters
  interval: 1000,          // milliseconds
  fastestInterval: 500,    // milliseconds
}
```

### User Experience
1. User taps "Start Run"
2. App requests location permission (if not granted)
3. GPS tracking begins
4. Blue dot shows current location on map
5. Path draws in real-time as user moves

### Platform Support
- ✅ iOS: Uses Core Location
- ✅ Android: Uses Fused Location Provider

### Error Handling
- Permission denied: Shows alert, blocks tracking
- GPS unavailable: Shows error message
- Poor accuracy: Points filtered in validation

---

## Feature 2: Territory Claiming

### Description
Users claim territory by running closed loops that meet specific requirements.

### Validation Requirements

#### 2.1 Loop Closure
- **Requirement**: Start and end points within 20 meters
- **Calculation**: Haversine distance formula
- **User Feedback**: "Loop Closed" indicator in stats
- **Failure Message**: "Loop not closed. Start and end must be within 20m"

#### 2.2 Minimum Distance
- **Requirement**: Total loop distance ≥ 100 meters
- **Calculation**: Sum of all GPS segment distances
- **User Feedback**: Distance counter shows progress
- **Failure Message**: "Total distance Xm is less than minimum 100m"

#### 2.3 Minimum Area
- **Requirement**: Enclosed area ≥ 500 square meters
- **Calculation**: Turf.js geodesic area
- **User Feedback**: Area shown in success message
- **Failure Message**: "Area Xm² is less than minimum 500m²"

#### 2.4 GPS Accuracy
- **Requirement**: All points accuracy ≤ 50 meters
- **Purpose**: Ensure reliable data
- **Failure Message**: "N points have accuracy worse than 50m"

#### 2.5 Speed Validation
- **Requirement**: Speed between points ≤ 10 m/s (36 km/h)
- **Purpose**: Anti-cheat, prevent vehicle use
- **Calculation**: distance / time_difference
- **Failure Message**: "Speed of X m/s exceeds maximum of 10 m/s"

#### 2.6 No Overlap
- **Requirement**: New territory cannot overlap existing ones
- **Calculation**: Turf.js polygon intersection
- **Purpose**: Prevent duplicate claims
- **Failure Message**: "Territory overlaps with existing territory"

### Success Flow
```
1. User completes valid loop
2. Taps "Stop & Claim Territory"
3. Validation passes
4. Territory created with unique ID
5. Success alert shows:
   - Area claimed (m²)
   - Loop distance (m)
6. Territory appears on map in green
7. Session resets for next run
```

### Failure Flow
```
1. User taps "Stop & Claim Territory"
2. Validation fails
3. Alert shows all failure reasons
4. User can:
   - Review requirements
   - Try again
5. Session data preserved
```

---

## Feature 3: Map Visualization

### Description
Interactive map showing real-time path, claimed territories, and current location.

### Map Components

#### 3.1 Base Map
- **Provider**: Mapbox GL
- **Style**: Street view
- **Initial Zoom**: Level 14
- **Camera Behavior**: Follows user when running

#### 3.2 Current Location
- **Display**: Blue point annotation
- **Updates**: Real-time with GPS
- **Behavior**: Map centers on location during run

#### 3.3 Running Path
- **Type**: LineString (GeoJSON)
- **Color**: Blue (#3b82f6)
- **Width**: 4 pixels
- **Style**: Rounded caps and joins
- **Updates**: Live as user runs

#### 3.4 Claimed Territories
- **Type**: Polygon (GeoJSON)
- **Fill Color**: Green (#22c55e)
- **Fill Opacity**: 30%
- **Outline Color**: Dark green (#16a34a)
- **Outline Width**: 2 pixels
- **Display**: All territories shown simultaneously

### Map Interactions
- **Pan**: Two-finger drag
- **Zoom**: Pinch gesture
- **Rotate**: Two-finger rotation
- **Auto-follow**: When running, camera follows user

### Performance
- **Rendering**: Hardware-accelerated
- **Data Format**: GeoJSON for efficiency
- **Updates**: Only on coordinate changes

---

## Feature 4: Statistics Display

### Description
Real-time statistics overlay showing run progress and territory count.

### Displayed Metrics

#### 4.1 Distance
- **Format**: "Xm" (under 1000m) or "X.XXkm"
- **Updates**: Real-time during run
- **Calculation**: Total path distance

#### 4.2 Points
- **Display**: Number of GPS coordinates recorded
- **Purpose**: Shows data collection progress
- **Typical**: 1 point per 5 meters moved

#### 4.3 Territories
- **Display**: Total claimed territories count
- **Persistence**: Counts all session territories
- **Color**: Updates to show achievements

#### 4.4 Loop Status
- **States**:
  - "○ Loop Open" (yellow) - Not closed yet
  - "✓ Loop Closed" (green) - Ready to claim
- **Visibility**: Only shows during active run
- **Updates**: Real-time as user approaches start

### UI Design
- **Position**: Bottom of screen, above controls
- **Background**: White with shadow
- **Layout**: Horizontal stats row + status indicator
- **Responsive**: Adjusts to screen size

---

## Feature 5: Run Controls

### Description
Simple start/stop buttons to control running sessions.

### States

#### 5.1 Not Running
- **Button**: "Start Run" (green)
- **Action**: Begins GPS tracking
- **Visual**: Large, prominent button

#### 5.2 Running
- **Button**: "Stop & Claim Territory" (red)
- **Action**: Stops GPS, validates territory
- **Visual**: Large, warning color (red)

### Button Behavior
- **Feedback**: Touch highlight
- **Disabled States**: None (always interactive)
- **Position**: Bottom of screen
- **Size**: Full width with padding

---

## Feature 6: Permissions Management

### Description
Handles location permission requests for iOS and Android.

### Permission Flow

#### iOS
1. Check current permission status
2. If not granted, request permission
3. Show system dialog: "Runbound needs your location..."
4. Handle user response
5. Show custom alert if denied

#### Android
1. Check current permission status
2. If not granted, request ACCESS_FINE_LOCATION
3. Show system dialog with permission explanation
4. Handle user response
5. Show custom alert if denied

### Permission Timing
- **Check**: On app launch (useEffect in MainScreen)
- **Request**: Before first run if needed
- **Re-request**: Manual in settings if denied

### User Messages
- **Request**: "Location permission is required to track your run"
- **Denied**: "Permission Required" alert with explanation

---

## Feature 7: Anti-Cheat System

### Description
Multiple validation layers to ensure fair gameplay.

### Cheat Prevention Measures

#### 7.1 Speed Limiter
- **Maximum**: 10 m/s (36 km/h)
- **Prevents**: Vehicle use, GPS spoofing
- **Detection**: Segment-by-segment speed check
- **Action**: Rejects entire territory if exceeded

#### 7.2 GPS Accuracy Filter
- **Threshold**: 50 meters maximum error
- **Prevents**: Unreliable data, GPS drift
- **Detection**: Per-point accuracy check
- **Action**: Rejects territory if points too inaccurate

#### 7.3 Overlap Prevention
- **Check**: Against all existing territories
- **Prevents**: Re-claiming same area
- **Method**: Turf.js polygon intersection
- **Action**: Rejects overlapping claims

#### 7.4 Physical Constraints
- **Minimum Distance**: Prevents tiny loops
- **Minimum Area**: Ensures meaningful claims
- **Loop Closure**: Validates actual running
- **Purpose**: Maintain game balance

### Future Enhancements
- ML-based pattern detection
- Accelerometer data validation
- Historical path analysis
- Community reporting

---

## Feature 8: Data Structures

### Coordinate Type
```typescript
{
  latitude: number      // GPS latitude
  longitude: number     // GPS longitude
  timestamp: number    // Unix timestamp (ms)
  accuracy: number    // GPS accuracy (meters)
}
```

### Territory Type
```typescript
{
  id: string              // Unique identifier
  coordinates: Coordinate[]  // Original GPS path
  polygon: GeoJSON.Polygon  // Turf.js polygon
  area: number            // Square meters
  distance: number       // Total distance (meters)
  createdAt: number     // Unix timestamp
  userId?: string      // Optional user ID
}
```

### RunSession Type
```typescript
{
  id: string              // Unique identifier
  coordinates: Coordinate[]  // GPS path
  startTime: number       // Unix timestamp
  endTime?: number       // Unix timestamp
  isActive: boolean     // Running state
}
```

---

## Feature 9: Testing Infrastructure

### Test Coverage

#### Unit Tests
- **File**: `territoryService.test.ts`
- **Coverage**: All validation functions
- **Scenarios**:
  - Distance calculations
  - Loop closure detection
  - Area calculations
  - Speed validation
  - Overlap detection
  - Territory creation

#### Test Mocks
- GPS/Geolocation service
- Mapbox components
- React Native modules
- Permission system

#### Running Tests
```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage    # Coverage report
```

---

## Feature 10: Configuration

### Customizable Parameters

All thresholds in `territoryService.ts`:

```typescript
export const DEFAULT_CONFIG: TerritoryConfig = {
  minDistance: 100,        // Adjust minimum loop size
  minArea: 500,           // Adjust minimum area
  closureThreshold: 20,   // Adjust closure tolerance
  maxSpeed: 10,           // Adjust speed limit
  minAccuracy: 50,        // Adjust GPS accuracy
};
```

### Usage
```typescript
// Use custom config
const validation = validateTerritory(
  coordinates, 
  territories, 
  {
    ...DEFAULT_CONFIG,
    minDistance: 200,  // Make it harder
    minArea: 1000,
  }
);
```

---

## Accessibility Features

### Implemented
- Touch targets: Minimum 44x44 points
- Color contrast: WCAG AA compliant
- Clear visual feedback
- Simple, clear messages

### Future Enhancements
- Screen reader support
- Voice announcements
- Haptic feedback
- High contrast mode

---

## Performance Specifications

### Target Metrics
- **GPS Update**: < 100ms processing
- **Map Render**: 60 FPS
- **Validation**: < 500ms for typical path
- **Territory Render**: Instant for < 100 territories

### Memory Usage
- **GPS Points**: ~100 bytes per point
- **Territory**: ~1KB per territory
- **Typical Session**: < 10MB

### Battery Impact
- **GPS Usage**: Moderate (expected for location app)
- **Optimization**: Distance filter reduces updates
- **Background**: Not supported (preserves battery)

---

## Limitations & Known Issues

### Current Limitations
1. **Storage**: In-memory only, lost on restart
2. **Users**: Single-user only, no accounts
3. **Sync**: No cloud backup
4. **Offline**: Requires internet for maps
5. **Background**: No background tracking

### Known Issues
1. GPS accuracy varies by device
2. Urban canyons can cause drift
3. Indoor tracking unreliable
4. First GPS fix can be slow

### Workarounds
1. Use in open areas for best results
2. Wait for GPS signal before starting
3. Close and restart if GPS issues
4. Check phone location settings

---

## Browser/Platform Compatibility

### iOS
- **Minimum**: iOS 13.0+
- **Tested**: iOS 14, 15, 16, 17
- **Devices**: iPhone 8 and newer recommended

### Android
- **Minimum**: Android 7.0 (API 24)
- **Tested**: Android 10, 11, 12, 13
- **Devices**: Devices with GPS recommended

---

## Security Considerations

### Data Privacy
- Location data: Stored locally only
- No external tracking
- No analytics in POC
- User controls all data

### Permissions
- Location: Only when in use
- No background access
- No camera/microphone
- No contacts/calendar

### Future Security
- End-to-end encryption for backend
- Secure authentication
- GDPR compliance
- Data export/deletion

---

## Future Feature Roadmap

### Phase 2
- [ ] User accounts and authentication
- [ ] Backend API integration
- [ ] Persistent storage
- [ ] Territory history

### Phase 3
- [ ] Multiplayer features
- [ ] Territory battles
- [ ] Leaderboards
- [ ] Social sharing

### Phase 4
- [ ] Power-ups and bonuses
- [ ] Territory decay
- [ ] Events and challenges
- [ ] Achievements system

### Phase 5
- [ ] AR visualization
- [ ] Wearable integration
- [ ] Voice commands
- [ ] Advanced analytics
