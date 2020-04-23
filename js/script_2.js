const electron = require('electron');
const {ipcRenderer}=electron;
const fs=require('fs')
{//宣言pa
 entry=null;
 dictionary=null;
 contents=null

 customID=0;
 
 spellID=0;
 pronunID=0;
 charID=0;

 contentID=0;
 transID=0;


 wordID=document.getElementById("wordID");
 formBox=document.getElementById("formBox");
 pronunBox=document.getElementById('pronunBox');
 tagBox=document.getElementById("tagBox");
 charBox=document.getElementById("charBox");

 contentsBox=document.getElementById('contentsBox')

 tags_queue_dictionary=0;

 forms_queue=0;
 pronuns_queue=0;
 tags_queue=0;
 chars_queue=0;

 classes_queue_dictionary=0;
 contents_queue=0;
 trans_queue=0;
 detail_queue=0;

 entry_id=[];
 entry_form=[];
 entry_pronunciation=[];
 entry_tags=[];
 entry_char=[];
}

{//ショートカットpa
 function createElement(x){return document.createElement(x)}
}

ipcRenderer.on('target',(event,arg)=>{
    var target_number=arg.number;
    var target_path=arg.path;

    var data = fs.readFileSync(target_path, 'utf8') //pathの向こうにあるファイルをテキストで読む
    json = JSON.parse(data); //jsonでパース(ここ二行scrpt_1と共通)
    load_word(target_number);
});

function load_word(target_number){
        dictionary=json.dictionary;

        tags_queue_dictionary=dictionary.tags.length;
        classes_queue_dictionary=dictionary.classes.length;
        title_queue_dictionary=dictionary.titles.length

    if(target_number!=-1){
        wordID.innerHTML="ID:"+target_number;

        entry=json.words[target_number].entry;
        //各データの長さチェック
        forms_queue=entry.form.length;
        pronuns_queue=entry.pronunciation.length;
        tags_queue=entry.tags.length;
        chars_queue=entry.char.length;
        
        contents=json.words[target_number].contents
        contents_queue=contents.length

        tag_show()

        customID=1;//語形の読み込み
        for(let i=0; i<forms_queue; i++){
            entry_load(customID,i);
        }

        customID=2;//撥音の読み込み
        for(let i=0; i<pronuns_queue;i++){
            entry_load(customID,i);
        }

        //タグの読み込み
        for(let i=0; i<tags_queue_dictionary;i++){
            tag_load(i);
        }

        customID=3;//文字の読み込み
        for(let i=0;i<chars_queue;i++){
            entry_load(customID,i)
        }

        //訳の読み込み
        for(let i=0;i<contents_queue;i++){
            contents_load(i);
        }

    }else{//新規作成時の画面
        wordID.innerHTML="NEW WORD";
        tag_show()
    }
}

function tag_show(){
    for(let i=0; i<tags_queue_dictionary;i++){//タグの表示
        var tag=createElement('span');
        tag.className="tag";
        tag.id="tag:"+dictionary.tags[i].id;
        tag_value=document.createTextNode(dictionary.tags[i].name);
        tag.appendChild(tag_value);
        tag.setAttribute("onclick","tag_switch("+i+")")
        tagBox.appendChild(tag);
    }
}

function entry_load(customID,i){
    var element=createElement('form');//form要素

    var column_value=createElement('input');//窓
    column_value.type="text";
    column_value.name="content";
    element.appendChild(column_value);

    var remove=createElement('input');//-ボタン
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

function contents_load(i){
    console.log("contentID:"+contentID);
    var contents_column=createElement('div')

    var class_selecion=createElement('select');
    class_selecion.className="large"

    //データの読み込み(iが-1でなければ)
    if(i!=-1){
        classID=contents[i].class
        trans_queue=contents[i].trans.length
        detail_queue=contents[i].detail.length
    }

    for(j=0;j<classes_queue_dictionary;j++){

        var option=createElement('option')
        option.value=dictionary.classes[j].id;//value設定
        option.appendChild(document.createTextNode(dictionary.classes[j].name))//表示名設定
        class_selecion.appendChild(option);

        if(classID==dictionary.classes[j].id){
            class_selecion.selectedIndex=classID
        }
    }
    contents_column.appendChild(class_selecion);

    transID=0;

    for(let j=0;j<trans_queue;j++){//trans読み込みループ
        var trans_form=createElement('form');//form要素
        trans_form.className="input-1"
        trans_form.id="content"+contentID+"trans"+transID

        var trans_value=createElement('input');//窓
        trans_value.type="text";
        trans_value.name="content";
        trans_value.value=contents[i].trans[j]

        var remove=createElement('input');//-ボタン
        remove.type="button";
        remove.name="remove";
        remove.value="-";
        remove.setAttribute("onclick","remove('content"+contentID+"trans"+transID+"')")


        trans_form.appendChild(trans_value);
        trans_form.appendChild(remove);

        contents_column.appendChild(trans_form);
        transID++
    }

    detailID=0;
    for(let j=0;j<detail_queue;j++){
        console.log("detailID:"+detailID)
        detailID++
    }

    contentsBox.appendChild(contents_column)
    contentID++
}




//どの窓がremoveを行ったかを受け取って、それをですとろーい
function remove(target){
    console.log("removed:"+target)
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
        case 4:
            contents_load(-1)
            break;
    }
}

function agree(){
    //保存処理
}
function disagree(){
    ipcRenderer.send('close_signal',1)
}

ipcRenderer.on('1',function(event, arg) {
    console.log(arg)
})