# Runbound - Development Setup Guide

This guide will help you set up the development environment for Runbound.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version`

2. **npm** or **yarn**
   - Comes with Node.js
   - Verify: `npm --version`

3. **React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```

### For iOS Development
4. **Xcode** (latest version)
   - Download from Mac App Store
   - Install Command Line Tools: `xcode-select --install`

5. **CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

### For Android Development
6. **Android Studio**
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK (API 33 or higher)
   - Set up Android emulator or connect physical device

7. **Java Development Kit (JDK 11)**
   - Download from [adoptopenjdk.net](https://adoptopenjdk.net/)

8. **Environment Variables** (Android)
   Add to your `~/.bash_profile` or `~/.zshrc`:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

## Installation Steps

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/pratik-londhe4/Runbound.git
cd Runbound

# Install Node modules
npm install
```

### 2. Configure Mapbox

Mapbox is required for map visualization.

1. Create a free account at [mapbox.com](https://www.mapbox.com/)
2. Get your access token from the [account page](https://account.mapbox.com/)
3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and add your token:
   ```
   MAPBOX_ACCESS_TOKEN=your_actual_token_here
   ```
5. Update `src/App.tsx` with your token (temporary for POC):
   ```typescript
   MapboxGL.setAccessToken('YOUR_MAPBOX_TOKEN_HERE');
   ```

### 3. iOS Setup

```bash
# Navigate to iOS directory
cd ios

# Install pods
pod install

# Return to root
cd ..
```

**Important iOS Configuration:**
- Open `ios/Runbound.xcworkspace` (not .xcodeproj) in Xcode
- Select your development team in Signing & Capabilities
- Add location permissions in Info.plist (already included)

### 4. Android Setup

**Configure Mapbox in Android:**

1. Add your Mapbox token to `android/gradle.properties`:
   ```properties
   MAPBOX_DOWNLOADS_TOKEN=your_token_here
   ```

2. Location permissions are already configured in `AndroidManifest.xml`

### 5. Run the Application

**iOS:**
```bash
# Start Metro bundler
npm start

# In a new terminal, run iOS
npm run ios

# Or specify simulator
npx react-native run-ios --simulator="iPhone 14 Pro"
```

**Android:**
```bash
# Start Metro bundler
npm start

# In a new terminal, run Android
npm run android

# Or specify device
adb devices  # List devices
npx react-native run-android --deviceId=DEVICE_ID
```

## Development Workflow

### Project Structure
```
Runbound/
├── src/
│   ├── App.tsx                 # Main app entry
│   ├── screens/               # Screen components
│   ├── components/            # Reusable UI components
│   ├── services/              # Business logic & APIs
│   ├── types/                 # TypeScript definitions
│   ├── utils/                 # Helper functions
│   └── __tests__/            # Test files
├── android/                   # Android native code
├── ios/                       # iOS native code
└── index.js                   # App registration
```

### Available Scripts

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Lint code
npm run lint

# Format code
npm run format

# Type check
npx tsc --noEmit
```

## Testing

### Unit Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test territoryService.test.ts

# Run with coverage
npm test -- --coverage
```

### Manual Testing on Device

**iOS:**
1. Connect iPhone via USB
2. Enable Developer Mode on iPhone (Settings → Privacy & Security)
3. Trust your computer
4. Run: `npm run ios --device="Your iPhone Name"`

**Android:**
1. Enable Developer Options on device (tap Build Number 7 times)
2. Enable USB Debugging
3. Connect device via USB
4. Run: `npm run android`

## Troubleshooting

### Common Issues

**Metro Bundler Issues:**
```bash
# Clear cache and restart
npx react-native start --reset-cache
```

**iOS Pod Install Fails:**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

**Android Build Fails:**
```bash
cd android
./gradlew clean
cd ..
```

**Location Not Working:**
- iOS: Check Info.plist has location permissions
- Android: Check AndroidManifest.xml has permissions
- Simulator: Use Debug → Location → Custom Location in Xcode
- Emulator: Use Extended Controls → Location in Android Studio

**Mapbox Map Not Showing:**
- Verify your access token is correct
- Check internet connection
- iOS: Clean build folder (Cmd+Shift+K in Xcode)
- Android: Check gradle.properties has token

### Debug Mode

**Enable Remote Debugging:**
- iOS: Cmd+D in simulator → Debug
- Android: Cmd+M in emulator → Debug

**React DevTools:**
```bash
npm install -g react-devtools
react-devtools
```

## Performance Testing

### GPS Accuracy Testing
Test in different scenarios:
- Walking slowly
- Running at normal pace
- In urban areas (buildings)
- In open areas
- Indoor vs outdoor

### Territory Validation Testing
Test edge cases:
- Very small loops
- Very large loops
- Irregular shapes
- Crossing paths
- Nearly closed loops

## Code Quality

### Pre-commit Checklist
- [ ] Run tests: `npm test`
- [ ] Lint code: `npm run lint`
- [ ] Format code: `npm run format`
- [ ] Type check: `npx tsc --noEmit`
- [ ] Test on both iOS and Android (if possible)

### Code Style
- Use TypeScript for type safety
- Follow existing patterns in the codebase
- Write tests for new features
- Document complex logic
- Use meaningful variable names

## Debugging Tips

### GPS Service
```typescript
// Add logging to track GPS updates
GPSService.startTracking(
  coordinate => {
    console.log('GPS Update:', coordinate);
    // ... rest of code
  },
  // ...
);
```

### Territory Validation
```typescript
// Log validation results
const validation = validateTerritory(coordinates, territories, config);
console.log('Validation:', validation);
```

### Map Issues
- Check browser console for Mapbox errors
- Verify coordinates are valid [longitude, latitude]
- Ensure polygons are properly closed

## Environment-Specific Notes

### Development
- Use development build for faster iteration
- Enable hot reload for instant updates
- Use console logs liberally

### Production
- Set `__DEV__` to false
- Use production Mapbox token
- Enable ProGuard/R8 (Android)
- Create optimized builds

## Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Mapbox GL React Native](https://github.com/rnmapbox/maps)
- [Turf.js Documentation](https://turfjs.org/)
- [React Native Geolocation](https://github.com/react-native-geolocation/react-native-geolocation)

## Getting Help

If you encounter issues:
1. Check this setup guide
2. Review the troubleshooting section
3. Check React Native documentation
4. Search existing GitHub issues
5. Create a new issue with details

## Next Steps

After setup:
1. Run the app and test basic functionality
2. Try creating a territory by walking a small loop
3. Review the code structure
4. Read the main README.md for feature details
5. Check out the test files for examples
