const electron = require('electron');
const {ipcRenderer}=require( 'electron');
const {BrowserWindow,dialog}=require('electron').remote;
const fs=require('fs')

ipcRenderer.on('open_file', (event, arg) => {
//参考：https://qiita.com/stupid_student2/items/f25c2b8c3d0ca5cdc89e
    console.log("load Start");
    console.log(arg);
/*     let filePath=arg[0];
    filePath=filePath.split('\\');
    const fileName =filePath[filePath.length-1];;
    dialog.showMessageBox(fileName); */
  })

ipcRenderer.on('file_signal',function(event,arg){console.log(arg);})

function  message(){
  const result =ipcRenderer.sendSync('3','ping')
  console.log(result)

}

ipcRenderer.on('1',(event,arg)=>{console.log(arg)}) 

//以下参考:https://qiita.com/zaburo/items/eb525138b88890c5357c
const editor = document.getElementById('editor');
//openFileボタンが押されたとき（ファイル名取得まで）
function openFile() {

  const win = BrowserWindow.getFocusedWindow();
  dialog.showOpenDialog(win,{
    properties: ['openFile'],
    filters: [
      {name: 'JSONファイル', extensions: ['json']}
    ]},
      function(fileNames){
        console.log("!!!");
          if (fileNames) {
              // alert(fileNames[0]);
              readFile(fileNames[0]); //複数選択の可能性もあるので配列となる。
          }
      }
  )
}

function readFile(path) {
  fs.readFile(path, (error, data) => {
      if (error != null) {
          alert("file open error.");
          return;
      }
    editor.textContent = data.toString();
  })
}

//https://www.sejuku.net/blog/32532
var form = document.forms.myform;
form.myfile.addEventListener( 'change', function test(e) {console.log(e)})

ipcRenderer.on('4,',function(event,arg){
  console.log(event);
  console.log(arg);
})