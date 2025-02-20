import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { db } from "../services/firebaseConfig"; // Firebase import
import { collection, addDoc } from "firebase/firestore";

const AddressValidator = ({ userId }) => {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateAndSaveAddress = async () => {
    if (!street || !city || !state || pincode.length !== 6) {
      setError("Please enter complete address with valid 6-digit pincode.");
      return;
    }

    try {
      // 🔥 API Call to Validate Address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?street=${street}&city=${city}&state=${state}&postalcode=${pincode}&country=India&format=json`
      );
      const data = await response.json();

      if (data.length > 0) {
        setError("");
        
        // 🟢 **Firebase Me Address Store Karna**
        await addDoc(collection(db, "user_addresses"), {
          userId: userId, // User ki ID bhi store kar rahe hain
          street: street,
          city: city,
          state: state,
          pincode: pincode,
          full_address: data[0].display_name, // API ka complete address
          timestamp: new Date()
        });

        setSuccess("✅ Address saved successfully in Firebase!");
      } else {
        setError("Invalid Address! Please enter a valid address.");
      }
    } catch (error) {
      console.error("Error validating address:", error);
      setError("Error checking address. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Street</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Street/Road"
        value={street}
        onChangeText={setStreet}
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter City"
        value={city}
        onChangeText={setCity}
      />

      <Text style={styles.label}>State</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter State"
        value={state}
        onChangeText={setState}
      />

      <Text style={styles.label}>Pincode</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Pincode"
        keyboardType="numeric"
        maxLength={6}
        value={pincode}
        onChangeText={setPincode}
      />

      <Button title="Validate & Save Address" onPress={validateAndSaveAddress} />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: { color: "red", fontSize: 14 },
  success: { color: "green", fontSize: 14 },
});

export default AddressValidator;
