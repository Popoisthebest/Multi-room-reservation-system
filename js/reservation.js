import { db } from './firebase.js';
import { collection, setDoc, doc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// 예약 데이터를 Firestore에 저장하는 함수
export async function saveReservation(reservationData) {
    const reservationId = `${reservationData.studentID}_${reservationData.studentName}`; // 학번과 이름을 결합하여 예약 ID 생성
    const reservationsRef = collection(db, "reservations");

    // 중복 예약 확인
    const q = query(
        reservationsRef,
        where("date", "==", reservationData.date),
        where("timeSlots", "array-contains-any", reservationData.timeSlots),
        where("locations", "array-contains-any", reservationData.locations)
    );

    const existingReservations = await getDocs(q);

    if (!existingReservations.empty) {
        alert("선택한 날짜와 시간에 이미 예약이 있습니다. 다른 시간을 선택하세요.");
        return; // 중복 예약이 있으므로 함수 종료
    }

    // 중복이 없을 경우 예약 저장
    try {
        await setDoc(doc(db, "reservations", reservationId), reservationData);
        console.log("Reservation saved with ID: ", reservationId);
        alert("예약이 완료되었습니다!");
        localStorage.clear();  // 모든 데이터 초기화
        window.location.href = '/index.html';  // 초기 화면으로 이동
    } catch (error) {
        console.error("예약 오류: ", error);
        alert("예약에 실패했습니다. 다시 시도해주세요.");
    }
}

// 각 페이지에서 다음 페이지로 이동할 때 선택한 데이터를 localStorage에 저장하는 함수
export function storeData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// 예약자 정보 페이지에서 모든 데이터를 수집하여 예약을 완료하는 함수
export function submitReservation() {
    const locations = JSON.parse(localStorage.getItem('selectedLocations'));
    const date = localStorage.getItem('selectedDate');
    const timeSlots = JSON.parse(localStorage.getItem('selectedTimeSlots'));
    const clubName = document.getElementById('clubName').value;
    const studentID = document.getElementById('studentID').value;
    const studentName = document.getElementById('studentName').value;
    const purpose = document.getElementById('purpose').value;

    const reservationData = {
        locations,
        date,
        timeSlots,
        clubName,
        studentID,
        studentName,
        purpose
    };

    saveReservation(reservationData);
}
