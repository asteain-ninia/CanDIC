const electron = require('electron');
const {ipcRenderer} = electron;
const fs = require('fs')

function createElement(type){return document.createElement(type);}
function createTextNode(value){return document.createTextNode(value);}

let dictionary
let language=document.getElementById("language")

ipcRenderer.on('target',function(event,arg){
	if(arg){
		console.log(arg)
		show_edit_forms(arg);
	}else{
		console.log("ファイルパスにnullを受け取りました")
	}
});

function show_edit_forms(path){
    var data = fs.readFileSync(path, 'utf8') //pathの向こうにあるファイルをテキストで読む
	json = JSON.parse(data); //jsonでパース
	
	dictionary=json.dictionary;

	while (language.firstChild) {//language欄内の掃除
    	language.removeChild(language.firstChild);
    }

	if(dictionary.type=="TNN"){
		console.log("filepath TNN reserved")
		createform(1);//language欄
		createform(2);//tags欄
	}else{
		var Err_message=document.createTextNode("対応していない辞書形式のようです")
		var Err_element=document.createElement("div")
		Err_element.appendChild(Err_message)
		language.appendChild(Err_element)
	}
}

function createform(customID){
	var element=createElement('div');//form要素
	element.className="input-1";

	var label=createElement('span')


	var column_value=createElement('input');//窓
	column_value.type="text";
	column_value.className="large";

	element.appendChild(column_value);

	var remove=createElement('input');//-ボタン
	remove.type="button";
	remove.name="remove";
	remove.value="-"

	switch(customID){
		case 1://language欄
			label.appendChild(createTextNode("言語名"))
			language.appendChild(label);

			column_value.value=dictionary.language

			language.appendChild(createElement('br'));
			language.appendChild(element);
			break;
		case 2://タグ欄
			break;
	}
}