const socket = io();

// 접속 되었을 때 실행
socket.on('connect', () => {
    // 이름 입력 받기
    let name = prompt('welcome!!', '');
    // 이름 빈칸인 경우
    if (!name) {
        name = 'anym';
    };

    // 서버에 새로운 유저 왔다고 알림
    socket.emit('newUser', name);
});

// 서버로부터 데이터 받은 경우
socket.on('update', (data) => {
    console.log(`${data.name}: ${data.message}`);
    
    let chat = document.getElementById('chat'); // 채탕

    // 지정한 html 요소를 만들어 반환
    let message = document.createElement('div');
    // give it some conetent
    let node = document.createTextNode(`${data.name}: ${data.message}`);
    let className = '';

    // 타입에 따라 적용할 클래스를 다르게 지정
    switch(data.type) {
        case 'message':
            className = 'other';
            break;

        case 'connect':
            className = 'connect';
            break;
        
        case 'disconnect':
            className = 'disconnect';
            break;
    }

    message.classList.add(className);
    message.appendChild(node);
    chat.appendChild(message);
});

// 전송 함수. 버튼을 클릭했을 떄 호출 됨.
// send라는 이름의 이벤트 전송했으면 받는 곳에서 on('send')가 있어야 받을 수 있음
// 이벤트 명이 동일한 것 끼리만 데이터 송수신 가능
const send = () => {
    // 입력 되어 있는 데이터 가져오기
    let message = document.getElementById('test').value;

    // 가져왔으니 데이터 빈 칸으로 변경
    document.getElementById('test').value = '';

    let chat = document.getElementById('chat');
    let msg = document.createElement('div');
    let node = document.createTextNode(message);

    msg.classList.add('me');
    msg.appendChild(node);
    chat.appendChild(msg);

    // on은 수신, emit은 전송
    // 서버로 message 이벤트 전달 + 데이터와 함께
    socket.emit('message', {type: 'message', message: message});
};