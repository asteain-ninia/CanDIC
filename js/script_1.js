const electron = require('electron');
const {
    ipcRenderer
} = electron;
const fs = require('fs')

const editor = document.getElementById('editor');
const dictionary = document.getElementById('dictionary')

ipcRenderer.on('4', function(event, arg) {
    console.log("filePath TNN Reserved!")
    path = arg[0]; //argを受け取ってpathに入れ込む
    console.log(path)

    // if(json.dictionary.type=="TNN"){
    //   //つくりかけ、OTM対応の布石
    //   //まずJSONであることを判定しなければいけないのでは？
    // }

    ReadDictionaryTNN(path);
    load_words();
})

function ReadDictionaryTNN(path) {
    var data = fs.readFileSync(path, 'utf8') //pathの向こうにあるファイルをテキストで読む
    json = JSON.parse(data); //jsonでパース

    word_count = json.words.length //単語数をカウント
    console.log("単語数" + word_count);
}

function load_words(){
    while (dictionary.firstChild) {//dictionary欄内の掃除
        dictionary.removeChild(dictionary.firstChild);
    }
    //単語欄の上下境
    var word_cap = document.createElement('div')
    word_cap.setAttribute("style", "height:0px;border-top:solid 2px gray;");
    dictionary.appendChild(word_cap);

    //forをぶん回して単語欄を生成する
    var word_queue = word_count;
    for (let i = 0; i < word_queue; i++) {
        addElement(json,i);
    }
}

function addElement(json,i) {

    var result=constElement(json,i);
    dictionary.appendChild(result); //最終工程：word_shelfをdictionary窓にぶち込む
}

function constElement(json,i){
    //参考:    https://www.sejuku.net/blog/49970
    //        https://www.sejuku.net/blog/30970
    //word_shelfをdiv要素として作成・idを設定(TNNの単語IDに一致)
    var word_shelf = document.createElement('div');
    word_shelf.id = "word" + json.words[i].entry.id;
    word_shelf.className="word_shelf"
    word_shelf.setAttribute('ondblclick',"OpenEdit("+json.words[i].entry.id+")")


    //entryiesをdiv要素として生成、この中にform要素とpronun要素・tag要素が入る
    var entries = document.createElement('div');
    entries.id = "entries";

    //formをspan要素として生成。ここに語形が入る
    var form = document.createElement('span');
    form.setAttribute("style", "font-size:18px;")
    //語形の列挙
    var forms = document.createTextNode(" " + json.words[i].entry.form + " ");
    form.appendChild(forms); //formの完成

    //pronunをspan要素として生成。すこし小さく表示する。
    var pronun = document.createElement('span')
    pronun.setAttribute("style", "font-size:13px;")

    //発音の列挙
    //始端の空白
    var pronuns = document.createTextNode("　");
    pronun.appendChild(pronuns)
    //forを回して発音を//に挟んで列挙
    var pronun_queue = json.words[i].entry.pronunciation.length;
    for (let j = 0; j < pronun_queue; j++) {
        pronuns = document.createTextNode(" /" + json.words[i].entry.pronunciation[j] + "/");
        pronun.appendChild(pronuns);
    };
    //終端の空白
    pronuns = document.createTextNode("　");
    pronun.appendChild(pronuns) //pronunの完成

    //tagをspan要素としていっぱい生成。すこし小さく、かつ囲んで表示する。
    var tags = document.createElement('span') //tagの入るspan
    var tags_queue = json.words[i].entry.tags.length; //tag数の取得
    for (let j = 0; j < tags_queue; j++) {
        var tag = document.createElement('span') //tagのspan
        var tagID = json.words[i].entry.tags[j];
        var tag_queue = json.dictionary.tags.length;
        //forを回してtags.idが一致する物を探す
        for (let k = 0; k < tag_queue; k++) {
            if (json.dictionary.tags[k].id == tagID) {
                var tagName = json.dictionary.tags[k].name;
            }
        };
        var tagDisplay = document.createTextNode(tagName);
        tag.appendChild(tagDisplay);
        tag.setAttribute("style", "font-size:13px;border:solid 1px black")
        tags.appendChild(tag);
    }
    //tagの完成

    var HR = document.createElement('hr');
    HR.setAttribute("style", "margin:0px;")

    //entriesへの登録とword_shelfへの登録
    entries.appendChild(form)
    entries.appendChild(pronun)
    entries.appendChild(tags)
    entries.appendChild(HR) //entriesの完成


    //----------------------------------------------------------//
    //次から語義などの部分
    //contentsをdiv要素として生成。
    var contents = document.createElement('div');
    contents.id = "contents";

    var trans_queue = json.words[i].contents.length; //この値が持っている品詞の数

    for (let j = 0; j < trans_queue; j++) {
        var Kthcontent = document.createElement('div') //K番目のdiv要素

        var class_column = document.createElement('span'); //品詞と訳が入る見出しのspan
        class_column.setAttribute("style", "border-bottom:solid 1px lightgray;")

        //品詞名の取り出し
        var classID = json.words[i].contents[j].class;
        var classes_queue = json.dictionary.classes.length;
        for (let k = 0; k < classes_queue; k++) { //forを回してclasses.idが一致する物を探す
            if (json.dictionary.classes[k].id == classID) {
                var className = json.dictionary.classes[k].name;
            }
        };

        Kthcontent.id = className;

        var classDisplay = document.createTextNode(className + "：" + json.words[i].contents[j].trans);
        class_column.appendChild(classDisplay); //classesの完成

        //-------------------------------------------------//
        //語義などcontent部分の実装
        var content_column = document.createElement('div');
        content_column.setAttribute("style", "border-left:solid 2px darkgray;margin-left:3px;padding:3px;")
        content_column.id = "content_column";

        var content_queue = json.words[i].contents[j].detail.length;
        for (let k = 0; k < content_queue; k++) {
            var title = document.createElement('span');
            title.setAttribute("style", "border-bottom: solid 1px gray");
            var titleID = json.words[i].contents[j].detail[k].title;
            var title_queue = json.dictionary.titles.length;
            for (let l = 0; l < title_queue; l++) {
                if (json.dictionary.titles[l].id == titleID) {
                    var titleName = json.dictionary.titles[l].name;
                }
            }
            var titleDisplay = document.createTextNode(titleName);
            title.appendChild(titleDisplay);
            content_column.appendChild(title);

            var contentBox = document.createElement('div')
            contentBox.id = "contentBox";
            var contentDisplay = document.createTextNode(
                json.words[i].contents[j].detail[k].text)
            contentBox.appendChild(contentDisplay);
            content_column.appendChild(contentBox);
        }

        //Kthcontentへの登録とcontentsへの登録
        Kthcontent.appendChild(class_column);
        Kthcontent.appendChild(content_column);
        contents.appendChild(Kthcontent)
    }

    word_shelf.appendChild(entries)
    word_shelf.appendChild(contents)

    return word_shelf
}




