// app모듈과, BrowserWindow 모듈 할당
const {app, BrowserWindow} = require('electron');
let win;

app.on('ready', () =>{
    win = new BrowserWindow(
    {
        width : 800,
        minWidth : 330,
        height : 500,
        minHeight : 450,
        show : false,
        icon : __dirname + '/resources/installer/Icon.ico',
        webPreferences : {defaultFontSize : 14},
        autoHideMenuBar : true,
        kiosk:true
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