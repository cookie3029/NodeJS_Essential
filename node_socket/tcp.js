var http = require('http')
var fromServer =''

// TCP 통신을 위한 객체 생성
var client = require('net').Socket()


// 서버에 접속
client.connect(9999, ()=>{
    console.log("서버에 접속 성공")
})

// 서버에서 데이터가 전송된 경우
client.on('data', (data) => {
    console.log('받은 데이터 : ', data)
    fromServer = data;
})

// 연결이 해제된 경우
client.on('close', () => {
    console.log('연결 해제')
    client.destroy()
})

http.createServer((req, res) => {
    client.write('안녕하세요! 카비곤입니다.\n', () => {
        console.log('보내기 성공')
    })
    
    res.writeHead(200, {
        'Content-Type':'text/plain; charset=utf-8'
    })
    
    res.end(fromServer)
}).listen(1338, '127.0.0.1')

console.log('Server 구동 중');