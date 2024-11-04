// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAen8SrBB-4446BNQP6onn4Xv__aLQDVVU",
  authDomain: "multi-room-reservation-system.firebaseapp.com",
  projectId: "multi-room-reservation-system",
  storageBucket: "multi-room-reservation-system.appspot.com",
  messagingSenderId: "498301757165",
  appId: "1:498301757165:web:56230ab27bceee46a1cee4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
