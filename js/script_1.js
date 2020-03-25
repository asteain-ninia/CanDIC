const electron = require('electron');
const {ipcRenderer}=require( 'electron');
const {dialog}=require('electron');

ipcRenderer.on('open_file', (event, arg) => {
    console.log("load Start")
    let filePath=arg[0];
    filePath=filePath.split('\\');
    const fileName =filePath[filePath.length-1];;
    dialog.showMessageBox(fileName);
  })
function test(){console.log("renderer is working")}