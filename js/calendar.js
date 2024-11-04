import { db } from './firebaseConfig.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function() {
    renderCalendar();
});

function renderCalendar() {
    const calendarContainer = document.getElementById("calendar-container");
    calendarContainer.innerHTML = ""; // 캘린더 초기화

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayElement = document.createElement("div");
        dayElement.classList.add("day-cell");
        dayElement.innerHTML = `<strong>${day}일</strong>`;

        // 각 날짜에 점심시간 및 CIP 시간대 추가 및 예약 여부 확인
        ["점심시간", "CIP 1", "CIP 2", "CIP 3"].forEach(slot => {
            const timeSlot = document.createElement("div");
            timeSlot.classList.add("time-slot");
            timeSlot.innerText = slot;
            timeSlot.dataset.date = date;
            timeSlot.dataset.slot = slot;

            // Firestore에서 예약 상태 확인
            checkReservationStatus(date, slot, timeSlot);

            dayElement.appendChild(timeSlot);
        });

        calendarContainer.appendChild(dayElement);
    }
}

async function checkReservationStatus(date, slot, timeSlotElement) {
    // 'room'은 필요 시 특정 방을 지정할 수 있습니다. 모든 방에 대해 예약 상태를 체크할 수 있습니다.
    const rooms = ["roomA", "roomB", "roomC", "roomD"]; // 사용 가능한 방 목록
    let isReserved = false; // 예약 여부 플래그

    for (const room of rooms) {
        const reservationId = `${date}_${slot}_${room}`;
        const reservationRef = doc(db, "reservations", reservationId);

        try {
            const docSnapshot = await getDoc(reservationRef);
            if (docSnapshot.exists() && docSnapshot.data().status) {
                // 예약된 경우
                isReserved = true; // 예약 상태 업데이트
                break; // 이미 예약된 경우 루프 종료
            }
        } catch (error) {
            console.error("Error checking reservation status:", error);
        }
    }

    if (isReserved) {
        timeSlotElement.classList.add("reserved");
        timeSlotElement.innerText += " (예약됨)";
        timeSlotElement.style.cursor = "not-allowed"; // 클릭 불가능
    } else {
        timeSlotElement.classList.add("available");
        timeSlotElement.style.cursor = "pointer"; // 클릭 가능
        timeSlotElement.onclick = () => goToLocationSelection(date, slot); // 클릭 이벤트 추가
    }
}

function goToLocationSelection(date, slot) {
    // 장소 선택 페이지로 이동하고 선택 날짜와 시간대를 URL 파라미터로 전달
    const locationUrl = `locationSelection.html?date=${date}&time=${slot}`;
    window.location.href = locationUrl;
}
