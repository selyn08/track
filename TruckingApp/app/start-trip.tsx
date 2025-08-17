import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { createTrip } from '../src/api/trips';
import { useRouter } from 'expo-router';

export default function StartTripScreen() {
  const [destination, setDestination] = useState('');
  const [cargo, setCargo] = useState('');
  const [commissionType, setCommissionType] = useState('');
  const router = useRouter();

  const handleStartTrip = async () => {
    try {
      await createTrip({ destination, cargo, commission_type: commissionType });
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start a New Trip</Text>
      <TextInput
        style={styles.input}
        placeholder="Destination"
        value={destination}
        onChangeText={setDestination}
      />
      <TextInput
        style={styles.input}
        placeholder="Cargo"
        value={cargo}
        onChangeText={setCargo}
      />
      <TextInput
        style={styles.input}
        placeholder="Commission Type"
        value={commissionType}
        onChangeText={setCommissionType}
      />
      <Button title="Start Trip" onPress={handleStartTrip} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
