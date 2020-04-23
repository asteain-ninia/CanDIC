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
 shelfID=0;
 textID=0;

 wordID=document.getElementById("wordID");
 formBox=document.getElementById("formBox");
 pronunBox=document.getElementById('pronunBox');
 tagBox=document.getElementById("tagBox");
 charBox=document.getElementById("charBox");

 contentsBox=document.getElementById('contentsBox')

 tags_queue_dictionary=0;
 classes_queue_dictionary=0;

 forms_queue=0;
 pronuns_queue=0;
 tags_queue=0;
 chars_queue=0;

 contents_queue=0;
 trans_queue=0;
 content_queue=0;

 entry_id=[];
 entry_form=[];
 entry_pronunciation=[];
 entry_tags=[];
 entry_char=[];
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
        contents=json.words[target_number].contents

        //各データの長さチェック
        forms_queue=entry.form.length;
        pronuns_queue=entry.pronunciation.length;
        tags_queue=entry.tags.length;
        chars_queue=entry.char.length;

        contents_queue=contents.length

        tag_show()

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

        customID=4;
        for(let i=0;i<contents_queue;i++){
            content_load(i);
        }

    }else{//新規作成時の画面
        wordID.innerHTML="NEW WORD";
        tag_show()
    }
}

function tag_show(){
    for(let i=0; i<tags_queue_dictionary;i++){//タグの表示
        var tag=document.createElement('span');
        tag.className="tag";
        tag.id="tag:"+dictionary.tags[i].id;
        tag_value=document.createTextNode(dictionary.tags[i].name);
        tag.appendChild(tag_value);
        tag.setAttribute("onclick","tag_switch("+i+")")
        tagBox.appendChild(tag);
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

function content_load(i){//地獄
    var contents_column=document.createElement('div');
    contents_column.name="contents_column";
    contents_column.id="content"+contentID;
    contents_column.className="contents_border"

    trans_queue=contents[i].trans.length;
    content_queue=contents[i].content.length;

    {//クラス情報設定
    var class_select=document.createElement('select');
    class_select.className="class";
    class_select.id="class"+contentID;

    for(let j=0;j<classes_queue_dictionary;j++){//option生成
            var class_option=document.createElement('option')
            class_option.text=dictionary.classes[j].name;
            class_option.value=dictionary.classes[j].id;
            class_select.appendChild(class_option)
    }
    
    if(i!==-1){class_select.selectedIndex=contents[i].class;}//selectedIndexにデータにあるIDを代入
    }contents_column.appendChild(class_select);

    var trans_box=document.createElement('div');
    trans_box.id="trans_box"
    trans_box.className="contents_border"

    var transID=0;
    for(let j=0;j<trans_queue;j++){//訳語窓生成

        var trans_form=document.createElement('form');
        trans_form.id="content"+contentID+"form"+transID;
        trans_form.className="input-1";

        trans_value=document.createElement('input');
        trans_value.id="content"+contentID+"trans"+transID;
        trans_value.className="large"

        var remove=document.createElement('input');//-ボタン
        remove.type="button";
        remove.name="remove";
        remove.value="-"

        remove.setAttribute("onclick","remove('content"+contentID+"form"+transID+"')")
        if(i!==-1){trans_value.value=contents[i].trans[j]}

        trans_form.appendChild(trans_value)
        trans_form.appendChild(remove)
        trans_box.appendChild(trans_form)
        transID++
    }

    var add_form=document.createElement('form')
    add_form.className="input-1"

    var add=document.createElement('input');
    add.type="button";
    add.name="add";
    add.value="+";
    add.setAttribute('onclick',"add_button('4')")

    add_form.appendChild(document.createElement('a'))
    add_form.appendChild(document.createElement('a'))
    add_form.appendChild(add);
    trans_box.appendChild(add_form);

    contents_column.appendChild(document.createElement('hr'))
    contents_column.appendChild(trans_box)
    contents_column.appendChild(add_form)
    
    
    var content_texts_box=document.createElement('div');
    content_texts_box.id="content_texts_box"
    content_texts_box.className="contents_border"


    textID=0;
    contents_content_queue=contents[i].content.length
    for(let j=0;j<contents_content_queue;j++){//text情報設定
        shelf_maker(i,j);
        function shelf_maker(i,j){
            var content_shelf=document.createElement('div');
            content_shelf.id="content"+contentID+"shelf"+shelfID

            var title_select=document.createElement('select');
            title_select.className="title";
            title_select.id="content"+contentID+"title"+textID;
            for(let k=0;k<title_queue_dictionary;k++){//option生成
                var title_option=document.createElement('option')
                title_option.text=dictionary.titles[k].name;
                title_option.value=dictionary.titles[k].id;
                title_select.appendChild(title_option)
            }
            //selectedIndexにデータにあるIDを代入
            if(i!==-1){title_select.selectedIndex=contents[i].content[j].title;}

            var content_texts_text=document.createElement('textarea')
            content_texts_text.value=contents[i].content[j].text
            content_texts_text.id="content"+contentID+"text"+textID;
            content_texts_text.className="textBox"

            var remove=document.createElement('input');//-ボタン
            remove.type="button";
            remove.name="remove";
            remove.value="-"
            remove.setAttribute("onclick","remove('"+"content"+contentID+"shelf"+shelfID+"')")
            
            content_shelf.appendChild(title_select);
            content_shelf.appendChild(document.createElement('br'));
            content_shelf.appendChild(content_texts_text)
            content_shelf.appendChild(remove)

            content_texts_box.appendChild(content_shelf)
            textID++
            shelfID++
        }
    }




 

    contents_column.appendChild(content_texts_box)
    contents_column.appendChild(document.createElement('hr'))

    contentsBox.appendChild(contents_column);
    contentID++
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
        case 4:
        
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