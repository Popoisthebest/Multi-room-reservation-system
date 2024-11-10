import { db } from './firebaseConfig.js';
import { collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async function() {
    const container = document.getElementById("reservation-status-container");

    try {
        // 날짜 순서로 모든 예약 조회
        const q = query(collection(db, "reservations"), orderBy("date"));
        const querySnapshot = await getDocs(q);

        const reservations = {};

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const { date, customer } = data;
            const groupKey = `${date}_${customer.club}`;

            // 같은 날짜와 같은 동아리로 그룹화
            if (!reservations[groupKey]) {
                reservations[groupKey] = { date, customer, details: [] };
            }
            reservations[groupKey].details.push(data);
        });

        // 각 그룹별로 카드 생성
        for (const key in reservations) {
            const { date, customer, details } = reservations[key];
            const maskedName = customer.student.replace(/(.).+$/, "$1*");

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
