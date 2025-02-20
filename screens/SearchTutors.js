import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig"; // Ensure correct path

const StudentDashboard = ({ navigation, onLogout }) => {
  const [studentData, setStudentData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        
        const docRef = doc(db, "students", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStudentData(docSnap.data());
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching student data:", error);
        setLoading(false);
      }
    };

    fetchStudentData();

    // Listen for live updates on requests
    const unsubscribe = onSnapshot(
      collection(db, "requests"),
      (snapshot) => {
        const requestList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRequests(requestList);
      },
      (error) => console.error("Error fetching requests:", error)
    );

    return () => unsubscribe(); // Clean up listener
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Student Dashboard</Text>

      {/* Profile Section */}
      {studentData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <Text>Name: {studentData.name}</Text>
          <Text>Grade: {studentData.grade}</Text>
        </View>
      )}

      {/* Find Tutors */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("FindTutors")}>
        <Text style={styles.buttonText}>Find Tutors Nearby</Text>
      </TouchableOpacity>

      {/* Requests Sent */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requests Sent</Text>
        {requests.length > 0 ? (
          requests.map((req) => (
            <Text key={req.id}>
              Request to: {req.tutorName} - {req.status}
            </Text>
          ))
        ) : (
          <Text>No requests sent</Text>
        )}
      </View>

      {/* Upcoming Sessions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
        <Text>📅 No upcoming sessions yet</Text>
      </View>

      {/* Recommended Tutors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Tutors</Text>
        <Text>🔍 AI-based tutor recommendations coming soon!</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#2c3e50",
  },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#34495e",
  },
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StudentDashboard;
