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

// Firebase에 직접 예약 정보를 저장하는 함수
async function saveToFirebase(rooms, date, club, student, contact, email, purpose) {
    try {
        for (const room in rooms) {
            for (const time of rooms[room]) {
                const reservationId = `${date}_${time}_${room}`;
                const reservationRef = doc(db, "reservations", reservationId);
                const reservationData = {
                    date,
                    time,
                    room,
                    status: true,
                    customer: {
                        club,
                        student,
                        contact,
                        email,
                        purpose
                    }
                };
                await setDoc(reservationRef, reservationData);
                console.log(`Firebase에 예약 완료: ${reservationId}`);
            }
        }
        alert("예약이 완료되었습니다!");
        localStorage.removeItem("reservationSelection"); // 선택 정보 삭제
        window.location.href = './index.html'; // 예약 완료 후 메인 페이지로 이동
    } catch (error) {
        console.error("Firebase 저장 오류:", error);
        alert("예약 저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
}

// 예약 정보 저장 및 서버로 전송
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

    try {
        // 서버로 예약 요청
        const response = await fetch('http://localhost:3000/reserve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rooms, date, club, student, contact, email, purpose })
        });

        if (response.ok) {
            alert("예약이 완료되었습니다! 이메일을 확인하세요.");
            localStorage.removeItem("reservationSelection"); // 선택 정보 삭제
            window.location.href = './index.html'; // 예약 완료 후 메인 페이지로 이동
        } else {
            throw new Error("서버 오류");
        }
    } catch (error) {
        console.error("서버 요청 오류:", error);
        // 서버 오류 발생 시 Firebase에 직접 저장
        alert("서버 연결에 문제가 있어 Firebase에 직접 저장합니다.");
        await saveToFirebase(rooms, date, club, student, contact, email, purpose);
    }
});
