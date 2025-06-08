// 예약 가능한 실 목록
const availableRooms = {
  "1층": [
    { name: "제1 메이커실", id: "maker1", teacherOnly: false },
    { name: "제2 메이커실", id: "maker2", teacherOnly: false },
    { name: "목공실", id: "woodwork", teacherOnly: true },
    { name: "레이저실", id: "laser", teacherOnly: true },
  ],
  "2층": [
    { name: "실험실", id: "lab", teacherOnly: true },
    { name: "제1 융합실", id: "fusion1", teacherOnly: false },
    { name: "제2 융합실", id: "fusion2", teacherOnly: false },
  ],
  "3층": [
    { name: "AI실", id: "ai", teacherOnly: false, disabled: true },
    { name: "컴퓨터실", id: "computer", teacherOnly: false, disabled: true },
  ],
  "4층": [
    { name: "미디어실 (시청각실)", id: "media", teacherOnly: true },
    { name: "글로벌 라운지", id: "global", teacherOnly: true },
  ],
};

// 현재 선택된 값들
let selectedRoom = null;
let selectedDate = null;
let selectedTime = null;
let currentStep = 1;

// 페이지 초기화
document.addEventListener("DOMContentLoaded", () => {
  initFloorSelection();
  initDateSelection();
  initTimeSelection();
  initReservationConfirmation();
  initNavigation();
});

// 네비게이션 초기화
function initNavigation() {
  const prevStepBtn = document.getElementById("prevStep");
  const nextStepBtn = document.getElementById("nextStep");

  prevStepBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepDisplay();
    }
  });

  nextStepBtn.addEventListener("click", () => {
    if (currentStep < 3) {
      currentStep++;
      updateStepDisplay();
    }
  });
}

// 단계 표시 업데이트
function updateStepDisplay() {
  // 단계 표시 업데이트
  document.querySelectorAll(".step").forEach((step, index) => {
    if (index + 1 === currentStep) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });

  // 섹션 표시 업데이트
  document.getElementById("roomSection").style.display =
    currentStep === 1 ? "block" : "none";
  document.getElementById("dateSection").style.display =
    currentStep === 2 ? "block" : "none";
  document.getElementById("timeSection").style.display =
    currentStep === 3 ? "block" : "none";
  document.querySelector(".reservation-summary").style.display =
    currentStep === 3 ? "block" : "none";

  // 네비게이션 버튼 업데이트
  const prevStepBtn = document.getElementById("prevStep");
  const nextStepBtn = document.getElementById("nextStep");

  prevStepBtn.style.display = currentStep > 1 ? "block" : "none";
  nextStepBtn.disabled = !canProceedToNextStep();
}

// 다음 단계로 진행 가능한지 확인
function canProceedToNextStep() {
  switch (currentStep) {
    case 1:
      return selectedRoom !== null;
    case 2:
      return selectedDate !== null;
    case 3:
      return selectedTime !== null;
    default:
      return false;
  }
}

// 호실 선택 초기화
function initFloorSelection() {
  const roomItems = document.querySelectorAll(".room-item");
  const teacherOnlyMessage = document.getElementById("teacherOnlyMessage");
  const disabledMessage = document.getElementById("disabledMessage");
  const nextStepBtn = document.getElementById("nextStep");

  roomItems.forEach((item) => {
    item.addEventListener("click", () => {
      const roomId = item.dataset.roomId;
      const room = findRoomById(roomId);

      if (!room) return;

      // 이전 선택 제거
      roomItems.forEach((ri) => ri.classList.remove("selected"));

      // 선택된 실이 사용 불가능한 경우
      if (room.disabled) {
        disabledMessage.style.display = "block";
        teacherOnlyMessage.style.display = "none";
        selectedRoom = null;
        nextStepBtn.disabled = true;
        return;
      }

      // 교사 전용 실인 경우
      if (room.teacherOnly) {
        teacherOnlyMessage.style.display = "block";
        disabledMessage.style.display = "none";
        selectedRoom = null;
        nextStepBtn.disabled = true;
        return;
      }

      // 일반 실 선택
      item.classList.add("selected");
      teacherOnlyMessage.style.display = "none";
      disabledMessage.style.display = "none";

      selectedRoom = room;
      updateReservationSummary();
      nextStepBtn.disabled = false;
      updateStepDisplay();
    });
  });
}

