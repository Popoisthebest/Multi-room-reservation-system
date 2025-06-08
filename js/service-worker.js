const CACHE_NAME = "reservation-system-v1";
const OFFLINE_URL = "/offline.html";

const urlsToCache = [
  "/",
  "/index.html",
  "/reservationForm.html",
  "/styles.css",
  "/js/reservationForm.js",
  "/offline.html",
];

// 서비스 워커 설치
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("캐시가 열렸습니다.");
      return cache.addAll(urlsToCache);
    })
  );
});

// 서비스 워커 활성화
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("이전 캐시를 삭제합니다:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 네트워크 요청 처리
self.addEventListener("fetch", (event) => {
  // POST 요청은 네트워크 우선
  if (event.request.method === "POST") {
    event.respondWith(
      fetch(event.request).catch((error) => {
        // 오프라인 상태에서 POST 요청 실패 시
        return new Response(
          JSON.stringify({
            error: "오프라인 상태입니다. 나중에 다시 시도해주세요.",
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
    return;
  }

  // GET 요청은 캐시 우선
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          // 유효한 응답이 아니면 캐시하지 않음
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // 응답을 복제하여 캐시에 저장
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // 오프라인 상태에서 HTML 요청이면 오프라인 페이지 반환
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match(OFFLINE_URL);
          }
        });
    })
  );
});

// 백그라운드 동기화
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-reservations") {
    event.waitUntil(syncReservations());
  }
});

// 예약 동기화 함수
async function syncReservations() {
  const db = await openReservationDB();
  const offlineReservations = await db.getAll("offlineReservations");

  for (const reservation of offlineReservations) {
    try {
      const response = await fetch("http://localhost:3000/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": reservation.csrfToken,
        },
        body: JSON.stringify(reservation.data),
      });

      if (response.ok) {
        await db.delete("offlineReservations", reservation.id);
      }
    } catch (error) {
      console.error("예약 동기화 실패:", error);
    }
  }
}

// IndexedDB 열기
function openReservationDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ReservationDB", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("offlineReservations")) {
        db.createObjectStore("offlineReservations", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
  });
}
