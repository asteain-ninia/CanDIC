const electron = require('electron');
const {ipcRenderer} = electron;
const fs = require('fs')

ipcRenderer.on('target',function(event,arg){
	if(arg){
		console.log(arg)
	}else{
		console.log("filepath not found")
	}
});

