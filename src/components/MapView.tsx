import React, {useRef, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {Coordinate, Territory} from '../types';

interface MapViewProps {
  currentLocation: Coordinate | null;
  currentPath: Coordinate[];
  territories: Territory[];
  isRunning: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  currentLocation,
  currentPath,
  territories,
  isRunning,
}) => {
  const cameraRef = useRef<MapboxGL.Camera>(null);

  // Follow user location when running
  useEffect(() => {
    if (isRunning && currentLocation && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [currentLocation.longitude, currentLocation.latitude],
        zoomLevel: 16,
        animationDuration: 1000,
      });
    }
  }, [currentLocation, isRunning]);

  // Convert current path to GeoJSON LineString
  const currentPathGeoJSON: GeoJSON.Feature<GeoJSON.LineString> | null =
    currentPath.length > 0
      ? {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: currentPath.map(coord => [
              coord.longitude,
              coord.latitude,
            ]),
          },
        }
      : null;

  // Convert territories to GeoJSON FeatureCollection
  const territoriesGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Polygon> = {
    type: 'FeatureCollection',
    features: territories.map(territory => ({
      type: 'Feature',
      properties: {
        id: territory.id,
        area: territory.area,
        distance: territory.distance,
      },
      geometry: territory.polygon,
    })),
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} styleURL={MapboxGL.StyleURL.Street}>
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={14}
          centerCoordinate={
            currentLocation
              ? [currentLocation.longitude, currentLocation.latitude]
              : [-122.4, 37.8] // Default: San Francisco (fallback when location unavailable)
          }
        />

        {/* Current user location */}
        {currentLocation && (
          <MapboxGL.PointAnnotation
            id="current-location"
            coordinate={[currentLocation.longitude, currentLocation.latitude]}
          />
        )}

        {/* Current running path */}
        {currentPathGeoJSON && (
          <MapboxGL.ShapeSource id="current-path" shape={currentPathGeoJSON}>
            <MapboxGL.LineLayer
              id="current-path-line"
              style={{
                lineColor: '#3b82f6',
                lineWidth: 4,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </MapboxGL.ShapeSource>
        )}

        {/* Claimed territories */}
        {territoriesGeoJSON.features.length > 0 && (
          <MapboxGL.ShapeSource id="territories" shape={territoriesGeoJSON}>
            <MapboxGL.FillLayer
              id="territories-fill"
              style={{
                fillColor: '#22c55e',
                fillOpacity: 0.3,
              }}
            />
            <MapboxGL.LineLayer
              id="territories-outline"
              style={{
                lineColor: '#16a34a',
                lineWidth: 2,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapView;
