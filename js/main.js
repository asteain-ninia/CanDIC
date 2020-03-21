'use strict';
const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
let win;

function createWindow() {
  win = new BrowserWindow({width: 1000, height: 800});

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

