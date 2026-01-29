import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import MainScreen from './screens/MainScreen';

// Set your Mapbox access token here
// In production, this should come from environment variables
MapboxGL.setAccessToken(
  process.env.MAPBOX_ACCESS_TOKEN || 'pk.YOUR_MAPBOX_TOKEN_HERE',
);

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MainScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
