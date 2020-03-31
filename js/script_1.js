const electron = require('electron');
const {ipcRenderer}=electron;
const fs=require('fs')

const editor = document.getElementById('editor');

var json = null;

ipcRenderer.on('4',function(event,arg){
  console.log("filePath Reserved!")
  var result=arg[0];
  console.log(result)
  var data=fs.readFileSync(result,'utf8')
  json =JSON.parse(data);
  console.log(json.words[0].entry.id);
})