import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB7B2RbMBBveaTnVFvm8_t14l3AlhPPbag",
    authDomain: "rafi-enterprise-admin.firebaseapp.com",
    projectId: "rafi-enterprise-admin",
    storageBucket: "rafi-enterprise-admin.firebasestorage.app",
    messagingSenderId: "256235080976",
    appId: "1:256235080976:web:25db32f56a32896a092995",
    measurementId: "G-JNCN9FV7VT"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;