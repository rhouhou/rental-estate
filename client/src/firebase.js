// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "rental-estate-cdf03.firebaseapp.com",
  projectId: "rental-estate-cdf03",
  storageBucket: "rental-estate-cdf03.firebasestorage.app",
  messagingSenderId: "976066560572",
  appId: "1:976066560572:web:e1cb209351e452fa9ff939",
  measurementId: "G-959LB1Z8TT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);