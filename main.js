'use strict';
const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
let win;


// require('electron-reload')(__dirname);

function createWindow() {
  win = new BrowserWindow
  ({
    width: 1200+500,
    height: 800,
    useContentSize: true,
  });

  win.loadURL(`file://${__dirname}/index.html`);

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
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
