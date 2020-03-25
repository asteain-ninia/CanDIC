const {ipcRenderer}=require('electron')

//form要素の取得
//var form=		document.getElementById("form_1");
//dictionary要素の取得
//var dictionary=	document.getElementById("dictionary");

form.myfile.addEventListener( 'change', function test(e) {
//参考：https://www.sejuku.net/blog/32532
	var result = e.target.files[0];	
	console.log(result)

//FileReaderのインスタンスを作成する
	var reader = new FileReader();
//読み込んだファイルの中身を取得する
	reader.readAsText( result );
//ファイルの中身を取得後に処理を行う
	reader.addEventListener( 'load', function(){

		var json=JSON.parse(reader.result)

		var word_count = (Object.keys(json['words']).length)
		console.log("単語数"+word_count);

//参考：https://qiita.com/kouh/items/dfc14d25ccb4e50afe89
		while (dictionary.firstChild){
			dictionary.removeChild(dictionary.firstChild);
		}
		
		var word_queue=word_count;
		for(let i=0; i<word_queue; i++ ) {addElement(json,i);}
	})
})

function Reset(){
	dictionary.textContent=null;
	dictionary.insertAdjacentHTML('beforeEnd',"la 白紙化 成功iq。<br>");
	console.log("Reseted!");
}

function dblclick1(){
	console.log("ダブルクリック認識。");
}

function addElement(json,i){
//参考:	https://www.sejuku.net/blog/49970
//		https://www.sejuku.net/blog/30970
	var word_column = document.createElement('div');
	word_column.id=i;
	// word_column.onclick=Select();

	var content=document.createTextNode(
		"No."+json.words[i].id+",|"+json.words[i].string);
	word_column.appendChild(content);

	word_column.appendChild(document.createElement('br'))

	content=document.createTextNode(json.words[i].char);
	word_column.appendChild(content);

	word_column.appendChild(document.createElement('br'))
	word_column.appendChild(document.createElement('br'))
	
	dictionary.appendChild(word_column);
}

function Search(){
//	参考:https://qiita.com/1mada/items/9a48f7053a6016b5fd5a
	var match = data.filter(
		function(json,index,require){
			if(json.string=require)return true;
		}
	);
}

ipcRenderer.on('ping', (event, arg) => {
  console.log(arg) // pong
})