const electron = require('electron');
const {ipcRenderer}=electron;
const fs=require('fs')
{//宣言pa
 target_path=null;

 entry=null;
 dictionary=null;
 contents=null

 customID=0;
 
 spellID=0;
 pronunID=0;
 charID=0;
 tagID=0;

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
}

{//ショートカットpa
 function createElement(x){return document.createElement(x)}
}

ipcRenderer.on('target',(event,arg)=>{
    target_number=arg.number;
    target_path=arg.path;

    var data = fs.readFileSync(target_path, 'utf8') //pathの向こうにあるファイルをテキストで読む
    json = JSON.parse(data); //jsonでパース(ここ二行scrpt_1と共通)
    load_word(target_number);
});

function load_word(target_number){
        dictionary=json.dictionary;

        tags_queue_dictionary=dictionary.tags.length;
        classes_queue_dictionary=dictionary.classes.length;
        titles_queue_dictionary=dictionary.titles.length
    console.log(json);

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
        tag.id="tag"+dictionary.tags[i].id;
        tag_value=document.createTextNode(dictionary.tags[i].name);
        tag.appendChild(tag_value);
        tag.setAttribute("onclick","tag_switch("+i+")")
        tagBox.appendChild(tag);
        tagID++
    }
}

function entry_load(customID,i){
    var element=createElement('div');//form要素


    var column_value=createElement('input');//窓
    column_value.type="text";

    element.appendChild(column_value);

    var remove=createElement('input');//-ボタン
    remove.type="button";
    remove.name="remove";
    remove.value="-"

    switch(customID){
        case 1:
            remove.setAttribute("onclick","remove('spell"+spellID+"Box')")
            element.appendChild(remove);

            element.id="spell"+spellID+"Box"
            element.className="input-1";
            column_value.id="spell"+spellID;
            column_value.className="large";
            formBox.appendChild(element);

            if(i!=-1){
                column_value.value=entry.form[i];
            }
            spellID++
            break;

        case 2:
            remove.setAttribute("onclick","remove('pronun"+pronunID+"Box')")
            element.appendChild(remove);

            element.id="pronun"+spellID+"Box"
            element.className="input-1";
            column_value.id="pronun"+pronunID;
            column_value.className="large";
            pronunBox.appendChild(element);

            if(i!=-1){
                column_value.value=entry.pronunciation[i];
            }
            pronunID++
            break;

        case 3:
            remove.setAttribute("onclick","remove('char"+charID+"Box')")

            element.id="char"+charID+"Box"
            element.className="char"
            column_value.id="char"+charID;
            column_value.className="char_value";

            var small_value_div=createElement('div');
            small_value_div.appendChild(column_value);
            element.appendChild(small_value_div)

            var small_remove_div=createElement('div');
            small_remove_div.appendChild(remove);
            element.appendChild(small_remove_div);

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
    var tag_target=document.getElementById("tag"+i);

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
    var tag_target=document.getElementById("tag"+i);
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
    contents_column.className="content"

    //データの読み込み(iが-1でなければ)
    if(i!=-1){
        classID=contents[i].class
        trans_queue=contents[i].trans.length
        detail_queue=contents[i].detail.length
    }

    var selectionBox=createElement('div')
    selectionBox.id="selectionBox"
    selectionBox.className="selectionBox"

    var class_selecion=createElement('select');
    class_selecion.className="large"
    class_selecion.id="class"+contentID

    for(j=0;j<classes_queue_dictionary;j++){//class設定ループ
        var option=createElement('option')
        option.value=dictionary.classes[j].id;//value設定
        option.appendChild(document.createTextNode(dictionary.classes[j].name))//表示名設定
        class_selecion.appendChild(option);
        if(i!=-1){
            if(classID==dictionary.classes[j].id){
                class_selecion.selectedIndex=classID
            }
        }
    }
    selectionBox.appendChild(class_selecion);

    var remove=createElement('input');//-ボタン
    remove.type="button";
    remove.name="remove";
    remove.value="-";
    remove.setAttribute("onclick","remove('contents"+contentID+"')")

    selectionBox.appendChild(remove);

    contents_column.appendChild(selectionBox)

    var transBox=createElement('div')
    transBox.id="content"+contentID+"transBox"
    transBox.className="contents_border"
    transBox.setAttribute("contentID",contentID);
    transID=0;
    for(let j=0;j<trans_queue;j++){//trans読み込みループ
        var trans_form=createElement('form');//form要素
        trans_form.className="input-1"
        trans_form.id="content"+contentID+"trans"+transID+"Box";

        var trans_value=createElement('input');//窓
        trans_value.type="text";
        trans_value.className="large";
        trans_value.id="content"+contentID+"trans"+transID;
        if(i!=-1){
            trans_value.value=contents[i].trans[j]
        }

        var remove=createElement('input');//-ボタン
        remove.type="button";
        remove.name="remove";
        remove.value="-";
        remove.setAttribute("onclick","remove('content"+contentID+"trans"+transID+"Box')")

        trans_form.appendChild(trans_value);
        trans_form.appendChild(remove);

        transBox.appendChild(trans_form);
        transID++
    }
    transBox.setAttribute("transID",transID)

    contents_column.appendChild(transBox)

    var trans_add=createElement('form');
    trans_add.className="input-1";
    var add=createElement('input');//+ボタン
    add.type="button";
    add.name="add";
    add.value="+";
    add.setAttribute("onclick","add_trans('content"+contentID+"transBox',-1)")

    trans_add.appendChild(createElement('a'))
    trans_add.appendChild(createElement('a'))
    trans_add.appendChild(add)

    contents_column.appendChild(trans_add)
    contents_column.appendChild(createElement('hr'))

    var detailBox=createElement('div');
    detailBox.id="content"+contentID+"detailBox"
    detailBox.className="contents_border"
    detailBox.setAttribute("contentID",contentID)
    detailID=0;
    for(let j=0;j<detail_queue;j++){//detail読み込みループ

        var detail_column=createElement('div');
        detail_column.id="content"+contentID+"detail"+detailID;
        detail_column.className="contents_border"


        if(i!=-1){
            var titleID=contents[i].detail[j].title;
        }

        var titleBox=createElement('div');
        titleBox.id="titleBox";
        titleBox.className="selectionBox";
    
        var title_selecion=createElement('select');
        title_selecion.className="large"
        title_selecion.id="content"+contentID+"detail"+detailID+"select"

        for(k=0;k<titles_queue_dictionary;k++){//title設定ループ

            var option=createElement('option')
            option.value=dictionary.titles[k].id;//value設定
            option.appendChild(document.createTextNode(dictionary.titles[k].name))//表示名設定
            title_selecion.appendChild(option);
            if(i!=-1){
                if(classID==dictionary.classes[k].id){
                    title_selecion.selectedIndex=titleID
                }
            }
        }
        titleBox.appendChild(title_selecion);

        var remove=createElement('input');//-ボタン
        remove.type="button";
        remove.name="remove";
        remove.value="-";
        remove.setAttribute("onclick","remove('content"+contentID+"detail"+detailID+"')");
        titleBox.appendChild(remove);

        detail_column.appendChild(titleBox);

        var textBox=createElement('textarea');
        textBox.id="content"+contentID+"detail"+detailID+"text"
        textBox.className="textBox"
        if(i!=-1){
            textBox.value=contents[i].detail[j].text;
        }


        detail_column.appendChild(textBox);
        detail_column.appendChild(createElement('hr'));
        detailBox.appendChild(detail_column);
        
        detailID++;
    }

    detailBox.setAttribute("detailID",detailID)
    contents_column.appendChild(detailBox);

    var detail_add=createElement('form');
    detail_add.className="input-1";
    var add=createElement('input');//+ボタン
    add.type="button";
    add.name="add";
    add.value="+";
    add.setAttribute("onclick","add_detail('content"+contentID+"detailBox',-1)")

    detail_add.appendChild(createElement('a'))
    detail_add.appendChild(createElement('a'))
    detail_add.appendChild(add)

    contents_column.appendChild(detail_add)
    contents_column.appendChild(createElement('hr'))

    contentsBox.appendChild(contents_column)
    contentID++

    {//変数の0化
        trans_queue=0
        detail_queue=0
    }
}

//どの窓がremoveを行ったかを受け取って、それをですとろーい
function remove(target){
    console.log("removed:"+target)
    var remove_target=document.getElementById(target)
    remove_target.parentNode.removeChild(remove_target);
}

function add_button(customID){
    if(customID==4){
        contents_load(-1);
    }
    entry_load(customID,-1)
}

function add_trans(targetBox,i){
    target=document.getElementById(targetBox)
    
    var contentID_current=target.getAttribute("contentid");
    var transID_current=target.getAttribute("transid");
    
    var trans_form=createElement('form');//form要素
    trans_form.className="input-1"
    trans_form.id="content"+contentID_current+"trans"+transID_current+"Box"

    var trans_value=createElement('input');//窓
    trans_value.type="text";
    trans_value.className="large";
    trans_value.id="content"+contentID_current+"trans"+transID_current;
    if(i!=-1){
        trans_value.value=contents[i].trans[j]
    }

    var remove=createElement('input');//-ボタン
    remove.type="button";
    remove.name="remove";
    remove.value="-";
    remove.setAttribute("onclick","remove('content"+contentID_current+"trans"+transID_current+"Box')")

    trans_form.appendChild(trans_value);
    trans_form.appendChild(remove);

    target.appendChild(trans_form);
    transID_current++
    target.setAttribute("transid",transID_current)
}

function add_detail(targetBox,i){
    target=document.getElementById(targetBox)

    var contentID_current=target.getAttribute("contentid");
    var detailID_current=target.getAttribute("detailid");

    var detail_column=createElement('div');
    detail_column.id="content"+contentID_current+"detail"+detailID_current;
    detail_column.className="contents_border"

    var titleBox=createElement('div');
    titleBox.id="titleBox";
    titleBox.className="selectionBox";

    var title_selecion=createElement('select');
    title_selecion.className="large"
    title_selecion.id="content"+contentID_current+"detail"+detailID_current+"select"

    for(k=0;k<titles_queue_dictionary;k++){//title設定ループ

        var option=createElement('option')
        option.value=dictionary.titles[k].id;//value設定
        option.appendChild(document.createTextNode(dictionary.titles[k].name))//表示名設定
        title_selecion.appendChild(option);
        
    }
    titleBox.appendChild(title_selecion);

    var remove=createElement('input');//-ボタン
    remove.type="button";
    remove.name="remove";
    remove.value="-";
    remove.setAttribute("onclick","remove('content"+contentID_current+"detail"+detailID_current+"')");
    titleBox.appendChild(remove);

    detail_column.appendChild(titleBox);

    var textBox=createElement('textarea');
    textBox.id="content"+contentID_current+"detail"+detailID_current+"text"
    textBox.className="textBox"

    detail_column.appendChild(textBox);
    detail_column.appendChild(createElement('hr'));

    target.appendChild(detail_column);
    detailID_current++;
    target.setAttribute("detailid",detailID_current)
}

function agree(){//保存処理
    if(target_number==-1){

        var newID=json.words.length
        console.log(newID)
        var new_word={
                    "entry": {
                        "id":newID,
                        "form": [],
                        "pronunciation": [],
                        "tags": [],
                        "char": []
                    },
                    "contents": [],
                    "variations": [],
                    "relations": []
                }
        json.words.push(new_word);
        console.log(json)

        target_number=newID;
    }
    entry=json.words[target_number].entry;
    contents=json.words[target_number].contents;

    entry.form=[];//form初期化
    for(let i=0;i<spellID;i++){//spellループ
        var spelling_value=document.getElementById("spell"+i);
        if(spelling_value){if(spelling_value.value){
                entry.form.push(spelling_value.value);
            }}
    }console.log(entry.form);

    entry.pronunciation=[];//pronun初期化
    for(let i=0;i<pronunID;i++){//pronunループ
        var pronun_value=document.getElementById("pronun"+i);
        if(pronun_value){if(pronun_value.value){
            entry.pronunciation.push(pronun_value.value);
        }}
    }console.log(entry.pronunciation);

    entry.tags=[];//tags初期化
    for(let i=0;i<tagID;i++){//tagsループ
        var tag_element=document.getElementById("tag"+i);
        if(tag_element){
            if(tag_element.getAttribute("flag")){
                if(tag_element.getAttribute("flag")=="true"){
                    entry.tags.push(i);
                }
            }
        }
    }console.log(entry.tags);

    entry.char=[];//char初期化
    for(let i=0;i<charID;i++){//charループ
        var char_value=document.getElementById("char"+i);
        if(char_value){if(char_value.value){
            entry.char.push(char_value.value);
        }}
    }console.log(entry.char);

    for (let i=0;i<contentID;i++){//contentsループ

        if(!contents[i]){//データがない時、デフォルトをぶち込む
            contents[i]={
                    "class": 0,
                    "trans": [],
                    "detail":[]
                }
        }

        var class_value=document.getElementById("class"+i)
        contents[i].class=[];//class初期化
        contents[i].class=class_value.selectedIndex//class取得
        console.log(contents[i].class)

        contents[i].trans=[];//trans初期化
        var trans_save_queue=document.getElementById("content"+i+"transBox").getAttribute("transid")
        for(let j=0;j<trans_save_queue;j++){//transループ
            var trans_value=document.getElementById("content"+i+"trans"+j);
            if(trans_value){if(trans_value.value){
                contents[i].trans.push(trans_value.value);
            }}
        }console.log(contents[i].trans);


        var detail_save_queue=document.getElementById("content"+i+"detailBox").getAttribute("detailid")
        
        for(let j=0;j<detail_save_queue;j++){//detailループ

            contents[i].detail[j]=null;
            var detail_select_value=document.getElementById("content"+i+"detail"+j+"select");
            if(detail_select_value){if(detail_select_value.value){
                var detail_text_value=document.getElementById("content"+i+"detail"+j+"text");
                if(detail_text_value){if(detail_text_value.value){

                    var detail_cash={
                        title:detail_select_value.value,
                        text:detail_text_value.value,
                    };
                    contents[i].detail[j]=detail_cash;

                }}
            }}
        }
    }
    console.log(entry);
    console.log(contents);

    fs.writeFileSync(target_path, JSON.stringify(json), 'utf8')

    var modify_pack={
        "save_flag":0,
        "target_number":target_number
    };
    ipcRenderer.send('close_signal',modify_pack)
}
function disagree(){
    var modify_pack={
        "save_flag":1,
        "target_number":target_number
    };
    ipcRenderer.send('close_signal',modify_pack)
}

ipcRenderer.on('1',function(event, arg) {
    console.log(arg)
})