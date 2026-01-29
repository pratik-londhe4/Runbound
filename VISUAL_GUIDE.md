# Visual Guide - Runbound UI

This document describes the visual appearance and user interface of Runbound.

## Main Screen Layout

```
┌─────────────────────────────────────────┐
│          Runbound                       │  ← Status Bar
├─────────────────────────────────────────┤
│                                         │
│                                         │
│          INTERACTIVE MAP                │
│       (Mapbox Street View)              │
│                                         │
│    • Shows current location (blue)      │
│    • Running path (blue line)           │
│    • Territories (green polygons)       │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │    STATS DISPLAY (White Card)    │   │
│  ├─────────────────────────────────┤   │
│  │ Distance  Points    Territories  │   │
│  │   250m      50          2        │   │
│  ├─────────────────────────────────┤   │
│  │    ✓ Loop Closed (Green)        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  [Stop & Claim Territory]       │   │  ← Red Button
│  │         (or)                     │   │
│  │  [Start Run]                     │   │  ← Green Button
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Visual States

### 1. Initial State (Before Starting)
```
┌─────────────────────────────────────────┐
│  Map centered on user location          │
│  No path shown                           │
│  Green button: "Start Run"              │
└─────────────────────────────────────────┘
```

### 2. Running State
```
┌─────────────────────────────────────────┐
│  Map following user                      │
│  Blue line showing path                  │
│  Stats updating in real-time            │
│  Red button: "Stop & Claim Territory"   │
└─────────────────────────────────────────┘
```

### 3. Territory Claimed State
```
┌─────────────────────────────────────────┐
│  Map shows new green polygon             │
│  Success alert displayed                 │
│  Stats reset                             │
│  Green button: "Start Run" (ready again) │
└─────────────────────────────────────────┘
```

## Color Scheme

### Map Colors
- **Running Path**: Blue (#3b82f6) - 4px width
- **Territories**: Green (#22c55e) - 30% opacity fill
- **Territory Border**: Dark Green (#16a34a) - 2px width
- **Current Location**: System blue marker

### UI Colors
- **Start Button**: Green (#22c55e)
- **Stop Button**: Red (#ef4444)
- **Stats Card**: White (#ffffff) with shadow
- **Text (Primary)**: Dark Gray (#1f2937)
- **Text (Secondary)**: Gray (#6b7280)
- **Loop Closed**: Green (#22c55e)
- **Loop Open**: Amber (#f59e0b)

## Stats Display

```
┌─────────────────────────────────────┐
│       Distance  Points  Territories │
│         250m     50        2        │
└─────────────────────────────────────┘
        ↓        ↓         ↓
    Updates    Counts    Total
    live       GPS       claimed
               points    areas
```

### Loop Status Indicator

**When Loop is Open:**
```
○ Loop Open
```
Color: Amber (#f59e0b)

**When Loop is Closed:**
```
✓ Loop Closed
```
Color: Green (#22c55e)

## Map Elements

### Current Location
```
    ●  ← Blue dot with circle
```
Represents user's current GPS position

### Running Path
```
  Start ●────────●
         \      /
          \    /
           \  /
            ●  ← End (near start)
```
Blue line connecting GPS points

### Claimed Territory
```
      ●────────●
      │░░░░░░░░│  ← Green fill (30% opacity)
      │░░░░░░░░│
      │░░░░░░░░│
      ●────────●
