const electron = require('electron');
const {ipcRenderer}=electron;
const fs=require('fs')

let entry=null;
let dictionary=null;
let contents=null

let customID=0;
let spellID=0;
let pronunID=0;
let charID=0;

let wordID=document.getElementById("wordID");
let formBox=document.getElementById("formBox");
let pronunBox=document.getElementById('pronunBox');
let tagBox=document.getElementById("tagBox");
let charBox=document.getElementById("charBox");

let contentsBox=document.getElementById('contentsBox')

let forms_queue=0;
let pronuns_queue=0;
let tags_queue_dictionary=0;
let tags_queue=0;
let chars_queue=0;

let contents_queue=0;
let classes_queue_dictionary=0;
let trans_queue=0;
let content_queue=0;

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
        contents=json.words[target_number].contents

        //各データの長さチェック
        forms_queue=entry.form.length;
        pronuns_queue=entry.pronunciation.length;
        tags_queue_dictionary=dictionary.tags.length;
        tags_queue=entry.tags.length;
        chars_queue=entry.char.length;

        contents_queue=contents.length
        classes_queue_dictionary=dictionary.classes.length;


        for(let i=0; i<tags_queue_dictionary;i++){//タグの表示
            var tag=document.createElement('span');
            tag.className="tag";
            tag.id="tag:"+dictionary.tags[i].id;
            tag_value=document.createTextNode(dictionary.tags[i].name);
            tag.appendChild(tag_value);
            tag.setAttribute("onclick","tag_switch("+i+")")
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

        for(let i=0; i<tags_queue_dictionary;i++){//第三・タグの読み込み
            tag_load(i);
        }

        customID=3;
        for(let i=0;i<chars_queue;i++){
            entry_load(customID,i)
        }

        for(let i=0;i<contents_queue;i++){
            content_load(i);
        }


    }else{//新規作成時の画面
        wordID.innerHTML="NEW WORD";
    }
}

function entry_load(customID,i){
    var element=document.createElement('form');//form要素

    var column_value=document.createElement('input');//窓
    column_value.type="text";
    column_value.name="content";
    element.appendChild(column_value);

    var remove=document.createElement('input');//-ボタン
    remove.type="button";
    remove.name="remove";
    remove.value="-"

    switch(customID){
        case 1:
            remove.setAttribute("onclick","remove('spell"+spellID+"')")
            element.appendChild(remove);
            element.className="input-1";
            element.name=element.id="spell"+spellID;
            formBox.appendChild(element);

            if(i!=-1){
                column_value.value=entry.form[i];
            }
            spellID++
            break;

        case 2:
            remove.setAttribute("onclick","remove('pronun"+pronunID+"')")
            element.appendChild(remove);
            element.className="input-1";
            element.name=element.id="pronun"+pronunID;
            pronunBox.appendChild(element);

            if(i!=-1){
                column_value.value=entry.pronunciation[i];
            }
            pronunID++
            break;

        case 3:
            remove.setAttribute("onclick","remove('char"+charID+"')")
            element.appendChild(remove);
            element.className="input-1";
            element.name=element.id="char"+charID;
            column_value.name="char_content";
            charBox.appendChild(element);
            if(i!=-1){
                column_value.value=entry.char[i];
            }
            charID++
            break;
    }
}

//tagIDがiのタグがデータにマッチするかを検査
function tag_load(i){
    var tag_target=document.getElementById("tag:"+i);

    for(let j=0;j<tags_queue;j++){
        if(entry.tags[j]==i){
            tag_target.setAttribute("flag","true");
            tag_target.setAttribute("style","background-color:white;")
            break;
        }else{
            tag_target.setAttribute("flag","false");
            tag_target.setAttribute("style","background-color:gray;")
        }
    }
}

//タグ状態の変更。(これそのうちtag_loadに一本化できるかも)
function tag_switch(i){
    var tag_target=document.getElementById("tag:"+i);
    tag_target_flag=tag_target.getAttribute("flag")
    if(tag_target_flag=="true"){
        tag_target.setAttribute("flag","false");
        tag_target.setAttribute("style","background-color:gray;")
    }else{
        tag_target.setAttribute("flag","true");
        tag_target.setAttribute("style","background-color:white;")
    }
}

function content_load(i){

    var contents_column=document.createElement('div');
    var contents_form=document.createElement('form');

    trans_queue=contents[i].forms.length;
    content_queue=contents[i].content.length;
    forms_queue

    var class_select=document.createElement('select')

    for(let j=0;j<classes_queue_dictionary;j++){
            var class_option=document.createElement('option')
            class_option.text=dictionary.classes[j].name
            class_option.value=dictionary.classes[j].id
            class_select.appendChild(class_option)
    }

    class_select.selectedIndex=contents[i].class;
    //selectedIndexにデータにあるIDを代入
    contents_column.appendChild(class_select);
    contentsBox.appendChild(contents_column);
}




//どの窓がremoveを行ったかを受け取って、それをですとろーい
function remove(target){
    console.log(target)
    var remove_target=document.getElementById(target)
    remove_target.parentNode.removeChild(remove_target);
}

function add_button(customID){
    switch(customID){
        case 1:
        case 2:
        case 3:
            entry_load(customID,-1)
            break;
    }

}