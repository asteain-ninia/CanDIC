const electron = require('electron');
const {ipcRenderer}=electron;
const fs=require('fs')

var wordID=document.getElementById("wordID");

ipcRenderer.on('target',(event,arg)=>{
    console.log(arg)
})
