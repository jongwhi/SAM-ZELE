// app모듈과, BrowserWindow 모듈 할당
const {app, BrowserWindow} = require('electron');
let win;

app.on('ready', () =>{
    // window 창에 대한 옵션 - 크기 및 기타 옵션들
    win = new BrowserWindow(
    {
        width : 800,
        height : 500,
        // menubar 숨기는 옵션
        autoHideMenuBar : true,
        // 전체화면으로 전환해주는 옵션
        // kiosk:true
    });

    // 창이 ready 상태가 되면 보여주기
    win.once('ready-to-show', function(){
        win.show();
    });

    // 윈도우 창에 로드 할 html 페이지
    win.loadURL(`file://${__dirname}/index.html`);
    // 작은 따옴표가 아닌 back stick 기호 (Tab 위에)

    // 개발자 도구 오픈
    //win.webContents.openDevTools();
});