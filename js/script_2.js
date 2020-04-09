const electron = require('electron');
const {ipcRenderer}=electron;
const fs=require('fs')

let wordID=document.getElementById("wordID");
let spellingBox=document.getElementById("spellingBox")
let tagBox=document.getElementById("tagBox");
let charBox=document.getElementById("charBox")

ipcRenderer.on('target',(event,arg)=>{
    var target_number=arg.number;
    var target_path=arg.path;

    console.log(arg);
    load_word(target_path,target_number);
});

function load_word(target_path,target_number){
    var data = fs.readFileSync(target_path, 'utf8') //pathの向こうにあるファイルをテキストで読む
    json = JSON.parse(data); //jsonでパース(ここ二行scrpt_1と共通)

    var entry=json.words[target_number].entry//entry下のデータへの短縮

    wordID.innerHTML="ID:"+target_number;//IDの表示

    var forms_queue=entry.form.length;//第一：語形の読み込み
    var spell="spell"
    for(let i=0; i<forms_queue; i++){
        entry_load(entry,spell,i);
    }

    var chars_queue=entry.char.length;
    for(let i=0; i<chars_queue;i++){
        //entry_load(entry,char,i);
    }
    var tags_queue=entry.tags.length
}

function entry_load(entry,custom,order){

    var element=document.createElement('form')
    element.className="input-1";

    var column_value=document.createElement('input');//窓
    column_value.type="text";
    column_value.name="content";

    var remove=document.createElement('input');//-ボタン
    remove.type="button";
    remove.name="remove";
    remove.value="-"
    remove.setAttribute("onclick","remove("+custom+","+order+")")

    element.appendChild(column_value);
    element.appendChild(remove);

    //element.name=custom+"-"+order;
    //element.id=custom+"-"+order;


    spellingBox.appendChild(element)
    order++;
}

function remove(customID,order){
    //どの窓がremoveを行ったかを受け取って、それをですとろーい
    console.log("remove is TODO")
    //var remove_target=document.getElementById(custom+"-"+order)
    //remove_target.parentNode.removeChild(remove_target);
}

function add_button(customID){
    console.log("add is TODO")
}