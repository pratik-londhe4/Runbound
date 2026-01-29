import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Alert, Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import MapView from '../components/MapView';
import RunControls from '../components/RunControls';
import StatsDisplay from '../components/StatsDisplay';
import GPSService from '../services/gpsService';
import {
  validateTerritory,
  createTerritory,
  calculateTotalDistance,
  isLoopClosed,
  DEFAULT_CONFIG,
} from '../services/territoryService';
import {Coordinate, RunSession, Territory} from '../types';

const MainScreen = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<RunSession | null>(null);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);

  // Request location permission
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const result = await check(permission);

      if (result !== RESULTS.GRANTED) {
        const requestResult = await request(permission);
        if (requestResult !== RESULTS.GRANTED) {
          Alert.alert(
            'Permission Required',
            'Location permission is required to track your run.',
          );
        }
      }
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const handleStartRun = useCallback(() => {
    const session: RunSession = {
      id: `session_${Date.now()}`,
      coordinates: [],
      startTime: Date.now(),
      isActive: true,
    };

    setCurrentSession(session);
    setIsRunning(true);

    GPSService.startTracking(
      coordinate => {
        setCurrentLocation(coordinate);
        setCurrentSession(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            coordinates: [...prev.coordinates, coordinate],
          };
        });
      },
      error => {
        console.error('GPS tracking error:', error);
        Alert.alert('GPS Error', error.message);
      },
    );
  }, []);

  const handleStopRun = useCallback(() => {
    GPSService.stopTracking();
    setIsRunning(false);

    if (currentSession && currentSession.coordinates.length > 0) {
      const updatedSession = {
        ...currentSession,
        endTime: Date.now(),
        isActive: false,
      };
      setCurrentSession(updatedSession);

      // Check if territory can be claimed
      checkAndClaimTerritory(updatedSession.coordinates);
    }
  }, [currentSession, territories]);

  const checkAndClaimTerritory = (coordinates: Coordinate[]) => {
    // Validate the territory
    const validation = validateTerritory(coordinates, territories, DEFAULT_CONFIG);

    if (validation.isValid) {
      // Create and save the territory
      const territory = createTerritory(coordinates);
      if (territory) {
        setTerritories(prev => [...prev, territory]);
        Alert.alert(
          'Territory Claimed! 🎉',
          `You've claimed ${territory.area.toFixed(0)}m² of territory!\n` +
            `Loop distance: ${territory.distance.toFixed(0)}m`,
          [
            {
              text: 'OK',
              onPress: () => setCurrentSession(null),
            },
          ],
        );
      }
    } else {
      // Show validation errors
      Alert.alert(
        'Cannot Claim Territory',
        validation.reasons.join('\n\n'),
        [
          {
            text: 'OK',
            onPress: () => setCurrentSession(null),
          },
        ],
      );
    }
  };

  // Calculate stats for current session
  const distance =
    currentSession && currentSession.coordinates.length > 0
      ? calculateTotalDistance(currentSession.coordinates)
      : 0;

  const loopClosed =
    currentSession && currentSession.coordinates.length >= 3
      ? isLoopClosed(currentSession.coordinates, DEFAULT_CONFIG.closureThreshold)
      : false;

  return (
    <View style={styles.container}>
      <MapView
        currentLocation={currentLocation}
        currentPath={currentSession?.coordinates || []}
        territories={territories}
        isRunning={isRunning}
      />
      <View style={styles.overlay}>
        <StatsDisplay
          distance={distance}
          pointCount={currentSession?.coordinates.length || 0}
          loopClosed={loopClosed}
          territoriesCount={territories.length}
        />
        <RunControls
          isRunning={isRunning}
          onStart={handleStartRun}
          onStop={handleStopRun}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
});

export default MainScreen;
