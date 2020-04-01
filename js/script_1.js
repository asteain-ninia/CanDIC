const electron = require('electron');
const {ipcRenderer}=electron;
const fs=require('fs')

const editor = document.getElementById('editor');
const dictionary=document.getElementById('dictionary')

var json = null;

ipcRenderer.on('4',function(event,arg){
  console.log("filePath Reserved!")
  var result=arg[0];
  console.log(result)
  var data=fs.readFileSync(result,'utf8')
  json =JSON.parse(data);
  var word_count = json.words.length
  console.log("単語数"+word_count);

//参考：https://qiita.com/kouh/items/dfc14d25ccb4e50afe89
  while (dictionary.firstChild){
    dictionary.removeChild(dictionary.firstChild);
  }

  var word_queue=word_count;
  for(let i=0; i<word_queue; i++ ) {addElement(json,i);}
})

function addElement(json,i){
//参考:	https://www.sejuku.net/blog/49970
//		https://www.sejuku.net/blog/30970
//word_columnをdiv要素として作成・idを設定(TNNの単語IDに一致)
	var word_column = document.createElement('div');
  word_column.id=i;
  var forms=null;
  var No=null


//第一行：単語行の生成
	forms=document.createTextNode(json.words[i].entry.form);
	word_column.appendChild(forms);
	word_column.appendChild(document.createElement('hr'))

//第二行：訳・文字情報の生成
  chars=document.createTextNode(
    json.words[i].translaions+"対応文字:"+json.words[i].entry.char);
	word_column.appendChild(chars);

	word_column.appendChild(document.createElement('br'))
  
  var newStyle=document.createElement('style');
  newStyle.type='text.css'
  newStyle.innerText = 'p {background-color: red}';
  word_column.appendChild(newStyle);
    
	dictionary.appendChild(word_column);
}