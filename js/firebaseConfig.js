// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; // Firestore SDK 가져오기

// Firebase 설정 정보
const firebaseConfig = {
  apiKey: "AIzaSyAen8SrBB-4446BNQP6onn4Xv__aLQDVVU",
  authDomain: "multi-room-reservation-system.firebaseapp.com",
  projectId: "multi-room-reservation-system",
  storageBucket: "multi-room-reservation-system.appspot.com",
  messagingSenderId: "498301757165",
  appId: "1:498301757165:web:56230ab27bceee46a1cee4"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore 초기화 및 내보내기
const db = getFirestore(app);

export { db };
