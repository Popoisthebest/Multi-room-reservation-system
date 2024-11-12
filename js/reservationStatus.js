import { db } from './firebaseConfig.js';
import { collection, query, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async function() {
    const container = document.getElementById("reservation-status-container");

    try {
        // Query reservations, ordered by date
        const q = query(collection(db, "reservations"), orderBy("date"));
        const querySnapshot = await getDocs(q);

        const reservations = {};

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const { date, customer } = data;
            const groupKey = `${date}_${customer.club}`;

            // Group by same date and club name
            if (!reservations[groupKey]) {
                reservations[groupKey] = { date, customer, details: [] };
            }
            reservations[groupKey].details.push(data);
        });

        // Generate reservation cards for each group
        for (const key in reservations) {
            const { date, customer, details } = reservations[key];
            
            // Separate 학번 and 이름, then mask the name
            const [, studentName] = customer.student.split(" - ");
            const maskedName = studentName.length === 2 
                ? studentName[0] + "*" 
                : studentName[0] + "*".repeat(studentName.length - 2) + studentName.slice(-1);

            const card = document.createElement("div");
            card.classList.add("reservation-card");

            card.innerHTML = `
                <h2>${date}</h2>
                <p><strong>예약 단체:</strong> ${customer.club}</p>
                <p><strong>이름:</strong> ${maskedName}</p>
                <p><strong>예약 목적:</strong> ${customer.purpose}</p>
                <p><strong>전화번호:</strong> ${customer.contact}</p>
                <h3>예약 세부 정보</h3>
            `;

            details.forEach(detail => {
                const roomInfo = document.createElement("p");
                roomInfo.innerText = `- ${detail.room} (${detail.time})`;
                card.appendChild(roomInfo);
            });

            container.appendChild(card);
        }
    } catch (error) {
        console.error("예약 현황 불러오기 오류:", error);
        container.innerHTML = "<p>예약 정보를 불러오는 중 오류가 발생했습니다.</p>";
    }
});
