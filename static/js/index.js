const socket = io();

// 접속 되었을 때 실행
socket.on('connect', () => {
    let input = document.getElementById('test');
    input.value = '접속 됨';
});

// 전송 함수. 버튼을 클릭했을 떄 호출 됨.
// send라는 이름의 이벤트 전송했으면 받는 곳에서 on('send')가 있어야 받을 수 있음
// 이벤트 명이 동일한 것 끼리만 데이터 송수신 가능
const send = () => {
    // 입력 되어 있는 데이터 가져오기
    let message = document.getElementById('test').value;

    // 가져왔으니 데이터 빈 칸으로 변경
    document.getElementById('test').value = '';

    // 서버로 send 이벤트 전달 + 데이터와 함께
    // on은 수신, emit은 전송
    socket.emit('send', {msg: message});
}