```
Green polygon with semi-transparent fill

## User Interactions

### Permission Request Dialog
```
┌─────────────────────────────────────┐
│  "Runbound" Would Like to Access    │
│  Your Location                       │
│                                      │
│  Runbound needs your location to    │
│  track your running path and claim  │
│  territories.                        │
│                                      │
│  [Don't Allow]  [Allow]              │
└─────────────────────────────────────┘
```

### Success Alert
```
┌─────────────────────────────────────┐
│  Territory Claimed! 🎉               │
│                                      │
│  You've claimed 1,250m² of          │
│  territory!                          │
│  Loop distance: 150m                 │
│                                      │
│             [OK]                     │
└─────────────────────────────────────┘
```

### Failure Alert
```
┌─────────────────────────────────────┐
│  Cannot Claim Territory              │
│                                      │
│  • Loop not closed. Start and end   │
│    must be within 20m               │
│  • Total distance 75m is less than  │
│    minimum 100m                      │
│                                      │
│             [OK]                     │
└─────────────────────────────────────┘
```

## Typography

### Fonts
- **Primary**: System default (San Francisco on iOS, Roboto on Android)
- **Button Text**: 18px, Bold
- **Stat Labels**: 12px, Regular
- **Stat Values**: 20px, Bold
- **Alert Title**: 17px, Semibold
- **Alert Body**: 14px, Regular

## Spacing & Layout

### Card Spacing
- Padding: 16px
- Margin: 20px from edges
- Border Radius: 12px
- Shadow: elevation 5

### Button Spacing
- Padding: 16px vertical, full width
- Border Radius: 12px
- Margin: 10px top

## Animations

### Map Camera
- **Transition**: Smooth 1-second animation
- **Zoom Level**: 16 when running
- **Follow Mode**: Active during run

### Stats Update
- **Transition**: Instant update
- **Text**: No animation, direct update

### Territory Reveal
- **Appearance**: Instant display
- **Highlight**: Polygon appears immediately

## Accessibility

### Touch Targets
- **Minimum Size**: 44x44 points
- **Button Height**: 48px
- **Clear Spacing**: 10px between elements

### Color Contrast
- **Text on White**: WCAG AA compliant
- **Button Text**: High contrast on colored backgrounds
- **Status Indicators**: Clear visual distinction

## Responsive Layout

### Portrait Mode (Default)
```
┌──────────┐
│   Map    │
│  (Full)  │
│          │
│ ┌──────┐ │
│ │Stats │ │
│ └──────┘ │
│ ┌──────┐ │
│ │Button│ │
│ └──────┘ │
└──────────┘
```

### Landscape Mode
```
┌────────────────────────┐
│         Map            │
│  (Full screen)         │
│  ┌─────┐   ┌────────┐ │
│  │Stats│   │ Button │ │
│  └─────┘   └────────┘ │
└────────────────────────┘
```

## Loading States

### Initial Load
```
┌─────────────────────────────────────┐
│  Map loading...                      │
│  Waiting for GPS signal...           │
└─────────────────────────────────────┘
```

### Permission Pending
```
┌─────────────────────────────────────┐
│  Requesting location permission...   │
└─────────────────────────────────────┘
```

## Error States

### GPS Error
```
┌─────────────────────────────────────┐
│  GPS Error                           │
│  Unable to access location services  │
│  Please enable location in settings  │
└─────────────────────────────────────┘
```

### Map Load Error
```
┌─────────────────────────────────────┐
│  Map Error                           │
│  Unable to load map                  │
│  Check internet connection           │
└─────────────────────────────────────┘
```

## Platform Differences

### iOS Specific
- System font: San Francisco
- Permission dialog: iOS style
- Navigation bar: iOS standard
- Safe area insets: Respected

### Android Specific
- System font: Roboto
- Permission dialog: Material Design
- Status bar: Android style
- Elevation: Material Design shadows

## Example User Journey

1. **Launch App**
   ```
   See map → Request permission → Allow
   ```

2. **Start Run**
   ```
   Tap green button → Map follows → Path draws
   ```

3. **Monitor Progress**
   ```
   Watch distance → Check loop status → Approach start
   ```

4. **Claim Territory**
   ```
   See "Loop Closed" → Tap red button → Success! 🎉
   ```

5. **View Territory**
   ```
   Green polygon appears → Reset for next run
   ```

## Tips for Best Visual Experience

1. **Good Lighting**: Test outdoors for accurate GPS
2. **Clear Sky**: Better GPS signal in open areas
3. **Full Screen**: Use in landscape for better view
4. **Zoom Level**: Map auto-zooms but can be adjusted
5. **Territory Colors**: Each territory uses same green for consistency

## Screenshot Locations

When taking screenshots to document the app:
- Initial state with map
- Running with path displayed
- Stats card showing live data
- Success alert after claiming
- Multiple territories on map
- Permission dialog
- Settings/configuration

---

*Note: Actual visual appearance may vary slightly based on device, OS version, and screen size.*
