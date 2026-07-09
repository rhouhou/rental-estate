// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "accounting-app-42de8.firebaseapp.com",
  projectId: "accounting-app-42de8",
  storageBucket: "accounting-app-42de8.firebasestorage.app",
  messagingSenderId: "280626680734",
  appId: "1:280626680734:web:0702f6ed3a3e87d11d3c8f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
