const electron = require('electron');
const {ipcRenderer}=electron;
const fs=require('fs')

const editor = document.getElementById('editor');
const dictionary=document.getElementById('dictionary')

var json = null;

function debugButton(){
  path="datas/sample.json";
  ReadDictionary(path);
}



ipcRenderer.on('4',function(event,arg){
  console.log("filePath TNN Reserved!")
  var path=arg[0];//argを受け取ってpathに入れ込む
  console.log(path)
  ReadDictionary(path);
})

function ReadDictionary(path){
  var data=fs.readFileSync(path,'utf8')//pathの向こうにあるファイルをテキストで読む
  json =JSON.parse(data);//jsonでパース

  //参考：https://qiita.com/kouh/items/dfc14d25ccb4e50afe89
  //dictionary欄内の掃除
  while (dictionary.firstChild){
    dictionary.removeChild(dictionary.firstChild);
  }

  // if(json.dictionar.type=="TNN"){
  //   //つくりかけ、OTM対応の布石
  //   //まずJSONであることを判定しなければいけないのでは？
  // }
  
  var word_count = json.words.length//単語数をカウント
  console.log("単語数"+word_count);

  //単語欄の上下境
  var word_cap=document.createElement('div')
  word_cap.setAttribute("style","height:0px;border-top:solid 2px gray;");
  dictionary.appendChild(word_cap);

  //forをぶん回して単語欄を生成する
  var word_queue=word_count;
  for(let i=0; i<word_queue; i++ ) {addElement(json,i);}
}



function addElement(json,i){
  //参考:	https://www.sejuku.net/blog/49970
  //		https://www.sejuku.net/blog/30970
  //word_shelfをdiv要素として作成・idを設定(TNNの単語IDに一致)
	var word_shelf = document.createElement('div');
  word_shelf.id=i;
  word_shelf.setAttribute("style",
  "border-bottom:solid 2px gray;border-left:solid 2px gray;border-right:solid 2px gray;"
  )

  //entryiesをdiv要素として生成、この中にform要素とpronun要素・tag要素が入る
  var entries=document.createElement('div');
  entries.id="entries";

  //formをspan要素として生成。ここに語形が入る
  var form=document.createElement('span');
  form.setAttribute("style","font-size:18px;")
  //語形の列挙
	var forms=document.createTextNode(" "+json.words[i].entry.form+" ");
  form.appendChild(forms);//formの完成

  //pronunをspan要素として生成。すこし小さく表示する。
  var pronun=document.createElement('span')
  pronun.setAttribute("style","font-size:13px;")

  //発音の列挙
  //始端の空白
  var pronuns=document.createTextNode("　");
  pronun.appendChild(pronuns)
  //forを回して発音を//に挟んで列挙
  var pronun_queue=json.words[i].entry.pronunciation.length;
  for(let j=0; j<pronun_queue; j++){
    pronuns=document.createTextNode(" /"+json.words[i].entry.pronunciation[j]+"/");
    pronun.appendChild(pronuns);
  };
  //終端の空白
  pronuns=document.createTextNode("　");
  pronun.appendChild(pronuns)//pronunの完成

  //tagをspan要素としていっぱい生成。すこし小さく、かつ囲んで表示する。
  var tags=document.createElement('span')//tagの入るspan
  var tags_queue=json.words[i].entry.tags.length;//tag数の取得
  for (let m=0; m<tags_queue; m++){
    var tag=document.createElement('span')//tagのspan
    var tagID=json.words[i].entry.tags[m];
    var tag_queue=json.dictionary.tags.length;
    //forを回してtags.idが一致する物を探す
    for(let n=0; n<tag_queue; n++){
      if(json.dictionary.tags[n].id==tagID)
      {var tagName=json.dictionary.tags[n].name;}
    };
    var tagDisplay=document.createTextNode(tagName);
    tag.appendChild(tagDisplay);
    tag.setAttribute("style","font-size:13px;border:solid 1px black")
    tags.appendChild(tag);
  }
  //tagの完成

  var HR =document.createElement('hr');
  HR.setAttribute("style","margin:0px;")

  //entriesへの登録
  entries.appendChild(form)
  entries.appendChild(pronun)
  entries.appendChild(tags)
  entries.appendChild(HR)
  word_shelf.appendChild(entries)//entriesの完成

  //----------------------------------------------------------//
  //次から語義などの部分
  var contents=document.createElement('div');
  contents.id="contents";
 
  //contentsをspan要素として生成。
  var contents=document.createElement('div')

  var trans_queue=json.words[i].contents.length;//この値が持っている品詞の数

  for (let k=0; k<trans_queue; k++){
    var Kthcontent=document.createElement('div')//K番目のdiv要素
    var classID=json.words[i].contents[k].title;
    var classes_queue=json.dictionary.classes.length;
    //forを回してclasses.idが一致する物を探す
    for(let l=0; l<classes_queue; l++){
      if(json.dictionary.classes[l].id==classID)
      {var className=json.dictionary.classes[l].name;}
    };

    var classDisplay=document.createTextNode(className+"："+json.words[i].contents[k].forms);
    contents.appendChild(classDisplay);//classesの完成
    contents.appendChild(document.createElement('br'))
  }

  contents.appendChild(Kthcontent)

  word_shelf.appendChild(contents)


	dictionary.appendChild(word_shelf);//最終工程：word_shelfをdictionary窓にぶち込む
}