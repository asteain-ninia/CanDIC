'use strict';
const electron = require('electron');
const {app,BrowserWindow,dialog,ipcMain}=electron
const Menu = electron.Menu;

let win;
function createWindow()
{
  win = new BrowserWindow(
    {
      title:'CanDIC',
      width: 1200+500,
      height: 750,
      useContentSize:true,
      icon: './images/icon.png',
      webPreferences: {nodeIntegration: true}
    }
  );

  initWindowMenu();
  
  win.loadURL(`file://${__dirname}/index.html`);
  win.webContents.openDevTools();

  win.on('closed', () => {win = null;});
}


let editor;
function createEditor(){
  editor=new BrowserWindow({
    title:'CanDICEditor',
  });

  editor.loadURL(`file://${__dirname}/editor.html`);
  editor.webContents.openDevTools();

  editor.on('closed', () => {editor = null;});
}

ipcMain.handle('editor_signal',(event,message)=>{
  console.log(message)
  createEditor();
});



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
        click(){
          //参考：https://qiita.com/stupid_student2/items/f25c2b8c3d0ca5cdc89e
          var result = dialog.showOpenDialogSync({properties: ['openFile']});
          win.webContents.send('4',result);
        }
      },
      {
        label:'辞書を作る',
        enabled:false,
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
  {label: '情報',submenu:
    [
      {
        label:'取扱説明書',
        enabled:false,
      },
      {
        label:'辞書情報',
        enabled:false,
      },
      {
        label:'CanDICについて',
        enebled:false,
      }
    ]
  },
  {label: '開発',submenu:
    [
      {
        label:'サンプル読み込み',
        click(){
          var result =["datas/sample.json"]
          win.webContents.send('4',result);
        }
      },

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
    ]
  }
];

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
}