// 필요한 모듈 가져오기
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')

// dotenv 사용 설정
// dotenv 파일의 내용을 읽어서 process.env(express가 생성)에 속성으로 추가
dotenv.config()

// express app 생성
const app = express()

// 포트 설정
app.set('port', process.env.PORT)

// 로그 기록 설정 - 로그를 콘솔에 출력
// 실제 개발용이면 대부분 파일에 출력
app.use(morgan('dev'))

// 정적 파일(css, javascript, 그 외에 필요한 자원) 경로 설정
app.use('/', express.static(path.join(__dirname, 'public')))

// 클라이언트에서 데이터를 json 형식으로 전송한 경우 처리하기 위한 설정
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// 쿠키를 req.cookies. 로 읽을 수 있도록 해주는 설정
app.use(cookieParser(process.env.COOKIE_SECRET))

// 세션을 req.session으로 사용할 수 있도록 해주는 설정
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false
    },
    name:'session-cookie'
}))

/*
    // pug 설정
    app.set('views', path.join(__dirname, 'views'))
    app.set('view engine', 'pug')
*/

// nunjucks 설정
const nunjucks = require('nunjucks')

app.set('view engine', 'html')
nunjucks.configure('views', {
    express:app,
    watch:true
})

// 요청 처리
app.get('/', (req, res) => {
    // pug가 설정된 디렉토리의 index.html이나 index.pug로 출력
    // title과 Pokemon이라는 데이터를 가지고 넘어갑니다.
    res.render('index', {
        title:'Pokemon',
        Pokemon:['피카츄', '라이츄', '파이리', '잠만보']
    })
})

app.get('/rest', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/rest.html'))
})

app.get('/json', (req, res) => {
    res.json({
        title:'Pokemon',
        Pokemon:['피카츄', '라이츄', '파이리', '잠만보']
    })
})

// 서버 실행
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
})


