// Import Firebase dependencies
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHnPFZq1u9i2mh6bfabaPAhQldFZQxRIo",
  authDomain: "my-tutor-app-32774.firebaseapp.com",
  projectId: "my-tutor-app-32774",
  storageBucket: "my-tutor-app-32774.appspot.com", // FIXED: "appspot.com" hona chahiye
  messagingSenderId: "850509610819",
  appId: "1:850509610819:web:cb6e4929f26cc6673639f6",
};

// / Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication with AsyncStorage (for React Native)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };