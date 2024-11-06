import { db } from './firebaseConfig.js';
import { collection, query, where, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.getElementById("search-reservation-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const studentId = document.getElementById("student-id").value;
    const studentName = document.getElementById("student-name").value;
    const email = document.getElementById("email").value;
    const student = `${studentId} - ${studentName}`;

    const reservationListContainer = document.getElementById("reservation-list");
    reservationListContainer.innerHTML = ""; // 기존 리스트 초기화
    document.getElementById("cancel-selected-button").style.display = "none";

    try {
        const q = query(collection(db, "reservations"), 
            where("customer.student", "==", student),
            where("customer.email", "==", email)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("해당 정보로 예약된 내역이 없습니다.");
            return;
        }

        // 예약 정보를 카드 형식으로 표시
        querySnapshot.forEach((doc) => {
            const reservationData = doc.data();
            const card = document.createElement("div");
            card.classList.add("reservation-card");

            card.innerHTML = `
                <h3>${reservationData.date}</h3>
                <p><strong>장소:</strong> ${reservationData.room}</p>
                <p><strong>시간:</strong> ${reservationData.time}</p>
                <label><input type="checkbox" class="cancel-checkbox" data-id="${doc.id}"> 취소 선택</label>
            `;
            reservationListContainer.appendChild(card);
        });

        document.getElementById("cancel-selected-button").style.display = "block";

    } catch (error) {
        console.error("예약 조회 오류:", error);
        alert("예약 조회 중 오류가 발생했습니다.");
    }
});

document.getElementById("cancel-selected-button").addEventListener("click", async function() {
    const checkboxes = document.querySelectorAll(".cancel-checkbox:checked");
    if (checkboxes.length === 0) {
        alert("취소할 예약을 선택하세요.");
        return;
    }

    if (!confirm("선택한 예약을 취소하시겠습니까?")) {
        return;
    }

    try {
        for (const checkbox of checkboxes) {
            const reservationId = checkbox.getAttribute("data-id");
            await deleteDoc(doc(db, "reservations", reservationId));
        }

        alert("선택한 예약이 취소되었습니다.");
        document.getElementById("reservation-list").innerHTML = ""; // 리스트 초기화
        document.getElementById("cancel-selected-button").style.display = "none";
        window.location.href = './index.html';
    } catch (error) {
        console.error("예약 취소 오류:", error);
        alert("예약 취소 중 오류가 발생했습니다.");
    }
});