function debugButton() {
    while (dictionary.firstChild) {
        dictionary.removeChild(dictionary.firstChild);
    }
    path = "datas/sample.json";
    ReadDictionaryTNN(path);
    load_words();
}

function OpenEdit(targetID) {
    var editword ={
        "number":targetID,
        "path":path,
    }
    console.log(editword);
    ipcRenderer.send('editor_signal', editword)
}

function OpenEditDEV(targetID){
    var editword ={
        "number":targetID,
        "path":"datas/sample.json",
    }

    console.log(editword);
    ipcRenderer.send('editor_signal', editword)
}
ipcRenderer.on('modify_signal',(event,arg)=>{//単語編集時の処理

    ReadDictionaryTNN(arg.target_path);
    var reload=constElement(json,arg.target_number);
    var reload_target=document.getElementById("word"+arg.target_number)
    var reload_target_next=reload_target.nextElementSibling;

    console.log(reload_target_next)

    if(reload_target){
        console.log("reload:"+arg.target_number)
        reload_target.parentNode.removeChild(reload_target);

        if(reload_target_next){
            dictionary.insertBefore(reload,reload_target_next);
        }else{
            dictionary.appendChild(reload)
        }
    }
})


function dic_search(){
    search_target= document.getElementById("search").value;
    console.log(search_target)
    var resultJSON={words:[]};
    var word_queue_search=json.words.length;
    for(let i=0;i<word_queue_search;i++){
        var trans_queue_search=json.words[i].entry.form.length;
        for(let j=0;j<trans_queue_search;j++){
            var trans_target_search=json.words[i].entry.form[j]
            if(trans_target_search.includes(search_target)){
                console.log("found!!");
                resultJSON.words.push(json.words[i]);
                break;
            }
        }
    }
    if(search_target.length==0){
        resultJSON=json;
    }
    resultJSON.dictionary=json.dictionary
    resultJSON.CanDIC=json.CanDIC

    while (dictionary.firstChild) {//dictionary欄内の掃除
        dictionary.removeChild(dictionary.firstChild);
    }
    //単語欄の上下境
    var word_cap = document.createElement('div')
    word_cap.setAttribute("style", "height:0px;border-top:solid 2px gray;");
    dictionary.appendChild(word_cap);

    //forをぶん回して単語欄を生成する
    var word_queue = resultJSON.words.length;
    for (let i=0;i<word_queue;i++) {
        addElement(resultJSON,i);
    }
    console.log(resultJSON);
}