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

let spellingFormCount=0;

function add_spelling(){
    spellingFormCount++;
    var spellingBox=document.getElementById("spellingBox")

    var spelling=document.createElement('form')
    spelling.className="spelling";
    spelling.id="spelling-"+spellingFormCount;

    var spell=document.createElement('input');
    spell.type="text";
    spell.name="spell";
    var remove=document.createElement('input');
    remove.type="button";
    remove.name="remove";
    remove.value="-"
    remove.setAttribute("onclick","remove_spelling("+spellingFormCount+")")

    spelling.appendChild(spell);
    spelling.appendChild(remove);

    spellingBox.appendChild(spelling)
}

function remove_spelling(spelling_count){
    var remove_target=document.getElementById("spelling-"+spelling_count)
    spellingBox.removeChild(remove_target);
}