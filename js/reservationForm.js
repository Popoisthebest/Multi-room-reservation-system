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

// 예약 정보 저장 및 서버로 전송
document.getElementById("reservation-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const reservationButton = document.querySelector("button[type='submit']");
    reservationButton.disabled = true;
    reservationButton.textContent = "예약 중...";

    const club = document.getElementById("club").value;
    const studentId = document.getElementById("student-id").value;
    const studentName = document.getElementById("student-name").value;
    const student = `${studentId} - ${studentName}`;
    const contact = `010-${document.getElementById("contact-middle").value}-${document.getElementById("contact-last").value}`;
    const email = document.getElementById("email").value;
    const purpose = document.getElementById("purpose").value;

    const selectionData = JSON.parse(localStorage.getItem("reservationSelection"));
    const { rooms, date } = selectionData;

    const reservationData = { rooms, date, club, student, contact, email, purpose };

    try {
        const response = await fetch('http://localhost:3000/reserve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservationData)
        });

        if (!response.ok) throw new Error("서버 오류");

        alert("예약이 완료되었습니다! 이메일을 확인하세요.");
    } catch (error) {
        console.error("서버 요청 오류:", error);
        alert("서버에 문제가 있어 Firebase에 직접 예약합니다.");

        // Firebase에 직접 예약 저장
        await saveToFirebaseDirectly(reservationData);
    } finally {
        reservationButton.disabled = false;
        reservationButton.textContent = "예약하기";
        localStorage.removeItem("reservationSelection");
        window.location.href = './index.html';
    }
});

async function saveToFirebaseDirectly({ rooms, date, club, student, contact, email, purpose }) {
    const db = firebase.firestore();
    for (const room in rooms) {
        for (const time of rooms[room]) {
            const reservationId = `${date}_${time}_${room}`;
            const reservationRef = db.collection('reservations').doc(reservationId);
            await reservationRef.set({
                date, time, room, status: true, customer: { club, student, contact, email, purpose }
            });
        }
    }
}

