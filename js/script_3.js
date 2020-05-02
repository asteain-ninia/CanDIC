const electron = require('electron');
const {
    ipcRenderer
} = electron;
const fs = require('fs')


ipcRenderer.on('about_load',(event,arg)=>{//単語編集時の処理
    
    var data = fs.readFileSync("package.json", 'utf8') //pathの向こうにあるファイルをテキストで読む
    json = JSON.parse(data); //jsonでパース

    console.log(json)

    var container=document.getElementById("container")
    
    var name=document.createTextNode("CanDIC(仮) 人工言語総合辞書");
    var author=document.createTextNode("制作:asteain-ninia");

    var electron=document.createTextNode("electron:"+json.dependencies.electron);
    var version=document.createTextNode("版："+json.version);
    var date=document.createTextNode("完成：R0205XX")
    var git=document.createTextNode("GitHub:"+json.repository.url)

    container.appendChild(name);
    container.appendChild(document.createElement('br'));
    container.appendChild(author);
    container.appendChild(document.createElement('br'));
    container.appendChild(electron);
    container.appendChild(document.createElement('br'));
    container.appendChild(version);
    container.appendChild(document.createElement('br'));
    container.appendChild(date);
    container.appendChild(document.createElement('br'));
    container.appendChild(git);
    container.appendChild(document.createElement('br'));
})