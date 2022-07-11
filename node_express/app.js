// express 모듈 가져오기
const express = require('express')

// express 모듈 객체 생성
const app = express()

// 서버 포트 설정
app.set('port', process.env.PORT || 3000)

const path = require('path')

// 로그 출력을 위한 모듈 설정
const morgan = require('morgan')
const fs = require('fs')

// 파일에 로그를 기록 - 1
// var accessLogStream = FileStreamRotator.getStream({
//     date_format : 'YYYYMMDD',
//     filename : path.join(__dir, 'access-%DATE%.log'),
//     frequency : 'daily',
//     verbose : false })

// 파일에 로그를 기록 - 2 
var accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'))

app.use(morgan('combined', {stream : accessLogStream}))

// app.use(morgan('dev'))

app.get('/', (req, res) => {
    // 텍스트 출력
    // res.send('환영합니다!!')

    // 현재 디렉토리에 있는 index.html을 출력
    res.sendFile(path.join(__dirname, '/index.html'))
})

// 서버 실행
app.listen(app.get('port'), () => {
    console.log(app.get('port') + '번 포트에서 대기중');
})