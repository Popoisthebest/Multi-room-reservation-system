// 선택한 상품 정보를 불러와서 화면에 표시
document.addEventListener("DOMContentLoaded", function () {
  const productInfoContainer = document.getElementById("product-info");
  const selectionData = JSON.parse(
    localStorage.getItem("reservationSelection")
  );

  if (selectionData) {
    const { rooms, date } = selectionData;
    let productInfoHTML = `<p><strong>이용일:</strong> ${date}</p>`;

    for (const room in rooms) {
      productInfoHTML += `
                <p><strong>옵션명:</strong> ${room}</p>
                <p><strong>이용시간:</strong> ${rooms[room].join(", ")}</p>
                <hr>
            `;
    }

    productInfoContainer.innerHTML = productInfoHTML;
  }

  // 학번 입력 필드에 숫자만 입력 가능하도록 설정
  const studentIdInput = document.getElementById("student-id");
  studentIdInput.addEventListener("input", function (e) {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  // 연락처 입력 필드에 숫자만 입력 가능하도록 설정
  const contactMiddle = document.getElementById("contact-middle");
  const contactLast = document.getElementById("contact-last");
  [contactMiddle, contactLast].forEach((input) => {
    input.addEventListener("input", function (e) {
      this.value = this.value.replace(/[^0-9]/g, "");
    });
  });

  // 실시간 유효성 검사 및 피드백
  const form = document.getElementById("reservation-form");
  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateInput(this);
    });
  });
});

// 입력값 유효성 검사 함수들
function validateStudentId(studentId) {
  return /^\d{5}$/.test(studentId);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhoneNumber(middle, last) {
  return /^\d{4}$/.test(middle) && /^\d{4}$/.test(last);
}

function validatePurpose(purpose) {
  return purpose.length >= 10;
}

function validateInput(input) {
  const errorMessage =
    input.parentElement.querySelector(".error-message") ||
    document.createElement("div");
  errorMessage.className = "error-message";

  let isValid = true;
  let message = "";

  switch (input.id) {
    case "student-id":
      isValid = validateStudentId(input.value);
      message = "5자리 숫자만 입력 가능합니다.";
      break;
    case "email":
      isValid = validateEmail(input.value);
      message = "올바른 이메일 형식이 아닙니다.";
      break;
    case "contact-middle":
    case "contact-last":
      const middle = document.getElementById("contact-middle").value;
      const last = document.getElementById("contact-last").value;
      isValid = validatePhoneNumber(middle, last);
      message = "4자리 숫자만 입력 가능합니다.";
      break;
    case "purpose":
      isValid = validatePurpose(input.value);
      message = "사용 목적을 10자 이상 입력해주세요.";
      break;
  }

  if (!isValid) {
    input.classList.add("invalid");
    errorMessage.textContent = message;
    if (!input.parentElement.querySelector(".error-message")) {
      input.parentElement.appendChild(errorMessage);
    }
  } else {
    input.classList.remove("invalid");
    if (input.parentElement.querySelector(".error-message")) {
      input.parentElement.querySelector(".error-message").remove();
    }
  }

  return isValid;
}

// CSRF 토큰 생성
function generateCSRFToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// CSRF 토큰 저장
const csrfToken = generateCSRFToken();
localStorage.setItem("csrfToken", csrfToken);

// 서비스 워커 등록
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/js/service-worker.js")
      .then((registration) => {
        console.log("서비스 워커가 등록되었습니다:", registration.scope);
      })
      .catch((error) => {
        console.error("서비스 워커 등록 실패:", error);
      });
  });
}

// 오프라인 예약 저장
async function saveOfflineReservation(reservationData) {
  const db = await openReservationDB();
  await db.add("offlineReservations", {
    data: reservationData,
    csrfToken: csrfToken,
    timestamp: new Date().toISOString(),
  });

  // 백그라운드 동기화 등록
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register("sync-reservations");
  }
}

