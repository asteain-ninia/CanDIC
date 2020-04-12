const electron = require('electron');
const {ipcRenderer}=electron;
const fs=require('fs')

let entry=null;
let dictionary=null;
let FormID=0;
let customID=0;

let wordID=document.getElementById("wordID");
let formBox=document.getElementById("formBox");
let pronunBox=document.getElementById('pronunBox');
let tagBox=document.getElementById("tagBox");
let charBox=document.getElementById("charBox");

let forms_queue=0;
let pronuns_queue=0;
let tags_queue=0;
let chars_queue=0;

let entry_id=[];
let entry_form=[];
let entry_pronunciation=[];
let entry_tags=[];
let entry_char=[];

ipcRenderer.on('target',(event,arg)=>{
    var target_number=arg.number;
    var target_path=arg.path;

    var data = fs.readFileSync(target_path, 'utf8') //pathの向こうにあるファイルをテキストで読む
    json = JSON.parse(data); //jsonでパース(ここ二行scrpt_1と共通)
    load_word(target_number);
});


function load_word(target_number){
    if(target_number!=-1){
        wordID.innerHTML="ID:"+target_number;

        entry=json.words[target_number].entry;
        dictionary=json.dictionary;

        //各データの長さチェック
        forms_queue=entry.form.length;
        pronuns_queue=entry.pronunciation.length;
        tags_queue=entry.tags.length;
        chars_queue=entry.char.length;

        var tags_queue_dictionary=dictionary.tags.length;//タグの表示
        for(let i=0; i<tags_queue_dictionary;i++){
            var tag=document.createElement('span');
            tag.className="tag";
            tag.id="tag:"+dictionary.tags[i].id;
            tag_value=document.createTextNode(dictionary.tags[i].name);
            tag.appendChild(tag_value);
            tagBox.appendChild(tag);
        }

        customID=1;//第一：語形の読み込み
        for(let i=0; i<forms_queue; i++){
            entry_load(customID,i);
        }

        customID=2;//第二：撥音の読み込み
        for(let i=0; i<pronuns_queue;i++){
            entry_load(customID,i);
        }

        for(let i=0; i<tags_queue_dictionary;i++){
            tag_load(i);
        }

    }else{//新規作成時の画面
        wordID.innerHTML="NEW WORD";
    }
}

function entry_load(custom,i){
    var element=document.createElement('form');//form要素
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
            element.className="input-1";
            formBox.appendChild(element);
            
            if(i!=-1)
                {column_value.value=entry.form[i];
                console.log(column_value.value)}
            break;
        case 2:
            element.appendChild(column_value);
            element.appendChild(remove);
            element.className="input-1";
            pronunBox.appendChild(element);
            if(i!=-1)
                {column_value.value=entry.pronunciation[i];
                console.log(column_value.value)}
            break;
        case 3:

            break;
    }
    FormID++
}

function tag_load(i){//tagIDがiのタグがデータにマッチするかを検査
    var tag_target=document.getElementById("tag:"+i);
        tag_target.setAttribute("style","background-color:gray;")
    for(let j=0;j<tags_queue;j++){
        if(entry.tags[j]==i){
            tag_target.setAttribute("style","true");
            console.log(dictionary.tags[i].name);
        }else{
            tag_target.setAttribute("flag","false");
        }
    }

}

function remove(target){
    //どの窓がremoveを行ったかを受け取って、それをですとろーい
    var remove_target=document.getElementById(target)
    remove_target.parentNode.removeChild(remove_target);
}

function add_button(customID){
    switch(customID){
        case 1:
        case 2:
            entry_load(customID,-1)
            break;
    }

}