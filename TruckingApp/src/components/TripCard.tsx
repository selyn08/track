import React from 'react';
import { View, Text, StyleSheet, Button, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { endTrip } from '../api/trips';

const TripCard = ({ trip, onEndTrip }) => {
  const isOngoing = !trip.end_time;
  const statusColor = isOngoing ? 'green' : 'blue';

  const handleEndTrip = async () => {
    try {
      await endTrip(trip.id);
      if (onEndTrip) {
        onEndTrip();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.card}>
      <Icon name="car-sport-outline" size={30} color={statusColor} />
      <View style={styles.cardContent}>
        <Text style={styles.destination}>{trip.destination}</Text>
        <Text>{trip.cargo}</Text>
        <Text>Start: {new Date(trip.start_time).toLocaleString()}</Text>
        {trip.end_time && <Text>End: {new Date(trip.end_time).toLocaleString()}</Text>}
        {isOngoing && <Button title="End Trip" onPress={handleEndTrip} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
    alignItems: 'center',
  },
  cardContent: {
    marginLeft: 16,
  },
  destination: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TripCard;