// 실 ID로 실 정보 찾기
function findRoomById(roomId) {
  for (const floor in availableRooms) {
    const room = availableRooms[floor].find((r) => r.id === roomId);
    if (room) return room;
  }
  return null;
}

// 날짜 선택 초기화
function initDateSelection() {
  const prevWeekBtn = document.getElementById("prevWeek");
  const nextWeekBtn = document.getElementById("nextWeek");
  const currentWeekSpan = document.getElementById("currentWeek");
  const dateGrid = document.getElementById("dateGrid");
  let currentWeekOffset = 0;

  function renderDates() {
    const dates = getWeekDates(currentWeekOffset);
    currentWeekSpan.textContent = `${formatDate(dates[0])} ~ ${formatDate(
      dates[3]
    )}`;

    dateGrid.innerHTML = dates
      .map(
        (date) => `
      <div class="date-item" data-date="${date.toISOString().split("T")[0]}">
        <span class="date-number">${date.getDate()}</span>
      </div>
    `
      )
      .join("");

    // 날짜 선택 이벤트 리스너
    const dateItems = document.querySelectorAll(".date-item");
    dateItems.forEach((item) => {
      item.addEventListener("click", () => {
        dateItems.forEach((di) => di.classList.remove("selected"));
        item.classList.add("selected");
        selectedDate = item.dataset.date;
        updateReservationSummary();
        updateStepDisplay();
      });
    });
  }

  prevWeekBtn.addEventListener("click", () => {
    currentWeekOffset--;
    renderDates();
  });

  nextWeekBtn.addEventListener("click", () => {
    currentWeekOffset++;
    renderDates();
  });

  // 초기 날짜 렌더링
  renderDates();
}

// 시간 선택 초기화
function initTimeSelection() {
  const timeSlots = document.querySelectorAll(".time-slot");

  timeSlots.forEach((slot) => {
    slot.addEventListener("click", () => {
      timeSlots.forEach((s) => s.classList.remove("selected"));
      slot.classList.add("selected");
      selectedTime = slot.dataset.time;
      updateReservationSummary();
      updateStepDisplay();
    });
  });
}

// 예약 확인 초기화
function initReservationConfirmation() {
  const confirmButton = document.getElementById("confirmReservation");

  confirmButton.addEventListener("click", async () => {
    if (!selectedRoom || !selectedDate || !selectedTime) return;

    try {
      const db = firebase.firestore();
      const user = firebase.auth().currentUser;

      if (!user) {
        alert("로그인이 필요합니다.");
        return;
      }

      // 예약 데이터 생성
      const reservationData = {
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        date: selectedDate,
        timeSlot: selectedTime,
        userId: user.uid,
        userName: user.displayName || user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: "pending",
      };

      // 예약 저장
      await db.collection("reservations").add(reservationData);
      alert("예약이 완료되었습니다.");
      window.location.href = "reservationStatus.html";
    } catch (error) {
      console.error("예약 중 오류 발생:", error);
      alert("예약 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  });
}

// 예약 정보 업데이트
function updateReservationSummary() {
  const roomSpan = document.getElementById("selectedRoom");
  const dateSpan = document.getElementById("selectedDate");
  const timeSpan = document.getElementById("selectedTime");
  const confirmButton = document.getElementById("confirmReservation");

  roomSpan.textContent = selectedRoom ? selectedRoom.name : "-";
  dateSpan.textContent = selectedDate
    ? formatDate(new Date(selectedDate))
    : "-";
  timeSpan.textContent = selectedTime ? getTimeSlotName(selectedTime) : "-";

  // 모든 항목이 선택되었을 때만 예약 버튼 활성화
  confirmButton.disabled = !(selectedRoom && selectedDate && selectedTime);
}

// 주간 날짜 계산
function getWeekDates(offset = 0) {
  const today = new Date();
  const currentDay = today.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + offset * 7);

  const dates = [];
  for (let i = 0; i < 4; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }

  return dates;
}

// 날짜 포맷팅
function formatDate(date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
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
