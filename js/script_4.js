const electron = require('electron');
const {ipcRenderer} = electron;
const fs = require('fs')

function createElement(type){return document.createElement(type);}
function createTextNode(value){return document.createTextNode(value);}

let tagsID=0;
let classesID=0;
let titleID=0;

let dictionary
let language=document.getElementById("language")
let tags=document.getElementById("tags")
let classes=document.getElementById("classes")
let titles=document.getElementById("titles")
let meta=document.getElementById("meta")

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
	while (meta.firstChild) {//meta欄内の掃除
    	meta.removeChild(meta.firstChild);
	}

	if(dictionary.type=="TNN"){
		console.log("filepath TNN reserved")
		createform(1);//language欄
		for(let i=0;i<dictionary.tags.length;i++){
			createform(2,i);//tags欄
		}
		for(let i=0;i<dictionary.classes.length;i++){
			createform(3,i);//classes欄
		}
		for(let i=0;i<dictionary.titles.length;i++){
			createform(4,i);//titles欄
		}
		show_meta_info();
	}else{
		var Err_message=document.createTextNode("対応していない辞書形式のようです")
		var Err_element=document.createElement("div")
		Err_element.appendChild(Err_message)
		language.appendChild(Err_element)
	}
}

function createform(customID,i){
	var element=createElement('div');//form要素
	element.className="input-1";

	var column_value=createElement('input');//窓
	column_value.type="text";
	column_value.className="large";

	element.appendChild(column_value);

	var remove=createElement('input');//-ボタン
	remove.type="button";
	remove.className="large";
	remove.value="-"

	switch(customID){
		case 1://language欄
			var label=createElement('span')
			label.appendChild(createTextNode("言語名"))
			language.appendChild(label);

			column_value.id="language"
			column_value.value=dictionary.language

			language.appendChild(createElement('br'));
			language.appendChild(element);
			break;
		case 2://tags欄
			element.id="tag"+tagsID+"Box"
			column_value.id="tag"+tagsID
			column_value.value=dictionary.tags[i].name

			remove.setAttribute("onclick","remove('tag"+tagsID+"Box')")
			element.appendChild(remove);

			tags.appendChild(element);
			tagsID++
			break;
		case 3://classes欄
			element.id="class"+classesID+"Box"
			column_value.id="class"+classesID
			column_value.value=dictionary.classes[i].name

			remove.setAttribute("onclick","remove('class"+classesID+"Box')")
			element.appendChild(remove);

			classes.appendChild(element);
			classesID++
			break;
		case 4://titles欄
			element.id="title"+titleID+"Box"
			column_value.id="title"+titleID
			column_value.value=dictionary.titles[i].name

			remove.setAttribute("onclick","remove('title"+titleID+"Box')")
			element.appendChild(remove);

			titles.appendChild(element);
			titleID++
			break;
	}
}
function show_meta_info(){
	var meta_label=createTextNode("辞書情報");
	var type_info=createTextNode(dictionary.type+"："+dictionary.version);
	
	meta.appendChild(meta_label)
	meta.appendChild(createElement("br"))
	meta.appendChild(type_info);
}


function remove(target){
    console.log("removed:"+target)
    var remove_target=document.getElementById(target)
    remove_target.parentNode.removeChild(remove_target);
}