const electron = require('electron');
const {ipcRenderer}=electron;
const fs=require('fs')

const editor = document.getElementById('editor');
const dictionary=document.getElementById('dictionary')

var json = null;

ipcRenderer.on('4',function(event,arg){
  console.log("filePath Reserved!")
  var path=arg[0];//argを受け取ってpathに入れ込む
  console.log(path)
  var data=fs.readFileSync(path,'utf8')//pathの向こうにあるファイルをテキストで読む
  json =JSON.parse(data);//jsonでパース
  var word_count = json.words.length//単語数をカウント
  console.log("単語数"+word_count);

  //参考：https://qiita.com/kouh/items/dfc14d25ccb4e50afe89
  //dictionary欄内の掃除
  while (dictionary.firstChild){
    dictionary.removeChild(dictionary.firstChild);
  }

  //forをぶん回して単語欄を生成する
  var word_queue=word_count;
  for(let i=0; i<word_queue; i++ ) {addElement(json,i);}

})

function addElement(json,i){
  //参考:	https://www.sejuku.net/blog/49970
  //		https://www.sejuku.net/blog/30970
  //word_columnをdiv要素として作成・idを設定(TNNの単語IDに一致)
	var word_column = document.createElement('div');
  word_column.id=i;
  word_column.size=+1;

  var pronun_column=document.createElement('font')
  pronun_column.size=-1;

  //第一行：単語行の生成
	var forms=document.createTextNode(json.words[i].entry.form);
  word_column.appendChild(forms);
  
  //発音の列挙
  var pronun_queue=json.words[i].pronunciation.length;
console.log(pronun_queue);
  for(let j=0; j<pronun_queue; j++){
    var pronuns=document.createTextNode(" /"+json.words[i].pronunciation[j]+"/");
    pronun_column.appendChild(pronuns);
  };
  word_column.appendChild(pronun_column);





	word_column.appendChild(document.createElement('hr'))

  //第二行：訳・文字情報の生成
  chars=document.createTextNode(
    json.words[i].translaions+"対応文字:"+json.words[i].entry.char);
	word_column.appendChild(chars);

	word_column.appendChild(document.createElement('br'))
    
	dictionary.appendChild(word_column);
}