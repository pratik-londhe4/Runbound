import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

interface RunControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
}

const RunControls: React.FC<RunControlsProps> = ({
  isRunning,
  onStart,
  onStop,
}) => {
  return (
    <View style={styles.container}>
      {!isRunning ? (
        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Text style={styles.buttonText}>Start Run</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.stopButton} onPress={onStop}>
          <Text style={styles.buttonText}>Stop & Claim Territory</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  startButton: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stopButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RunControls;
