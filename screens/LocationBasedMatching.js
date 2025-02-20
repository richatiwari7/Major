// /screens/LocationBasedMatching.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

const LocationBasedMatching = ({ navigation }) => {
  const [location, setLocation] = useState(''); // This can be updated with real location data

  const searchTutors = () => {
    alert('Searching for tutors...');
  };

  const manageSchedule = () => {
    alert('Managing your schedule...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location-Based Matching</Text>
      <Text style={styles.subtitle}>Location: {location || 'Enter your location'}</Text>

      <View style={styles.card}>
        <TouchableOpacity onPress={searchTutors}>
          <Text style={styles.cardText}>Search Tutors</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <TouchableOpacity onPress={manageSchedule}>
          <Text style={styles.cardText}>Manage Your Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
    color: '#777',
  },
  card: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  cardText: {
    color: 'white',
    fontSize: 18,
  },
});

export default LocationBasedMatching;
