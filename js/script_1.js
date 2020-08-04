const electron = require('electron');
const {ipcRenderer} = electron;
const fs = require('fs');
const path = require('path');

var DefaultJSON=
    {
        "words": [
            {
                "entry": {
                    "id": 0,
                    "form": [],
                    "pronunciation": [],
                    "tags": [],
                    "char": []
                },
                "contents": [],
                "variations": [],
                "relations": []
            },
        ],
        "dictionary": {
            "type": "TNN",
            "version": "beta 1",
            "language": "",
            "classes": [],
            "titles": [],
            "tags": []
        },
        "CanDIC": {
            "alphabet": "",
            "font": ""
        }
    }

const editor = getElementById('editor');
const dictionary = getElementById('dictionary')
let Filepath=null;

function createElement(type){return document.createElement(type);}
function createTextNode(value){return document.createTextNode(value);}
function getElementById(target){return document.getElementById(target);}


ipcRenderer.on('4', function(event, arg) {
    receiveData(arg);
})

function receiveData(arg){
    Filepath = arg[0]; //argを受け取って変数Filepathに入れ込む
    console.log("目標："+Filepath);
    console.log("形式確認："+path.extname(Filepath));
    if(path.extname(Filepath)==".json"){//jsonであることを判定
        ReadDictionaryJSON(Filepath);
        if(json.dictionary.type=="TNN"){//jsonはjsonでもTNNであることを確認
            console.log("認識　TNN-JSON："+json.dictionary.version)
            word_count = json.words.length //単語数をカウント
            console.log("単語数：" + word_count);
            load_words();
        }else{//jsonであってもTNNでない場合
            console.log("読み込み失敗：JSONであるが、TNNでない。")
        }
    }else{//jsonでない場合
        console.log("読み込み失敗：JSONでない。")
    }
}

function ReadDictionaryJSON(Filepath) {
    var data = fs.readFileSync(Filepath, 'utf8') //Filepathにあるファイルをテキストで読む
    json = JSON.parse(data); //jsonでパース
}

function load_words(){
    while (dictionary.firstChild) {//dictionary欄内の掃除
        dictionary.removeChild(dictionary.firstChild);
    }
    //単語欄の上下境
    var word_cap = createElement('div')
    word_cap.setAttribute("style", "height:0px;border-top:solid 2px gray;");
    dictionary.appendChild(word_cap);

    //forをぶん回して単語欄を生成する
    var word_queue = json.words.length;
    for (let i = 0; i < word_queue; i++) {
        addElement(json,i);
    }
}

function addElement(json,i) {
    var result=constElement(json,i);
    dictionary.appendChild(result); //word_shelfをdictionary窓にぶち込む
}

function constElement(json,i){
    //参考:    https://www.sejuku.net/blog/49970
    //         https://www.sejuku.net/blog/30970
    //word_shelfをdiv要素として作成・idを設定(TNNの単語IDに一致)
    console.log("単語欄生成:"+i);
    var word_shelf = createElement('div');
    word_shelf.id = "word" + json.words[i].entry.id;
    word_shelf.className="word_shelf";
    word_shelf.setAttribute('ondblclick',"OpenEdit("+json.words[i].entry.id+")");

    //entryiesをdiv要素として生成、この中にform要素とpronun要素・tag要素が入る
    var entries = createElement('div');
    entries.id = "entries";

    //formをspan要素として生成。ここに語形が入る
    var form = createElement('span');
    form.setAttribute("style", "font-size:18px;");

    //語形の列挙
    var forms = createTextNode(" " + json.words[i].entry.form + " ");
    form.appendChild(forms); //formの完成

    //pronunsをspan要素として生成。すこし小さく表示する。
    var pronuns = createElement('span')
    pronuns.setAttribute("style", "font-size:13px;")

    //発音の列挙
    //始端の空白
    var pronun_space = createTextNode("　");
    pronuns.appendChild(pronun_space)
    //forを回して発音を//に挟んで列挙
    var pronun_queue = json.words[i].entry.pronunciation.length;
    for (let j = 0; j < pronun_queue; j++) {
        var pronun = createTextNode(" /" + json.words[i].entry.pronunciation[j] + "/");
        pronuns.appendChild(pronun);
    };
    //終端の空白
    pronuns.appendChild(pronun_space) //pronunsの完成

    //tagsをspan要素として生成。これがいっぱいのtagをかかえる。
    var tags = createElement('span') //tagの入るspan

    var tags_queue = json.words[i].entry.tags.length; //tag数の取得
    for (let j = 0; j < tags_queue; j++) {
        //tagをspan要素としていっぱい生成。すこし小さく、かつ囲んで表示する。
        var tag = createElement('span') //tagのspan

        //forを回してtags.idがtagデータに一致する物を探す
        var tagID = json.words[i].entry.tags[j];
        var tag_queue = json.dictionary.tags.length;
        for (let k = 0; k < tag_queue; k++) {
            if (json.dictionary.tags[k].id == tagID) {
                var tagName = json.dictionary.tags[k].name;
            }
        };
        var tagDisplay = createTextNode(tagName);

        tag.appendChild(tagDisplay);
        tag.setAttribute("style", "font-size:13px;border:solid 1px black");
        tags.appendChild(tag);
    }
    //tagの完成

    var HR = createElement('hr');//語形末の線
    HR.setAttribute("style", "margin:0px;")

    //entriesへの登録
    entries.appendChild(form)
    entries.appendChild(pronuns)
    entries.appendChild(tags)
    entries.appendChild(HR) //entriesの完成


    //----------------------------------------------------------//
    //語義などの部分
    //contentsをdiv要素として生成。
    var contents = createElement('div');
    contents.id = "contents";

    var trans_queue = json.words[i].contents.length; //持っている品詞の数

    for (let j = 0; j < trans_queue; j++) {
        var content = createElement('div') //K番目のdiv要素

        var class_column = createElement('span'); //品詞と訳が入る見出しのspan
        class_column.setAttribute("style", "border-bottom:solid 1px lightgray;")

        //品詞名の取り出し
        var classID = json.words[i].contents[j].class;
        var classes_queue = json.dictionary.classes.length;
        for (let k = 0; k < classes_queue; k++) { //forを回してclasses.idが一致する物を探す
            if (json.dictionary.classes[k].id == classID) {
                var className = json.dictionary.classes[k].name;
            }
        };

        content.id = className;

        var classDisplay = createTextNode(className + "：" + json.words[i].contents[j].trans);
        class_column.appendChild(classDisplay); //classesの完成

        //-------------------------------------------------//
        //語義などcontent部分の実装
        var content_column = createElement('div');
        content_column.setAttribute("style", "border-left:solid 2px darkgray;margin-left:3px;padding:3px;")
        content_column.id = "content_column";

        var content_queue = json.words[i].contents[j].detail.length;
        for (let k = 0; k < content_queue; k++) {
            var title = createElement('span');
            title.setAttribute("style", "border-bottom: solid 1px gray");

            var titleID = json.words[i].contents[j].detail[k].title;
            var title_queue = json.dictionary.titles.length;
            for (let l = 0; l < title_queue; l++) {
                if (json.dictionary.titles[l].id == titleID) {
                    var titleName = json.dictionary.titles[l].name;
                }
            }
            var titleDisplay = createTextNode(titleName);
            title.appendChild(titleDisplay);
            content_column.appendChild(title);

            var contentBox = createElement('div')
            contentBox.id = "contentBox";
            var contentDisplay = createTextNode(json.words[i].contents[j].detail[k].text)
            contentBox.appendChild(contentDisplay);
            content_column.appendChild(contentBox);
        }

        //contentへの登録とcontentsへの登録
        content.appendChild(class_column);
        content.appendChild(content_column);
        contents.appendChild(content)
    }

    word_shelf.appendChild(entries)
    word_shelf.appendChild(contents)

    return word_shelf
}

