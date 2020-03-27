'use strict';
const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const Menu = electron.Menu;
const openAboutWindow = require('electron-about-window').default;
const {dialog}=require('electron');
const {ipcMain} =require('electron');
const fs =require('fs');

let win;


function createWindow()
{
  win = new BrowserWindow(
    {
      title:'CanDIC',
      width: 1200+500,
      height: 700,
      useContentSize: true,
      icon: './images/icon.png',
      webPreferences: {nodeIntegration: true}
    }
  );

  win.setMenu(null);
  initWindowMenu();
  
  win.loadURL(`file://${__dirname}/index.html`);
  win.webContents.openDevTools();

  win.on('closed', () => {win = null;});
}





app.on('ready', createWindow);

app.on('window-all-closed', () => {if(process.platform !== 'darwin') {app.quit();}});

app.on('activate', () => {if (win === null) {createWindow();}});

app.on('before-quit',function(e){forceQuit=true;});
app.on('will-quit',function(){win=null;});


function initWindowMenu(){
  const template =
[
  {label: '操作',submenu:
    [
      {
        label:'辞書を開く',
        click(){openFile()},
      },
      {
        label:'辞書を作る',
        enebled:false,
      },
      {
        label:'名前を付けて複製を保存',
        enabled:false,
      },
    ]
  },
  {label: '設定',submenu:
    [
      {
      label:'設定を変更する',
      enabled:false,
      }
    ]
  },
  {label: 'ヘルプ',submenu:
    [
      {
        label:'情報',
        click: function(item, focusedWindow)
        {
          console.log(
            "We are using node "+process.versions.node+"Chrome"+process.versions.chrome+"and Electron"+process.versions.electron
          )
          openAboutWindow({
            icon_path:'./images/icon.png' 
          })
        }
      }
    ]
  },
  {label: '開発',submenu:
    [
      {
        label: '再読み込み',
        accelerator: 'CmdOrCtrl+R',
        role:'reload',
      },
      {
        label: "開発者用具",
        accelerator:'CmdOrCtrl+I',
        role:'toggledevtools',
      },
      {
        label:"test",
        click:function() {
          console.log(
            "We are using node "+process.versions.node+"Chrome"+process.versions.chrome+"and Electron"+process.versions.electron
          )
        }
      },
      {
        label:"test2",

      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
}
/*   //参考：https://qiita.com/stupid_student2/items/f25c2b8c3d0ca5cdc89e
  function openFile() {
     dialog.showOpenDialog({ properties: ['openFile'] }, (filePath) => {
  
      // レンダラープロセスにイベントを飛ばす
      win.webContents.send('open_file',filePath);
    })
  } */

  ipcMain.on('2',(event,arg)=>{
    console.log(arg)
    event.sender.send('1','pong')
  })
  ipcMain.on('3',(event,arg)=>{
    console.log(arg)
    event.returnValue='pong';
  })

function openFile(){
  dialog.showOpenDialog({properties:['openFile']},filePath =>{
    event.sender.send('1','ping')
    fs.readFile(filePath[0], { encoding:"utf-8"}, (err, data)=>{

      signal=data;
      event.sender.send('open_file',"signal");

    })
  })
}