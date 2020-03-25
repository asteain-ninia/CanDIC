const electron = require('electron');
const {ipcRenderer}=require( 'electron');
const {dialog}=require('electron');

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

/*   ipcRenderer.send('2','ping')
  ipcRenderer.on('1',(event,arg)=>{console.log(arg)}) */
}