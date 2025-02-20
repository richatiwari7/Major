
import React, { useState } from 'react';
import { 
  View, TextInput, Text, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform 
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebaseConfig'; // Import Firestore DB
import { collection, doc, getDoc } from 'firebase/firestore';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // **Fetch User Role from Firestore**
      const userRef = doc(collection(db, 'users'), user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const role = userData.role; // Assuming "role" field exists in Firestore ("student" or "tutor")

        if (role === 'student') {
          navigation.replace('StudentDashboard'); // Navigate to Student Dashboard
        } else if (role === 'tutor') {
          navigation.replace('TutorDashboard'); // Navigate to Tutor Dashboard
        } else {
          Alert.alert("Error", "Invalid user role.");
        }
      } else {
        Alert.alert("Error", "User data not found.");
      }

    } catch (error) {
      console.error('Firebase Login Error:', error);
      Alert.alert("Login Failed", error.message || "Something went wrong.");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button 
            title="Login" 
            onPress={handleLogin} 
            color="#007BFF"
            disabled={!email || !password} 
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 10,
    width: '100%',
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
  },
});

export default Login;
