
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // ✅ FIXED ERROR
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import AddressValidator from "../components/AddressValidator"; // Import AddressValidator

const ProfileForm = ({ route, navigation }) => {
  const { role } = route.params;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [board10th, setBoard10th] = useState("");
  const [marks10th, setMarks10th] = useState("");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isTutor, setIsTutor] = useState(role === "tutor");

  const indianBoards = ["CBSE", "ICSE", "UP Board", "Other"];

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\d{10}$/.test(phone);
  const isValidPinCode = (pin) => /^\d{6}$/.test(pin);
  const isValidMarks = (marks) => /^\d{1,3}(\.\d{1,2})?$/.test(marks) && marks >= 0 && marks <= 100;
  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleSubmit = async () => {
    if (!name || !phone || !email || !password || !address || !pinCode || !city || !state) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Invalid email format.");
      return;
    }

    if (!isValidPhone(phone)) {
      Alert.alert("Error", "Phone number must be 10 digits.");
      return;
    }

    if (!isValidPinCode(pinCode)) {
      Alert.alert("Error", "Pin code must be exactly 6 digits.");
      return;
    }

    if (!isValidMarks(marks10th)) {
      Alert.alert("Error", "10th marks should be between 0 and 100.");
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert(
        "Error",
        "Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    const isAddressValid = AddressValidator({ address, city, state, pinCode });

    if (!isAddressValid) {
      Alert.alert("Error", "Invalid Address. Please enter a valid address.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const userRef = doc(db, isTutor ? "tutors" : "students", userId);
      await setDoc(userRef, {
        name,
        phone,
        email,
        board10th,
        marks10th,
        address,
        pinCode,
        city,
        state,
        role: isTutor ? "tutor" : "student",
        createdAt: new Date(),
      });

      Alert.alert("Success", "Profile saved successfully!");

      navigation.navigate(isTutor ? "TutorDashboard" : "StudentDashboard", { name, email });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.roleSwitchContainer}>
          <Text style={styles.roleSwitchText}>Student</Text>
          <Switch value={isTutor} onValueChange={() => setIsTutor(!isTutor)} />
          <Text style={styles.roleSwitchText}>Tutor</Text>
        </View>

        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

        <Text style={styles.sectionTitle}>Education</Text>
        <Picker selectedValue={board10th} onValueChange={setBoard10th} style={styles.picker}>
          {indianBoards.map((board) => (
            <Picker.Item key={board} label={board} value={board} />
          ))}
        </Picker>

        <TextInput style={styles.input} placeholder="10th Marks (%)" value={marks10th} onChangeText={setMarks10th} keyboardType="numeric" />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileForm;
