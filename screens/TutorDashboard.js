import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { firebase } from "../services/firebaseConfig"; // Import Firebase config

const TutorDashboard = ({ onLogout }) => {
  const [profile, setProfile] = useState({});
  const [studentRequests, setStudentRequests] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [availability, setAvailability] = useState({});
  const [newAvailability, setNewAvailability] = useState({
    Monday: "",
    Wednesday: "",
  });

  // Fetch tutor profile, student requests, enrolled students, and availability
  useEffect(() => {
    const fetchProfile = async () => {
      const user = firebase.auth().currentUser;
      const profileRef = firebase.firestore().collection("tutors").doc(user.uid);
      const profileDoc = await profileRef.get();
      setProfile(profileDoc.data());
    };

    const fetchStudentRequests = async () => {
      const requestsRef = firebase.firestore().collection("studentRequests").where("tutorId", "==", firebase.auth().currentUser.uid);
      const snapshot = await requestsRef.get();
      const requests = snapshot.docs.map(doc => doc.data());
      setStudentRequests(requests);
    };

    const fetchEnrolledStudents = async () => {
      const enrolledRef = firebase.firestore().collection("enrolledStudents").where("tutorId", "==", firebase.auth().currentUser.uid);
      const snapshot = await enrolledRef.get();
      const enrolled = snapshot.docs.map(doc => doc.data());
      setEnrolledStudents(enrolled);
    };

    const fetchAvailability = async () => {
      const availabilityRef = firebase.firestore().collection("availability").doc(firebase.auth().currentUser.uid);
      const availabilityDoc = await availabilityRef.get();
      setAvailability(availabilityDoc.data() || {});
    };

    fetchProfile();
    fetchStudentRequests();
    fetchEnrolledStudents();
    fetchAvailability();
  }, []);

  // Function to update availability
  // Function to update availability
const updateAvailability = () => {
  const tutorRef = firebase.firestore().collection("availability").doc(firebase.auth().currentUser.uid);

  // Log to check newAvailability structure
  console.log('Updating availability:', newAvailability);

  tutorRef.set(newAvailability)
    .then(() => {
      Alert.alert("Availability updated!");
      setAvailability(newAvailability); // Update local state
    })
    .catch((error) => {
      console.error("Error updating availability:", error);
      Alert.alert("Error updating availability", error.message);
    });
};


  // Function to handle student requests
  const handleRequestAction = (requestId, action) => {
    const requestRef = firebase.firestore().collection("studentRequests").doc(requestId);
    if (action === "accept") {
      const enrolledRef = firebase.firestore().collection("enrolledStudents").doc(requestId);
      enrolledRef.set({ ...studentRequests.find((request) => request.id === requestId) })
        .then(() => {
          requestRef.delete();
          Alert.alert("Request Accepted!");
          fetchStudentRequests(); // Refresh student requests
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    } else {
      requestRef.delete()
        .then(() => {
          Alert.alert("Request Rejected!");
          fetchStudentRequests(); // Refresh student requests
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    }
  };

  // Logout function to handle Firebase sign out
  const handleLogout = () => {
    firebase.auth().signOut()
      .then(() => {
        Alert.alert("Logged out successfully!");
        if (onLogout) onLogout(); // Call onLogout prop to notify parent (e.g., navigate to login screen)
      })
      .catch((error) => {
        Alert.alert("Error logging out", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutor Dashboard</Text>

      {/* Profile Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <Text style={styles.profileText}>Name: {profile.name || "Loading..."}</Text>
        <Text style={styles.profileText}>Subject: {profile.subject || "Loading..."}</Text>
      </View>

      {/* Student Requests Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Student Requests</Text>
        {studentRequests.length === 0 ? (
          <Text>No requests at the moment.</Text>
        ) : (
          studentRequests.map((request) => (
            <View key={request.id} style={styles.requestItem}>
              <Text>{request.studentName}</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity onPress={() => handleRequestAction(request.id, "accept")} style={styles.acceptButton}>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRequestAction(request.id, "reject")} style={styles.rejectButton}>
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Enrolled Students Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Enrolled Students</Text>
        {enrolledStudents.length === 0 ? (
          <Text>No enrolled students yet.</Text>
        ) : (
          enrolledStudents.map((student) => <Text key={student.id}>{student.name}</Text>)
        )}
      </View>

      {/* Availability Calendar Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Update Availability</Text>
        <Text style={styles.availabilityLabel}>Monday:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Monday's availability"
          value={newAvailability.Monday}
          onChangeText={(text) => setNewAvailability({ ...newAvailability, Monday: text })}
        />
        <Text style={styles.availabilityLabel}>Wednesday:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Wednesday's availability"
          value={newAvailability.Wednesday}
          onChangeText={(text) => setNewAvailability({ ...newAvailability, Wednesday: text })}
        />
        <TouchableOpacity onPress={updateAvailability} style={styles.updateButton}>
          <Text style={styles.buttonText}>Update Availability</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#444",
  },
  profileText: {
    fontSize: 16,
    marginBottom: 5,
  },
  requestItem: {
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  availabilityLabel: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  updateButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#f44336",
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default TutorDashboard;
