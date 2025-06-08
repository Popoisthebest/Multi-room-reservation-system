// Firebase 초기화
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  orderBy,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 예약 현황 페이지 초기화
document.addEventListener("DOMContentLoaded", async () => {
  await initReservationStatus();
  initRefreshButton();
});

// 새로고침 버튼 초기화
function initRefreshButton() {
  const refreshButton = document.getElementById("refreshButton");
  refreshButton.addEventListener("click", async () => {
    refreshButton.disabled = true;
    refreshButton.style.opacity = "0.7";

    try {
      await initReservationStatus();
    } finally {
      refreshButton.disabled = false;
      refreshButton.style.opacity = "1";
    }
  });
}

// 예약 현황 초기화
async function initReservationStatus() {
  const statusTable = document.getElementById("statusTable");
  const statusTableBody = statusTable.querySelector("tbody");

  try {
    // URL에서 예약 ID 확인
    const urlParams = new URLSearchParams(window.location.search);
    const reservationId = urlParams.get("reservationId");

    // 예약 목록 조회
    let q = query(collection(db, "reservations"), orderBy("createdAt", "desc"));

    // 특정 예약 ID가 있는 경우 해당 예약만 조회
    if (reservationId) {
      q = query(
        collection(db, "reservations"),
        where("__name__", "==", reservationId)
      );
    }

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      statusTableBody.innerHTML = `
        <tr>
          <td colspan="4" class="no-reservations">예약 내역이 없습니다.</td>
        </tr>
      `;
      return;
    }

    // 예약 목록 표시
    statusTableBody.innerHTML = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        const date = new Date(data.date);
        const formattedDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;

        return `
        <tr>
          <td>${data.roomName}</td>
          <td>${formattedDate}</td>
          <td>${getTimeSlotName(data.timeSlot)}</td>
          <td>
            <span class="status-badge status-${data.status}">
              ${getStatusText(data.status)}
            </span>
          </td>
        </tr>
      `;
      })
      .join("");
  } catch (error) {
    console.error("예약 현황 조회 중 오류 발생:", error);
    statusTableBody.innerHTML = `
      <tr>
        <td colspan="4" class="error-message">
          예약 현황을 불러오는 중 오류가 발생했습니다.
        </td>
      </tr>
    `;
  }
}

// 시간대 이름 가져오기
function getTimeSlotName(timeSlot) {
  const timeSlots = {
    lunch: "점심시간 (12:00-13:00)",
    cip1: "CIP1 (13:00-14:00)",
    cip2: "CIP2 (14:00-15:00)",
    cip3: "CIP3 (15:00-16:00)",
  };
  return timeSlots[timeSlot] || timeSlot;
}

// 상태 텍스트 가져오기
function getStatusText(status) {
  const statusTexts = {
    pending: "대기중",
    approved: "승인됨",
    rejected: "거절됨",
    cancelled: "취소됨",
  };
  return statusTexts[status] || status;
}
