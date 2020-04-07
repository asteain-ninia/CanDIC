const electron = require('electron');
const {ipcRenderer}=electron;
const fs=require('fs')

let entry=document.getElementById("entry");

ipcRenderer.on('target',(event,arg)=>{
    var target=arg.path
    ShowWord(target);
});

function ShowWord(target){
    var data = fs.readFileSync(target, 'utf8') //pathの向こうにあるファイルをテキストで読む
    json = JSON.parse(data); //jsonでパース(ここ二行scrpt_1と共通)

    //欄内の掃除は不要

    var wordID=document.getElementById("wordID");
    var form=document.getElementById("spelling");
    var tag=document.getElementById("tag");
    var char=document.getElementById("char")
}

function add_spelling(){
    var spelling_1=document.getElementById("spelling")

    var spelling=document.createElement('form')
    spelling.className="spelling";

    var spell=document.createElement('input');
    spell.type="text";
    spell.name="spell";
    var remove=document.createElement('input');
    remove.type="button";
    remove.name="remove";
    remove.value="-"
    remove.onclick="remove_spelling"

    spelling.appendChild(spell);
    spelling.appendChild(remove);

    spelling_1.appendChild(spelling)
}

function remove_spelling(){
    console.log("remove!")
    //dictionary.removeChild(dictionary.firstChild);
}