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

        // 각 날짜에 점심시간 및 CIP 시간대 추가
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
    const rooms = ["멀티실 1", "멀티실 2", "멀티실 3", "멀티실 4"];
    let reservedCount = 0; // 예약된 방 개수

    for (const room of rooms) {
        const reservationId = `${date}_${slot}_${room}`;
        const reservationRef = doc(db, "reservations", reservationId);

        try {
            const docSnapshot = await getDoc(reservationRef);
            if (docSnapshot.exists() && docSnapshot.data().status) {
                // 해당 방이 예약된 경우
                reservedCount++;
            }
        } catch (error) {
            console.error("Error checking reservation status:", error);
        }
    }

    if (reservedCount === rooms.length) {
        // 모든 방이 예약된 경우에만 예약 완료로 표시
        timeSlotElement.classList.add("reserved");
        timeSlotElement.innerText += " (모두 예약됨)";
        timeSlotElement.style.cursor = "not-allowed";
    } else {
        // 일부 또는 전체 방이 예약되지 않은 경우 예약 가능 표시
        timeSlotElement.classList.add("available");
        timeSlotElement.style.cursor = "pointer";
        timeSlotElement.onclick = () => goToLocationSelection(date, slot, rooms.filter(room => reservedCount < rooms.length));
    }
}



function goToLocationSelection(date, slot, availableRooms) {
    // 예약 가능한 방 목록을 URL 파라미터로 전달하여 장소 선택 페이지로 이동
    const roomsParam = encodeURIComponent(availableRooms.join(","));
    const locationUrl = `locationSelection.html?date=${date}&time=${slot}&rooms=${roomsParam}`;
    window.location.href = locationUrl;
}
