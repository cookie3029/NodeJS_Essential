const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
const path = require('path')
const fs = require('fs')

const app = express()

app.set('port', 7000)
app.use(morgan('dev'))

var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))

// 파일 다운로드
var util = require('util')
var mime = require('mime')

// img 디렉토리가 없으면 생성
try {
    fs.readdirSync('img')
} catch(error) {
    console.error('img 디렉토리가 없어서 생성')
    fs.mkdirSync('img')
}

// 이미지 업로드 설정
const upload = multer({
    storage:multer.diskStorage({
        destination(req, file, done) {
            done(null, 'img/')
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname)

            done(null, path.basename(file.originalname, ext) + Date.now() + ext)
        }
    }),
    limits:{fileSize:10 * 10 * 1024}
})

// 뷰 템플릿 엔진 : Controller(Router)가 넘겨준 데이터를 출력하기 위한 뷰 설정
app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile)

// Mongo DB 연결
var MongoClient = require('mongodb').MongoClient
var db;
var databaseUrl = 'mongodb://localhost:27017'

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send(err.message)
})

// 데이터 전체 가져오기
app.get('/item/all', (req, res, next) => {
    MongoClient.connect(databaseUrl, (err, database) => {
        db = database.db('kabigon')
        db.collection('item').find().sort({'itemid': -1})
            .toArray((err, items) => {
                res.json({'count':items.length, 'list':items})
        })
    })
})

// 데이터 일부분 가져오기
app.get('/item/list', (req, res, next) => {
    var start = 0
    var cnt = 3

    // skip은 시작하는 데이터의 인덱스와 유사
    // limit은 가져올 데이터 개수를 지정
    MongoClient.connect(databaseUrl, (err, database) => {
        db = database.db('kabigon')
        db.collection('item').find().sort({'itemid': -1}).skip(start).limit(cnt)
            .toArray((err, items) => {
                res.json({'count':items.length, 'list':items})
        })
    })
})

// 데이터 1개 가져오기
app.get('/item/detail', (req, res, next) => {
    var itemid = 1

    MongoClient.connect(databaseUrl, (err, database) => {
        db = database.db('kabigon')
        db.collection('item').findOne({'itemid':itemid}, (err, item) => {
            res.json({'result':true, 'item':item})
        })
    })
})

// 데이터 삽입
app.get('/item/insert', (req, res, next) => {
    MongoClient.connect(databaseUrl, (err, database) => {
        db = database.db('kabigon')

        // 가장 큰 itemid를 찾아서 +1을 해서 itemid 생성
        db.collection('item').find({}, {projection:{_id:0, itemid:1}}).sort({itemid:-1}).limit(1)
            .toArray((err, result)=>{
                var itemid = 1
                if(result[0] != null) {
                    itemid = itemid + 1
                }
                
                db.collection('item').insert(
                    {
                        "itemid":itemid, 
                        "itemname":"수박", 
                        "description":"좋아하는 과일", 
                        "price":5000, 
                        "pictureurl":"apple.png"
                    }, (err, result) => {
                        res.json({"result":true})
                })
            })
    })
})

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
})
