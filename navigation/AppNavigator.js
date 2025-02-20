

import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LandingPage from '../screens/LandingPage';
import ProfileForm from '../screens/ProfileForm';
import Login from "../screens/Login";
import TutorDashboard from "../screens/TutorDashboard";
import StudentDashboard from "../screens/StudentDashboard";
// import Dashboard from "../screens/Dashboard";
import { auth } from "../services/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ActivityIndicator, View, Button } from "react-native";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error: ", error.message);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage" screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="LandingPage" component={LandingPage} />
            <Stack.Screen name="ProfileForm" component={ProfileForm} />
            <Stack.Screen name="Login" component={Login} />
          </>
        ) : user?.role === "student" ? (
          <Stack.Screen name="StudentDashboard">
            {(props) => <StudentDashboard {...props} onLogout={handleLogout} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="TutorDashboard">
            {(props) => <TutorDashboard {...props} onLogout={handleLogout} />}
          </Stack.Screen>
        )}
        {/* <Stack.Screen name="Dashboard" component={Dashboard} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;