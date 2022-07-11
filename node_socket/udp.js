var http = require('http')
var message =''

// UDP 통신을 위한 객체 생성
var client = require('dgram').createSocket('udp4')

// 메시지를 받았을 때 수행할 내용
client.on('message', (msg, rinfo) => {
    message = msg
})

// 에러가 발생했을 때 수행할 내용
client.on('error', (err) => {
    console.log('에러 : ', err)
})

http.createServer((req, res) => {
    var data = new Buffer('카비곤입니다.')
    client.send(data, 0, data.length, 4445, 'localhost')
    
    res.writeHead(200, {
        'Content-Type':'text/plain; charset=utf-8'
    })
    
    res.end(message)
}).listen(1338, '127.0.0.1')

console.log('Server 구동 중');