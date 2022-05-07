const express = require('express');
const socket = require('socket.io');
const http = require('http');
const fs = require('fs');
// express 는 서버 위한 모듈, socket.io 는 실시간 통신 위한 모듈

const app = express();
const server = http.createServer(app); // express http 서버 생성
const io = socket(server); // 생성된 서버 socket.io에 바인딩

app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'));

app.get('/', (req, res) => {
    fs.readFile('./static/index.html', (err, data) => {
        if (err) {
            res.send('error!!');
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        }
    })
})

// on은 소켓이서 해당 이벤트 받으면 콜백 함수 실행됨.
// io.sockets는 접속되는 모든 소켓
io.sockets.on('connection', (socket) => {
    console.log('유저 접속 됨');

    socket.on('send', (data) => {
        console.log(`전달된 메시지 : ${data.msg}`);
    });

    socket.on('disconnect', () => { // 연결되어 있던 소켓과 접속 끊어지면 자동으로 실행 됨
        console.log('접속 종료');
    });
});

// message: 클라가 서버로 메시지 전송
// update: 서버에서 받은 메시지 다른 클라에게 전송
// connectUser: 새로운 유저 접속 서버에게 알림

io.sockets.on('connection', (socket) => {
    // 새로운 유저가 접속했을 경우 다른 소켓에도 알려줌
    socket.on('newUser', (name) => {
        console.log(`${name} just connects!!`);

        socket.name = name; // 소켓에 이름 저장해두기

        // 모든 소켓에 전송
        io.sockets.emit('update', {type: 'connect', name: 'SERVER', message:`${name} just connects!!`})
    });

    // 전송한 메시지 받기
    socket.on('message', (data) => {
        data.name = socket.name; // 받은 데이터에 누가 보냈는지 이름 추가
        console.log(data);

        // 보낸 사람을 제외한 나머지 유저에게 메시지 전송
        socket.broadcast.emit('update', data);
    });

    // 접속 종료
    socket.on('disconnect', () => {
        console.log(`${socket.name} just left!!`);

        // 나가는 사람 제외한 나머지 유저에게 메시지 전송
        socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.Socket.name + 'just left!!'});
    });
    // io.sockets.emit() : 본인 포함 모든 유저
    // io.broadcast.emit() // 본인 제외한 나머지 모두
    //
});

server.listen(3000, () => {
    console.log('서버 실행 중 ..');
})