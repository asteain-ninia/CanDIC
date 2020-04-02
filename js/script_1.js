const electron = require('electron');
const {ipcRenderer}=electron;
const fs=require('fs')

const editor = document.getElementById('editor');
const dictionary=document.getElementById('dictionary')

var json = null;

ipcRenderer.on('4',function(event,arg){
  console.log("filePath TNN Reserved!")
  var path=arg[0];//argを受け取ってpathに入れ込む
  console.log(path)
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

  //forをぶん回して単語欄を生成する
  var word_queue=word_count;
  for(let i=0; i<word_queue; i++ ) {addElement(json,i);}

})

function addElement(json,i){
  //参考:	https://www.sejuku.net/blog/49970
  //		https://www.sejuku.net/blog/30970
  //word_shelfをdiv要素として作成・idを設定(TNNの単語IDに一致)
	var word_shelf = document.createElement('div');
  word_shelf.id=i;

  //entryiesをdiv要素として生成、この中にform要素とpronun要素・tag要素が入る
  var entryies=document.createElement('div');

  var entry

  //formをspan要素として生成。ここに語形が入る
  var form=document.createElement('span');
  //語形の列挙
	var forms=document.createTextNode(json.words[i].entry.form);
  form.appendChild(forms);//formの完成

  //pronunをspan要素として生成。すこし小さく表示する。
  var pronun=document.createElement('span')
  pronun.setAttribute("style","font-size:"+15+"px;")
  //発音の列挙
  var pronun_queue=json.words[i].pronunciation.length;
  for(let j=0; j<pronun_queue; j++){
    var pronuns=document.createTextNode(" /"+json.words[i].entry.pronunciation[j]+"/");
    pronun.appendChild(pronuns);//pronunの完成
  };
  var tag=document.createElement('span')
  pronun.setAttribute("style","font-size:"+15+"px;")
  var tasg=json.words[i].entry



  //classesをspan要素として生成。
  var classes=document.createElement('span')
  pronun.setAttribute("style","font-size:15px;")

  //見出し語の列挙
  var trans_queue=json.words[i].translations.length;
  for (let k=0; k<trans_queue; k++){
    var classID=json.words[i].translations[k].title;
    var classes_queue=json.dictionary.classes.length;
    //forを回してclasses.idが一致する物を探す
    for(let l=0; l<classes_queue; l++){
      if(json.dictionary.classes[l].id==classID)
      {var className=json.dictionary.classes[l].name;}
    };
    var classDisplay=document.createTextNode(className+"："+json.words[i].tarnslation.forms);
    classes.appendChild(classDisplay);//classesの完成

  }



  // var hr=document.createElement('hr')
	// entry.appendChild(hr)

  // //第二行：訳・文字情報の生成
  // chars=document.createTextNode(
  //   json.words[i].translations+"対応文字:"+json.words[i].entry.char);
	// word_shelf.appendChild(chars);

	word_shelf.appendChild(document.createElement('br'))
    
	dictionary.appendChild(word_shelf);
}