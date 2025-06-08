// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyAen8SrBB-4446BNQP6onn4Xv__aLQDVVU",
  authDomain: "multi-room-reservation-system.firebaseapp.com",
  projectId: "multi-room-reservation-system",
  storageBucket: "multi-room-reservation-system.appspot.com",
  messagingSenderId: "498301757165",
  appId: "1:498301757165:web:56230ab27bceee46a1cee4",
};

// Firebase 초기화
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// 로그인 상태 확인
firebase.auth().onAuthStateChanged((user) => {
  const loginButton = document.getElementById("loginButton");
  const signupButton = document.getElementById("signupButton");
  const logoutButton = document.getElementById("logoutButton");

  if (user) {
    loginButton.style.display = "none";
    signupButton.style.display = "none";
    logoutButton.style.display = "block";
  } else {
    loginButton.style.display = "block";
    signupButton.style.display = "block";
    logoutButton.style.display = "none";
  }
});

// 버튼 이벤트 리스너
document.getElementById("loginButton").addEventListener("click", () => {
  window.location.href = "login.html";
});

document.getElementById("signupButton").addEventListener("click", () => {
  window.location.href = "signup.html";
});

document.getElementById("logoutButton").addEventListener("click", async () => {
  try {
    await firebase.auth().signOut();
    window.location.href = "index.html";
  } catch (error) {
    console.error("로그아웃 중 오류:", error);
  }
});
