const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("환경 변수가 로드되지 않았습니다. .env 파일을 확인하세요.");
    process.exit(1);
}

const serviceAccount = require('../multi-room-reservation-system-firebase-adminsdk-mz1qe-cfb5281fc1.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 예약 저장 및 이메일 전송 엔드포인트
app.post('/reserve', async (req, res) => {
    const { rooms, date, club, student, contact, email, purpose } = req.body;
    console.log('수신자 이메일:', email);

    try {
        for (const room in rooms) {
            for (const time of rooms[room]) {
                const reservationId = `${date}_${time}_${room}`;
                const reservationRef = db.collection('reservations').doc(reservationId);
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
                await reservationRef.set(reservationData);
            }
        }

        // 이메일 전송 설정
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '예약 확인서',
            text: `안녕하세요 ${student}님,\n\n예약이 성공적으로 완료되었습니다.\n\n예약 정보:\n- 날짜: ${date}\n- 동아리/단체: ${club}\n- 사용 목적: ${purpose}\n\n감사합니다.`
        };

        // 이메일 전송 시도
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("이메일 전송 오류:", error);  // 이메일 전송 오류 시 콘솔에 로그
            } else {
                console.log("이메일 전송 성공:", info.response);
            }
        });

        // 이메일 성공/실패와 관계없이 예약이 완료되었음을 클라이언트에 전달
        res.status(200).send('예약이 완료되었습니다.');
    } catch (error) {
        console.error('예약 저장 오류:', error);
        res.status(500).send('예약 중 오류가 발생했습니다.');
    }
});

app.listen(3000, () => {
    console.log('서버가 3000번 포트에서 실행 중입니다.');
});
