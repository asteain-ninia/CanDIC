const electron = require('electron');
const {ipcRenderer}=electron;
const fs=require('fs')

let entry=null;
let FormID=0;
let customID=0;
let wordID=document.getElementById("wordID");
let spellingBox=document.getElementById("spellingBox");
let pronunBox=document.getElementById('pronunBox');
let charBox=document.getElementById("charBox");
let tagBox=document.getElementById("tagBox");



ipcRenderer.on('target',(event,arg)=>{
    var target_number=arg.number;
    var target_path=arg.path;

    var data = fs.readFileSync(target_path, 'utf8') //pathの向こうにあるファイルをテキストで読む
    json = JSON.parse(data); //jsonでパース(ここ二行scrpt_1と共通)
    load_word(target_number);
});

function load_word(target_number){
    if(target_number!=-1){
        
        //各データの長さチェック
        entry=json.words[target_number].entry
        var forms_queue=entry.form.length;
        var pronuns_queue=entry.pronunciation.length;
        wordID.innerHTML="ID:"+target_number;

        customID=1;//第一：語形の読み込み
        for(let i=0; i<forms_queue; i++){
            entry_load(customID,i);
        }

        customID=2;
        for(let i=0; i<pronuns_queue;i++){
            entry_load(customID,i);
        }

    }else{//新規作成時の画面
        wordID.innerHTML="NEW WORD";
    }
}

function entry_load(custom,i){
    var element=document.createElement('form');
    element.className="input-1";
    element.name=element.id=FormID;

    var column_value=document.createElement('input');//窓
    column_value.type="text";
    column_value.name="content";

    var remove=document.createElement('input');//-ボタン
    remove.type="button";
    remove.name="remove";
    remove.value="-"
    remove.setAttribute("onclick","remove("+FormID+")")

    switch(custom){
        case 1:
            element.appendChild(column_value);
            element.appendChild(remove);
            spellingBox.appendChild(element);
            if(i!=-1)
                {column_value.value=entry.form[i];}
            break;
        case 2:
            element.appendChild(column_value);
            element.appendChild(remove);
            pronunBox.appendChild(element);
            if(i!=-1)
                {column_value.value=entry.pronunciation[i];}
            break;
    }
    FormID++
}

function remove(target){
    //どの窓がremoveを行ったかを受け取って、それをですとろーい
    var remove_target=document.getElementById(target)
    remove_target.parentNode.removeChild(remove_target);
}

function add_button(customID,i){
    entry_load(customID,i)
}