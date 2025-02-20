import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const StudentDashboard = ({ onLogout }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Dashboard</Text>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <Text>Name: Jane Doe</Text>
        <Text>Grade: 10th</Text>
      </View>

      {/* Find Tutors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Find Tutors</Text>
        <Text>Search for available tutors nearby</Text>
      </View>

      {/* Request Sent Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Request Sent</Text>
        <Text>Request to: Tutor A - Pending</Text>
        <Text>Request to: Tutor B - Accepted</Text>
      </View>

      {/* Logout Button */}
      <Button title="Logout" onPress={onLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default StudentDashboard;