function debugButton() {
    var arg=["datas/sample.json"];
    receiveData(arg);
}

function OpenEdit(targetID) {
    var editword ={
        "number":targetID,
        "Filepath":Filepath,
    }
    console.log(editword);
    ipcRenderer.send('editor_signal', editword)
}

function OpenEditDEV(targetID){
    var editword ={
        "number":targetID,
        "Filepath":"datas/sample.json",
    }

    console.log(editword);
    ipcRenderer.send('editor_signal', editword)
}
ipcRenderer.on('modify_signal',(event,arg)=>{//単語編集時の処理

    switch(arg.save_flag){
        case 0:
            ReadDictionaryJSON(arg.target_path);
            //console.log(arg)
            //console.log(json)
            var targetIndex=0;
            for(let i =0;i<json.words.length;i++){
                if(json.words[i].entry.id==arg.target_number){
                    targetIndex=i
                    break;
                }
            }
            //console.log("targetNumber:"+arg.target_number);
            //console.log("targetIndex:"+targetIndex);

            var reload=constElement(json,targetIndex);
            //console.log("constElement:"+reload)
            var reload_target=getElementById("word"+arg.target_number);
            if(reload_target){
                var reload_target_next=reload_target.nextElementSibling;
                //console.log(reload_target_next)

                console.log("reload:"+arg.target_number)
                reload_target.parentNode.removeChild(reload_target);

                if(reload_target_next){
                    dictionary.insertBefore(reload,reload_target_next);
                }else{
                    dictionary.appendChild(reload)
                }
            }else{
                dictionary.appendChild(reload)
            }
            break

        case 1:
        //ここ、つかわないはずなのでエラーアラートとか出したいけどめんどくさい
            break
        case 2:
            var reload_target=getElementById("word"+arg.target_number)
            console.log("delete:"+arg.target_number)
            reload_target.parentNode.removeChild(reload_target);

            break
    }
})


function dic_search(){
    search_target= getElementById("search").value;
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
    var word_cap = createElement('div')
    word_cap.setAttribute("style", "height:0px;border-top:solid 2px gray;");
    dictionary.appendChild(word_cap);

    //forをぶん回して単語欄を生成する
    var word_queue = resultJSON.words.length;
    for (let i=0;i<word_queue;i++) {
        addElement(resultJSON,i);
    }
    //console.log(resultJSON);
}

ipcRenderer.on("creareDIC",function(event,arg){
    console.log(arg)
    fs.writeFileSync(arg, JSON.stringify(DefaultJSON), 'utf8');

    //Filepath=arg;
    ReadDictionaryJSON(arg);
    load_words();
})

ipcRenderer.on("DICsaveAS",function(event,arg){
    console.log(arg)
    if(json!==null){
        fs.writeFileSync(arg, JSON.stringify(json), 'utf8');

        Filepath=arg;
        ReadDictionaryJSON(arg);
        load_words();
    }
})

ipcRenderer.on("beacon",function(event,arg){
    if(Filepath){
        ipcRenderer.send("config",Filepath);
    }else{
        ipcRenderer.send("config",null);
    }
})

ipcRenderer.on("debug",function(event, arg) {
    console.log(arg)
})