'use strict';
const electron = require('electron');
const {app,BrowserWindow,dialog,ipcMain}=electron
const Menu = electron.Menu;

let index;
function createWindow()
{
  index = new BrowserWindow(
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
  
  index.loadURL(`file://${__dirname}/index.html`);
  index.webContents.openDevTools();

  index.on('closed', () => {
    index = null;
    if(editor){
      editor.close();
    }
  });
}

let requiredID;
let editor;
function createEditor(){
  editor=new BrowserWindow({
    title:'CanDICEditor',
    width: 600+500,
    minWidth:300+500,
    height: 750,
    useContentSize:true,
    webPreferences: {nodeIntegration: true}
  });

  editor.setMenu(null);

  editor.loadURL(`file://${__dirname}/editor.html`);
  editor.webContents.openDevTools();

  editor.webContents.on('did-finish-load', ()=>{
    editor.webContents.send('target',requiredID);
  });

  editor.on('closed', () => {editor = null;});
}

ipcMain.on('editor_signal',(event,arg)=>{
  requiredID=arg;
  createEditor();
});

ipcMain.on('close_signal',(event,arg)=>{
  if(arg.save_flag==1){
    var choise=dialog.showMessageBoxSync(editor,{
      type:'warning',
      title:'警告',
      message:'単語編集を保存せず終了します。よろしいですか。',
      buttons:['OK', 'Cancel',]
    })
    if(choise==0){
      editor.close();
    }else{
      //何もしないをする
    }
  }else{
    editor.close();
    index.webContents.send('modify_signal',arg);
  }
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {if(process.platform !== 'darwin') {app.quit();}});

app.on('activate', () => {if (index === null) {createWindow();}});

app.on('before-quit',function(e){forceQuit=true;});
app.on('will-quit',function(){index=null;});

function initWindowMenu(){
  const template =
[
  {label: '辞書操作',submenu:
    [
      {
        label:'辞書を開く',
        click(){
          //参考：https://qiita.com/stupid_student2/items/f25c2b8c3d0ca5cdc89e
          var result = dialog.showOpenDialogSync({properties: ['openFile']});
          index.webContents.send('4',result);
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
  {
    label:'辞書',submenu:
    [
      {
        label:"番号",
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
          index.webContents.send('4',result);
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