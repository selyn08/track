import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getDriverProfile, updateDriverProfile } from '@/src/api/drivers';
import { useAuth } from '@/src/contexts/AuthContext';

export default function WorkingHoursScreen() {
  const [workingHours, setWorkingHours] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getDriverProfile();
        setTotalHours(profile.working_hours || 0);
      } catch (error) {
        console.error(error);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleLogHours = async () => {
    try {
      const hours = parseInt(workingHours, 10);
      if (isNaN(hours) || hours <= 0) {
        // Show an alert or some feedback
        return;
      }
      await updateDriverProfile({ working_hours: totalHours + hours });
      setTotalHours(totalHours + hours);
      setWorkingHours('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Working Hours</Text>
      <Text style={styles.totalHours}>Total Hours: {totalHours}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter hours worked"
        value={workingHours}
        onChangeText={setWorkingHours}
        keyboardType="numeric"
      />
      <Button title="Log Hours" onPress={handleLogHours} />
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
  totalHours: {
    fontSize: 20,
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