// 예약 제출 함수 수정
async function submitReservation(reservationData) {
  const reservationButton = document.querySelector("button[type='submit']");
  reservationButton.disabled = true;
  reservationButton.innerHTML =
    '<span class="loading-spinner"></span> 예약 중...';

  try {
    const db = firebase.firestore();
    const batch = db.batch();

    // 각 방과 시간대별로 예약 데이터 저장
    for (const room in reservationData.rooms) {
      for (const time of reservationData.rooms[room]) {
        const reservationId = `${reservationData.date}_${time}_${room}`;
        const reservationRef = db.collection("reservations").doc(reservationId);

        batch.set(reservationRef, {
          date: reservationData.date,
          time: time,
          room: room,
          status: true,
          customer: {
            club: reservationData.club,
            student: reservationData.student,
            contact: reservationData.contact,
            email: reservationData.email,
            purpose: reservationData.purpose,
          },
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    // 일괄 처리로 모든 예약 저장
    await batch.commit();
    showSuccessMessage("예약이 완료되었습니다!");
  } catch (error) {
    console.error("Firebase 예약 오류:", error);
    showErrorMessage("예약 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
  } finally {
    reservationButton.disabled = false;
    reservationButton.textContent = "예약하기";
    localStorage.removeItem("reservationSelection");
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 2000);
  }
}

// 입력값 sanitization 함수
function sanitizeInput(input) {
  return input
    .replace(/[<>]/g, "") // HTML 태그 제거
    .replace(/javascript:/gi, "") // JavaScript 프로토콜 제거
    .trim();
}

// 예약 폼 제출 이벤트 핸들러 수정
document
  .getElementById("reservation-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // 모든 입력값 유효성 검사
    const inputs = this.querySelectorAll("input, textarea");
    let isValid = true;
    inputs.forEach((input) => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      showErrorMessage("입력값을 확인해주세요.");
      return;
    }

    // 입력값 sanitization
    const reservationData = {
      club: sanitizeInput(document.getElementById("club").value),
      student: `${sanitizeInput(
        document.getElementById("student-id").value
      )} - ${sanitizeInput(document.getElementById("student-name").value)}`,
      contact: `010-${sanitizeInput(
        document.getElementById("contact-middle").value
      )}-${sanitizeInput(document.getElementById("contact-last").value)}`,
      email: sanitizeInput(document.getElementById("email").value),
      purpose: sanitizeInput(document.getElementById("purpose").value),
      ...JSON.parse(localStorage.getItem("reservationSelection")),
    };

    // 예약 정보 미리보기 모달 표시
    createPreviewModal(reservationData);
  });

// 예약 정보 미리보기 모달 생성
function createPreviewModal(reservationData) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
        <div class="modal-content">
            <h2>예약 정보 확인</h2>
            <div class="preview-content">
                <p><strong>이용일:</strong> ${reservationData.date}</p>
                <p><strong>동아리(단체):</strong> ${reservationData.club}</p>
                <p><strong>학번 - 이름:</strong> ${reservationData.student}</p>
                <p><strong>연락처:</strong> ${reservationData.contact}</p>
                <p><strong>이메일:</strong> ${reservationData.email}</p>
                <p><strong>사용 목적:</strong> ${reservationData.purpose}</p>
                <div class="room-preview">
                    <h3>예약할 방 정보</h3>
                    ${Object.entries(reservationData.rooms)
                      .map(
                        ([room, times]) => `
                        <div class="room-info">
                            <p><strong>방 이름:</strong> ${room}</p>
                            <p><strong>이용 시간:</strong> ${times.join(
                              ", "
                            )}</p>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
            <div class="modal-buttons">
                <button type="button" class="confirm-button">예약 확인</button>
                <button type="button" class="cancel-button">수정하기</button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // 모달 닫기 함수
  const closeModal = () => {
    modal.remove();
  };

  // 확인 버튼 이벤트
  modal.querySelector(".confirm-button").addEventListener("click", async () => {
    closeModal();
    await submitReservation(reservationData);
  });

  // 취소 버튼 이벤트
  modal.querySelector(".cancel-button").addEventListener("click", closeModal);

  return modal;
}

async function saveToFirebaseDirectly({
  rooms,
  date,
  club,
  student,
  contact,
  email,
  purpose,
}) {
  const db = firebase.firestore();
  for (const room in rooms) {
    for (const time of rooms[room]) {
      const reservationId = `${date}_${time}_${room}`;
      const reservationRef = db.collection("reservations").doc(reservationId);
      await reservationRef.set({
        date,
        time,
        room,
        status: true,
        customer: { club, student, contact, email, purpose },
      });
    }
  }
}

function showSuccessMessage(message) {
  const toast = document.createElement("div");
  toast.className = "toast success";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function showErrorMessage(message) {
  const toast = document.createElement("div");
  toast.className = "toast error";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// 서비스 워커의 동기화 함수 수정
async function syncReservations() {
  const db = await openReservationDB();
  const offlineReservations = await db.getAll("offlineReservations");

  for (const reservation of offlineReservations) {
    try {
      const firebaseDb = firebase.firestore();
      const batch = firebaseDb.batch();

      for (const room in reservation.data.rooms) {
        for (const time of reservation.data.rooms[room]) {
          const reservationId = `${reservation.data.date}_${time}_${room}`;
          const reservationRef = firebaseDb
            .collection("reservations")
            .doc(reservationId);

          batch.set(reservationRef, {
            date: reservation.data.date,
            time: time,
            room: room,
            status: true,
            customer: {
              club: reservation.data.club,
              student: reservation.data.student,
              contact: reservation.data.contact,
              email: reservation.data.email,
              purpose: reservation.data.purpose,
            },
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
      }

      await batch.commit();
      await db.delete("offlineReservations", reservation.id);
    } catch (error) {
      console.error("예약 동기화 실패:", error);
    }
  }
}
