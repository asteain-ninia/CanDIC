'use strict';
const electron = require('electron');
const {app,BrowserWindow,dialog,ipcMain}=electron
const Menu = electron.Menu;
const fs = require('fs')

let index;
function createWindow(){
  index = new BrowserWindow(
    {
      title:'CanDIC',
      width: 1200+500,
      //width:1200,
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
    app.quit();
  });
}

let requiredID;
let editor;
function createEditor(){
  editor=new BrowserWindow({
    title:'CanDICEditor',
    width: 600+500,
    minWidth:300+500,
    // width:600,
    // minWidth:300,
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

let dic_config;
function createDICconfig(){
  dic_config=new BrowserWindow({
    title:'CanDIC DICconfig',
    width: 600+500,
    minWidth:300+500,
    // width:600,
    // minWidth:300,
    height: 750,
    useContentSize:true,
    webPreferences: {nodeIntegration: true}
  });

  dic_config.setMenu(null);

  dic_config.loadURL(`file://${__dirname}/dic_config.html`);
  dic_config.webContents.openDevTools();

  dic_config.webContents.on('did-finish-load', ()=>{
    index.webContents.send('beacon');
  });

  dic_config.on('closed', () => {dic_config = null;});
}

let about;
function createAbout(){
  
  about = new BrowserWindow(
    {
      title:'About CanDIC',
      width:400,
      height:200,
      useContentSize:true,
      icon: './images/icon.png',
      webPreferences: {nodeIntegration: true}
    }
  );
  about.setMenu(null);
  //about.webContents.openDevTools();
  about.loadURL(`file://${__dirname}/about.html`);

  about.webContents.on('did-finish-load', ()=>{
    about.webContents.send('about_load',1);
  });
}


function initWindowMenu(){
  const template =
[
  {label: '辞書操作',submenu:
    [
      {
        label:'辞書を開く',
        click(){
          //参考：https://qiita.com/stupid_student2/items/f25c2b8c3d0ca5cdc89e
          var load_result = dialog.showOpenDialogSync(
            {properties: ['openFile']}
            );
          index.webContents.send('4',load_result);
        }
      },
      {
        label:'辞書を作る',
        click(){
          var save_result=dialog.showSaveDialogSync(
            {
              filters: [
                { name: 'JSON形式辞書', extensions: ['json'] },
                { name: '無拡張子', extensions: ['*'] }
              ],
            }
          );
          index.webContents.send('creareDIC',save_result);
        }
      },
      {
        label:'名前を付けて複製を保存',
        click(){
          var save_result=dialog.showSaveDialogSync(
            {
              filters: [
                { name: 'JSON形式辞書', extensions: ['json'] },
                { name: '無拡張子', extensions: ['*'] }
              ],
            }
          );
          index.webContents.send('DICsaveAS',save_result);
        }
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
        label:"辞書設定",
        click(){
          if(!dic_config){
            createDICconfig();
          }else{
            dic_config.focus();
          }
        }
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
        click(){
          createAbout();
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
    ]
  }
];

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
}


ipcMain.on('editor_signal',(event,arg)=>{
  requiredID=arg;
  createEditor();
});

ipcMain.on('close_signal',(event,arg)=>{
  switch(arg.save_flag){

    case 0:
      editor.close();
      index.webContents.send('modify_signal',arg);
      break;

    case 1:
      var choise=dialog.showMessageBoxSync(editor,{
        type:'warning',
        title:'警告',
        message:'単語編集を保存せず終了します。よろしいですか。',
        buttons:['ok', 'cancel',]
      })
      if(choise==0){
        editor.close();
      }
      break;

    case 2:
      var choise=dialog.showMessageBoxSync(editor,{
        type:'warning',
        title:'警告',
        message:'単語を削除します。この操作は復元不能です。本当によろしいですか。',
        buttons:['削除', 'とりやめ',]
      })
      if(choise==0){

        var data = fs.readFileSync(arg.target_path, 'utf8') //pathの向こうにあるファイルをテキストで読む
        var json = JSON.parse(data); //jsonでパース
        let targetIndex
        var words_queue=json.words.length;
        for(let i=0;i<words_queue;i++){
            if(json.words[i].entry.id===arg.target_number){
                targetIndex=i;
            }
        }
        delete json.words[targetIndex];


        json.words=json.words.filter(removeNull);

        fs.writeFileSync(arg.target_path, JSON.stringify(json), 'utf8')
        editor.close();
        index.webContents.send('modify_signal',arg);
      }
      break
  }
});
function removeNull(value){
  if(value !== null) {
      return value;
  }
}

ipcMain.on('config',(event,arg)=>{
  dic_config.webContents.send("target",arg);
});

ipcMain.on('close_signal_dic',(event,arg)=>{
  switch(arg.save_flag){

    case 0:
      editor.close();
      index.webContents.send('modify_signal_dic');

      var choise=dialog.showMessageBoxSync(dic_config,{
        type:'warning',
        title:'警告',
        message:'使用されている題目が削除された場合、単語内の情報は無に置換されます。この操作は復元不能です。本当によろしいですか。',
        buttons:['ok', 'cancel',]
      })
      if(choise==0){
        dic_config.webContents.send('save')
      }

      break;

    case 1:
      var choise=dialog.showMessageBoxSync(dic_config,{
        type:'warning',
        title:'警告',
        message:'編集を保存せず終了します。よろしいですか。',
        buttons:['ok', 'cancel',]
      })
      if(choise==0){
        dic_config.close();
      }
      break;
    case 2:
      dic_config.close();
      break;
  }
});


app.on('ready', createWindow);
app.on('window-all-closed', () => {if(process.platform !== 'darwin') {app.quit();}});
app.on('activate', () => {if (index === null) {createWindow();}});
app.on('before-quit',function(e){forceQuit=true;});
app.on('will-quit',function(){index=null;});
