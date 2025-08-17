import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { Link } from 'expo-router';
import { getAllTrips } from '@/src/api/trips';
import TripCard from '@/src/components/TripCard';
import { useAuth } from '@/src/contexts/AuthContext';

export default function DashboardScreen() {
  const [trips, setTrips] = useState([]);
  const { user } = useAuth();

  const fetchTrips = async () => {
    try {
      const fetchedTrips = await getAllTrips();
      setTrips(fetchedTrips);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const ongoingTrips = trips.filter(trip => !trip.end_time);
  const completedTrips = trips.filter(trip => trip.end_time);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Link href="/start-trip" asChild>
        <Button title="Start New Trip" />
      </Link>

      <Text style={styles.sectionTitle}>Ongoing Trips</Text>
      <FlatList
        data={ongoingTrips}
        renderItem={({ item }) => <TripCard trip={item} onEndTrip={fetchTrips} />}
        keyExtractor={(item) => item.id.toString()}
      />

      <Text style={styles.sectionTitle}>Trip History</Text>
      <FlatList
        data={completedTrips}
        renderItem={({ item }) => <TripCard trip={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
});
