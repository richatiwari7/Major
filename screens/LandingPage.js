import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';
import { firebase } from "../services/firebaseConfig";  // Make sure the import path is correct


const LandingPage = ({ navigation }) => {
  return (
    <ImageBackground source={require('../assets/landing-background.jpg')} style={styles.container}>
      <Text style={styles.title}>Welcome to our app</Text> 
            <View style={styles.buttonContainer}>
              <Button
                title="Login"
                color="#007BFF"
                 onPress={() => navigation.navigate('Login')} />

              
              <Button
                title="Signup"
                color="#FF6347"
                onPress={() => navigation.navigate('ProfileForm', { role: 'student' })}
              />
            </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
});

export default LandingPage;