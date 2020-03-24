'use strict';
const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const Menu = electron.Menu;
let win;


// require('electron-reload')(__dirname);

function createWindow() {
  win = new BrowserWindow
  (
    {
      width: 1200+500,
      height: 700,
      useContentSize: true,
    }
  );
  win.setMenu(null);
  initWindowMenu();

  win.loadURL(`file://${__dirname}/index.html`);

  win.webContents.openDevTools();
  
  win.on('closed', () => {win = null;});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('before-quit',function(e){forceQuit=true;});
app.on('will-quit',function(){win=null;});


function initWindowMenu(){
  const template =
[
  {label: 'ファイル',submenu:
    [

    ]
  },
  {label: '設定',submenu:
    [

    ]
  },
  {label: 'ヘルプ',submenu:
    [

    ]
  },
  {label: '開発',submenu:
    [
      {
        label: '再読み込み',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow)
        {if(focusedWindow) focusedWindow.reload();},
      },
      {
        label: "開発者用具",
        accelerator:'CmdOrCtrl+I',
        click(item, focusedWindow)
        {focusedWindow.toggleDevTools();},
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
}