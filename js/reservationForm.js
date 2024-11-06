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
    reservationButton.disabled = true; // 버튼 비활성화
    reservationButton.textContent = "예약 중..."; // 로딩 상태 표시
    
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
        reservationButton.disabled = false;
        reservationButton.textContent = "예약하기";
        return;
    }

    const { rooms, date } = selectionData;

    try {
        const response = await fetch('http://localhost:3000/reserve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rooms, date, club, student, contact, email, purpose })
        });

        if (response.ok) {
            alert("예약이 완료되었습니다! 이메일을 확인하세요.");
            localStorage.removeItem("reservationSelection");
            window.location.href = './index.html';
        } else {
            alert("예약 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    } catch (error) {
        console.error("예약 요청 오류:", error);
        alert("서버 요청 중 오류가 발생했습니다.");
    } finally {
        // 버튼 원래 상태로 되돌리기
        reservationButton.disabled = false;
        reservationButton.textContent = "예약하기";
    }
});
