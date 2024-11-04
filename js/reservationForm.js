import { db } from './firebaseConfig.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// 선택한 상품 정보를 불러와서 화면에 표시
document.addEventListener("DOMContentLoaded", function() {
    const productInfoContainer = document.getElementById("product-info");
    const selectionData = JSON.parse(localStorage.getItem("reservationSelection"));

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
});

// 예약 정보 저장하기
document.getElementById("reservation-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const club = document.getElementById("club").value;
    const studentId = document.getElementById("student-id").value;
    const studentName = document.getElementById("student-name").value;
    const student = `${studentId} - ${studentName}`;
    const contact = `010-${document.getElementById("contact-middle").value}-${document.getElementById("contact-last").value}`;
    const email = document.getElementById("email").value;
    const purpose = document.getElementById("purpose").value;

    const selectionData = JSON.parse(localStorage.getItem("reservationSelection"));
    if (!selectionData) {
        alert("예약할 장소와 시간을 먼저 선택하세요.");
        return;
    }

    const { rooms, date } = selectionData;

    // Firestore에 각 선택된 방과 시간 저장
    try {
        for (const room in rooms) {
            for (const time of rooms[room]) {
                const reservationId = `${date}_${time}_${room}`;
                const reservationRef = doc(db, "reservations", reservationId);
                const reservationData = {
                    date: date,
                    time: time,
                    room: room,
                    status: true,
                    customer: {
                        club: club,
                        student: student,
                        contact: contact,
                        email: email,
                        purpose: purpose
                    }
                };

                await setDoc(reservationRef, reservationData);
                console.log(`예약 완료: ${reservationId}`);
            }
        }
        alert("예약이 완료되었습니다!");
        localStorage.removeItem("reservationSelection"); // 선택 정보 삭제
        window.location.href = './calendar.html'; // 예약 완료 후 캘린더 페이지로 이동
    } catch (error) {
        console.error("예약 저장 오류:", error);
        alert("예약 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
});
