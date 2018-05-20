// 1. Electron
// app,BrowserWindow 모듈 설정(상수화)
const electron =require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var win //(변수화)

function createWindow () { // createWindow() 함수
    win = new BrowserWindow({width: 800, height: 600, //kiosk:true, 
                             autoHideMenuBar:true})
    // kiosk : 전체화면 설정 , autoHideMenuBar : 메뉴바 숨기기 설정

    win.loadURL('file://'+__dirname+'/index.html');

    //개발자 옵션 설정
    win.webContents.openDevTools()

    //창이 닫히면 win 객체 참조 해제
    win.on('closed', function() {
        win = null
    })
}

// 윈도우 생성
app.on('ready', createWindow)

// 창이 닫히면 에플리케이션 종료
app.on('window-all-closed',function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//2. Express
var http = require('http');
var express = require('express');
var sam = express();
sam.use(express.static(__dirname+"/public"));

http.createServer(sam).listen(3000,function() {
    console.log('server on 3000...');
});

// url 문자열과 객체의 변환을 위한 모듈
var url = require('url');
// query 문을 추출하고 분석하기 위한 모듈
var querystring = require('querystring');

sam.get('/url',function(req,res){
    var stringurl = 'http://news.naver.com/main/main.nhn?mode=LSD&mid=shm&sid1=103';
    //res.send(url.parse(stringurl,true));
    res.send(url.parse(stringurl,true).query);
})


// 이벤트 발생및 처리해주는 모듈
var events = require('events');
var eventEmitter = new events.EventEmitter();

sam.get('/event',function(req,res){

    // EventHandler 함수 생성
    var connectHandler = function connected(){
        console.log("Connection Successful");
        eventEmitter.emit("data_received");
    }

    // connection 이벤트와 connectHandler 이벤트 핸들러를 연동
    eventEmitter.on('connection', connectHandler);

    // data_received 이벤트와 익명 함수와 연동
    // 함수를 변수안에 담는 대신에, .on() 메소드의 인자로 직접 함수를 전달
    eventEmitter.on('data_received', function(){
        console.log("Data Received");
    });

    // connection 이벤트 발생시키기
    eventEmitter.emit('connection');
    console.log("Program has ended");
})