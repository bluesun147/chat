const express = require('express');
const socket = require('socket.io');
const http = require('http');
// express 는 서버 위한 모듈, socket.io 는 실시간 통신 위한 모듈
const app = express();
const server = http.createServer(app); // express http 서버 생성
const io = socket(server); // 생성된 서버 socket.io에 바인딩

app.get('/', (req, res) => {
    console.log('유저가 /로 접속하였습니다.');
    res.send('hello');
})

server.listen(3000, () => {
    console.log('서버 실행 중');
})