const electron = require('electron');
const {ipcRenderer} = electron;
const fs = require('fs')

function createElement(type){return document.createElement(type);}
function createTextNode(value){return document.createTextNode(value);}
function getElementById(target){return document.getElementById(target);}

let target_path=null;

let tagsID=0;
let classesID=0;
let titlesID=0;

let dictionary
let language=getElementById("language_column")
let tags=getElementById("tags")
let classes=getElementById("classes")
let titles=getElementById("titles")
let meta=getElementById("meta")

ipcRenderer.on('target',function(event,arg){
	if(arg){
		console.log(event)
		console.log(arg)
		target_path=arg;
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
		var Err_message=createTextNode("対応していない辞書形式のようです")
		var Err_element=createElement("div")
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
			if(i!=-1){
				column_value.value=dictionary.tags[i].name
				element.id="tag"+dictionary.tags[i].id+"Box"
				column_value.id="tag"+dictionary.tags[i].id
				remove.setAttribute("onclick","remove('tag"+dictionary.tags[i].id+"Box')")
				lasttagID=dictionary.tags[i].id
			}else{
				element.id="tag"+lasttagID+1+"Box"
				column_value.id="tag"+lasttagID+1
				remove.setAttribute("onclick","remove('tag"+lasttagID+1+"Box')")
				lasttagID++
			}
			element.appendChild(remove);

			tags.appendChild(element);

			tagsID++
			break;
		case 3://classes欄
			if(i!=-1){
				column_value.value=dictionary.classes[i].name
			}
				element.id="class"+classesID+"Box"
				column_value.id="class"+classesID
				remove.setAttribute("onclick","remove('class"+classesID+"Box')")
			
			element.appendChild(remove);

			classes.appendChild(element);
			classesID++
			break;
		case 4://titles欄
			element.id="title"+titlesID+"Box"
			column_value.id="title"+titlesID
			if(i!=-1){
				column_value.value=dictionary.titles[i].name
			}

			remove.setAttribute("onclick","remove('title"+titlesID+"Box')")
			element.appendChild(remove);

			titles.appendChild(element);
			titlesID++
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
	var remove_target=getElementById(target)
    remove_target.parentNode.removeChild(remove_target);
}
function form_add(target){
	var target_element=getElementById(target);
	switch(target){
		case "tags":
			createform(2,-1);
			break;
		case "classes":
			createform(3,-1);
		break;
		case "titles":
			createform(4,-1);
			break;
	}
}
function disagree(){
	if(target_path==null){
		var modify_pack={
			"save_flag":2,
		};
		ipcRenderer.send('close_signal_dic',modify_pack)
	}else{
		var modify_pack={
		"save_flag":1,
		"target_path":target_path,
    	};
    	ipcRenderer.send('close_signal_dic',modify_pack)
	}
}
function agree(){
	if(target_path==null){
		var modify_pack={
			"save_flag":1,
		};
		ipcRenderer.send('close_signal_dic',modify_pack)
	}else{
		var modify_pack={
			"save_flag":0,
		};
		ipcRenderer.send('close_signal_dic',modify_pack)
		save_dictionary_TNN();
	}
}

function save_dictionary_TNN(){
	var new_dictionary={
		"type":dictionary.type,
		"version":dictionary.version,
		"language":"",
		"tags": [
		],
		"classes": [
		],
		"titles": [
		]
	}
	var delete_queue={
		tags:[],
		classes:[],
		titles:[]
	}
	new_dictionary.language=getElementById("language").value;
	for(i=0;i<tagsID;i++){
		if(getElementById("tag"+i)){
			if(getElementById("tag"+i).value){
				var pack={
					"id":i,
					"name":getElementById("tag"+i).value
				}
				new_dictionary.tags.push(pack);
			}
		}else{delete_queue.tags.push(i)}
	}
	for(i=0;i<classesID;i++){
		if(getElementById("class"+i)){		
			if(getElementById("class"+i).value){
				var pack={
					"id":i,
					"name":getElementById("class"+i).value
				}
				new_dictionary.classes.push(pack);
			}
		}else{delete_queue.classes.push(i)}
	}
	for(i=0;i<titlesID;i++){
		if(getElementById("title"+i)){
			if(getElementById("title"+i).value){
				var pack={
					"id":i,
					"name":getElementById("title"+i).value
				}
				new_dictionary.titles.push(pack);
			}
		}else{delete_queue.titles.push(i)}
	}
	console.log(delete_queue)
	console.log(new_dictionary)
	console.log(dictionary)

	for(let i=0;i<json.words.length;i++){
		for(let j=0;j<json.words[i].entry.tags.length;j++){
			for(let l=0;l<delete_queue.tags.length;l++){
				if(json.words[i].entry.tags[j]==delete_queue.tags[l]){
					json.words[i].entry.tags.splice(j,1);
				}
			}
		}
	}
	console.log(json)
}