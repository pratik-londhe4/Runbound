import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface StatsDisplayProps {
  distance: number;
  pointCount: number;
  loopClosed: boolean;
  territoriesCount: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  distance,
  pointCount,
  loopClosed,
  territoriesCount,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{distance.toFixed(0)}m</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Points</Text>
          <Text style={styles.statValue}>{pointCount}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Territories</Text>
          <Text style={styles.statValue}>{territoriesCount}</Text>
        </View>
      </View>
      {pointCount > 0 && (
        <View style={styles.statusRow}>
          <Text
            style={[
              styles.statusText,
              loopClosed ? styles.closedStatus : styles.openStatus,
            ]}>
            {loopClosed ? '✓ Loop Closed' : '○ Loop Open'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  closedStatus: {
    color: '#22c55e',
  },
  openStatus: {
    color: '#f59e0b',
  },
});

export default StatsDisplay;
