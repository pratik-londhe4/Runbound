# Quick Start Guide - Runbound

Get Runbound running in 5 minutes! 🏃‍♂️

## Prerequisites

Before you start, make sure you have:
- **Node.js 18+** installed ([download here](https://nodejs.org/))
- **React Native development environment** set up
  - For iOS: macOS with Xcode installed
  - For Android: Android Studio with SDK installed

## Installation Steps

### 1. Clone and Install

```bash
git clone https://github.com/pratik-londhe4/Runbound.git
cd Runbound
npm install
```

### 2. Get Mapbox Token

1. Sign up for free at [mapbox.com](https://www.mapbox.com/)
2. Get your access token from your [account page](https://account.mapbox.com/)
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Add your token to `.env`:
   ```
   MAPBOX_ACCESS_TOKEN=your_token_here
   ```
5. **IMPORTANT**: Also update `src/App.tsx` line 10 with your token (temporary for POC)

### 3. Platform Setup

**For iOS:**
```bash
cd ios
pod install
cd ..
```

**For Android:**
- Make sure Android Studio and SDK are installed
- Start an emulator or connect a device

### 4. Run the App

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

## First Run

When you first launch the app:

1. **Grant Location Permission**: Tap "Allow" when prompted
2. **Start Run**: Tap the green "Start Run" button
3. **Run a Loop**: Walk/run in a closed loop
   - Make sure to end close to where you started (within 20m)
   - Minimum loop distance: 100 meters
   - Minimum area: 500 square meters
4. **Claim Territory**: Tap "Stop & Claim Territory"
5. **Success!**: If valid, you'll see your claimed territory on the map

## Testing Without Running

For quick testing, you can simulate a small loop by:

1. Using Xcode location simulation (iOS)
2. Using Android Studio extended controls (Android)
3. Setting custom GPS coordinates

## Troubleshooting

### Map Not Showing
- Check that you added your Mapbox token correctly
- Verify internet connection
- Try restarting the app

### Location Not Working
- Make sure you granted location permission
- Check that location services are enabled on your device
- Try restarting the app

### Build Fails
```bash
# iOS: Clean and rebuild
cd ios && pod install && cd ..
npm run ios

# Android: Clean build
cd android && ./gradlew clean && cd ..
npm run android
```

### Metro Bundler Issues
```bash
npx react-native start --reset-cache
```

## Running Tests

```bash
npm test
```

## Need More Help?

- Check [SETUP.md](SETUP.md) for detailed setup instructions
- Read [README.md](README.md) for feature documentation
- Review [FEATURES.md](FEATURES.md) for specifications

## Key Requirements to Remember

To successfully claim territory, your run must meet:
- ✅ Loop must close (start/end within 20m)
- ✅ Minimum distance: 100 meters
- ✅ Minimum area: 500 square meters
- ✅ GPS accuracy: Better than 50 meters
- ✅ Speed: Under 10 m/s (no vehicles!)
- ✅ No overlapping with existing territories

## What's Next?

After successfully claiming your first territory:
- Try creating multiple territories
- Experiment with different loop shapes
- Check the stats display for real-time feedback
- Review the code to understand how it works

Happy running! 🎉
