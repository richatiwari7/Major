import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
// import LandingPage from "../screens/LandingPage";
import StudentDashboard from "../screens/StudentDashboard";
import ProfileForm from "../screens/ProfileForm";
import { View, Text } from "react-native";
import SearchTutors from "../screens/SearchTutors";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="StudentDashboard" component={StudentDashboard} />
      <Drawer.Screen name="Profile" component={ProfileForm} />
      <Drawer.Screen name="Search Tutors" component={SearchTutors} />

    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
