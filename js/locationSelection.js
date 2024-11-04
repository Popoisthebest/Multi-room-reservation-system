import { db } from './js/firebaseConfig.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

let selectedRooms = {}; // 선택된 방과 시간대를 저장하는 객체

document.addEventListener("DOMContentLoaded", function() {
    loadRooms();
});

function toggleRoom(room) {
    const roomCheckbox = document.querySelector(`.room-checkbox[data-room="${room}"]`);
    const timeSlotsContainer = document.querySelector(`.time-slots[data-room="${room}"]`);
    const date = new URLSearchParams(window.location.search).get("date");

    if (roomCheckbox && timeSlotsContainer) {
        if (roomCheckbox.checked) {
            selectedRooms[room] = []; // 방 선택 시 초기화
            loadTimeSlots(date, room, timeSlotsContainer);
        } else {
            delete selectedRooms[room]; // 방 선택 해제 시 제거
            timeSlotsContainer.innerHTML = ""; // 체크 해제 시 시간 슬롯 초기화
            updateReservationSummary(); // 요약 갱신
        }
    } else {
        console.error(`Element with data-room="${room}" not found.`);
    }
}

async function loadRooms() {
    const rooms = ["roomA", "roomB", "roomC", "roomD"];
    rooms.forEach(room => {
        const roomCheckbox = document.querySelector(`.room-checkbox[data-room="${room}"]`);
        if (roomCheckbox) {
            roomCheckbox.addEventListener("change", () => toggleRoom(room));
        } else {
            console.error(`Checkbox for room "${room}" not found.`);
        }
    });
}

async function loadTimeSlots(date, room, container) {
    const times = ["점심시간", "CIP 1", "CIP 2", "CIP 3"];
    
    container.innerHTML = ""; // 초기화
    times.forEach(async time => {
        const reservationId = `${date}_${time}_${room}`;
        const reservationRef = doc(db, "reservations", reservationId);
        const timeSlot = document.createElement("button");
        timeSlot.classList.add("time-slot");
        timeSlot.innerText = time;

        try {
            const docSnapshot = await getDoc(reservationRef);
            if (docSnapshot.exists() && docSnapshot.data().status) {
                // 예약된 시간
                timeSlot.classList.add("reserved");
                timeSlot.disabled = true;
            } else {
                // 예약 가능한 시간
                timeSlot.classList.add("available");
                timeSlot.onclick = () => toggleTimeSlot(room, time, timeSlot);
            }
        } catch (error) {
            console.error("Error loading reservation status:", error);
        }

        container.appendChild(timeSlot);
    });
}

function toggleTimeSlot(room, time, timeSlotElement) {
    if (selectedRooms[room].includes(time)) {
        // 시간대가 이미 선택된 경우 제거
        selectedRooms[room] = selectedRooms[room].filter(t => t !== time);
        timeSlotElement.classList.remove("selected");
    } else {
        // 새로운 시간대 추가
        selectedRooms[room].push(time);
        timeSlotElement.classList.add("selected");
    }
    updateReservationSummary();
}

function updateReservationSummary() {
    const reservationDetails = document.getElementById("reservation-details");
    reservationDetails.innerHTML = ""; // 기존 내용을 초기화

    Object.keys(selectedRooms).forEach(room => {
        const roomDiv = document.createElement("div");
        roomDiv.classList.add("selected-room");
        roomDiv.innerHTML = `<strong>${room}</strong>: ${selectedRooms[room].join(", ")}`;
        reservationDetails.appendChild(roomDiv);
    });
}

// submitReservations 함수를 window 객체에 할당하여 HTML에서 직접 접근 가능하게 함
window.submitReservations = async function submitReservations() {
    const date = new URLSearchParams(window.location.search).get("date");

    if (Object.keys(selectedRooms).length === 0) {
        alert("방과 시간을 선택해 주세요.");
        return;
    }

    // Firestore에 각 선택된 방과 시간 저장
    for (const room in selectedRooms) {
        for (const time of selectedRooms[room]) {
            const reservationId = `${date}_${time}_${room}`;
            const reservationRef = doc(db, "reservations", reservationId);
            const reservationData = {
                date: date,
                time: time,
                room: room,
                status: true
            };

            try {
                await setDoc(reservationRef, reservationData);
                console.log(`예약 완료: ${reservationId}`);
            } catch (error) {
                console.error("예약 저장 오류:", error);
            }
        }
    }

    alert("모든 예약이 완료되었습니다!");
    // 예약 후 캘린더 페이지로 이동
    window.location.href = './calendar.html';
}
