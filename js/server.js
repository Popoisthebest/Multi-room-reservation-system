const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // 환경 변수 설정 로드

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("환경 변수가 로드되지 않았습니다. .env 파일을 확인하세요.");
    process.exit(1);
}

// 환경 변수 확인
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

const serviceAccount = require('../multi-room-reservation-system-firebase-adminsdk-mz1qe-cfb5281fc1.json');

// Firebase 초기화
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(cors()); // CORS 허용
app.use(bodyParser.json());

// Nodemailer 설정
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 예약 저장 및 이메일 전송 엔드포인트
app.post('/reserve', async (req, res) => {
    const { rooms, date, club, student, contact, email, purpose } = req.body;
    try {
        let allTimes = [];
        for (const room in rooms) {
            for (const time of rooms[room]) {
                const reservationId = `${date}_${time}_${room}`;
                const reservationRef = db.collection('reservations').doc(reservationId);
                const reservationData = { date, time, room, status: true, customer: { club, student, contact, email, purpose } };
                await reservationRef.set(reservationData);
                allTimes.push(`${room} - ${time}`);
            }
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: '예약 확인서',
            text: `안녕하세요 ${student}님, 예약이 성공적으로 완료되었습니다.\n예약 정보:\n- 날짜: ${date}\n- 예약 시간 및 방: ${allTimes.join(', ')}\n- 동아리/단체: ${club}\n- 사용 목적: ${purpose}`
        });

        res.status(200).send('예약이 완료되었습니다.');
    } catch (error) {
        console.error('예약 저장 오류:', error);
        res.status(500).send('서버 오류로 인해 예약 이메일을 전송할 수 없습니다.');
    }
});



app.listen(3000, () => {
    console.log('서버가 3000번 포트에서 실행 중입니다.');
});
