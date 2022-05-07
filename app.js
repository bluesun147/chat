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

server.listen(3000, () => {
    console.log('서버 실행 중');
})