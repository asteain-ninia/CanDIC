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

    var entry=json.words[target_number].entry

    wordID.innerHTML="ID:"+target_number;

    var forms_queue=entry.form.length;
    for(let i=0; i<forms_queue; i++){
        load_spelling(entry,i);
    }

    var chars_queue=entry.char.length;
    for(let i=0; i<chars_queue;i++){
        //load_chars(entry,i);
    }



    var tags_queue=entry.tags.length
}

function load_spelling(entry,i){
    var custom=1　//1=spelling

    var spelling=document.createElement('form')
    spelling.name="spelling-"+i;
    spelling.className="input-1";
    spelling.id="spelling-"+i;

    var spell=document.createElement('input');
    spell.type="text";
    spell.name="spell";
    spell.value=entry.form[i]

    var remove=document.createElement('input');
    remove.type="button";
    remove.name="remove";
    remove.value="-"

    remove.setAttribute("onclick","remove("+custom+","+i+")")

    spelling.appendChild(spell);
    spelling.appendChild(remove);

    spellingBox.appendChild(spelling)
}

let order=0
function entry_add(custom){//空っぽの窓を末尾に追加する関数

    var element=document.createElement('form')
    element.name=custom+order;
    element.className="input-1";
    element.id=custom+order;

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

    spellingBox.appendChild(element)

    order++;
}

function remove(custom,order){
    //どの窓がremoveを行ったかを受け取って、それをですとろーい
    var remove_target=document.getElementById(custom+"-"+order)
    remove_target.parentNode.removeChild(remove_target);
}

function add_spelling(){
    custom=1
    entry_add(custom)
}