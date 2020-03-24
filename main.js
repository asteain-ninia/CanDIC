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


function initWindowMenu(){
  const template = [
    {
      label: 'Edit',
      submenu: [
          {
              role: 'undo',
          },
          {
              role: 'redo',
          },
      ]
  },
  {
      label: 'View',
      submenu: [
          {
              label: 'Reload',
              accelerator: 'CmdOrCtrl+R',
              click(item, focusedWindow){
                  if(focusedWindow) focusedWindow.reload()
              },
          },
          {
              type: 'separator',
          },
          {
              role: 'resetzoom',
          },
          {
              role: 'zoomin',
          },
          {
              role: 'zoomout',
          },
          {
              type: 'separator',
          },
          {
              role: 'togglefullscreen',
          }
      ]
  }
  ];

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
}