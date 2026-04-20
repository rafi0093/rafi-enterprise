// Firebase core
import { initializeApp } from "firebase/app";

// Firebase services
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB7B2RbMBBveaTnVFvm8_t14l3AlhPPbag",
  authDomain: "rafi-enterprise-admin.firebaseapp.com",
  projectId: "rafi-enterprise-admin",
  storageBucket: "rafi-enterprise-admin.firebasestorage.app",
  messagingSenderId: "256235080976",
  appId: "1:256235080976:web:25db32f56a32896a092995",
  measurementId: "G-JNCN9FV7VT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
