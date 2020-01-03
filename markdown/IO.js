const fs = require("fs");

const Win10 = require('../Win10')
const win10 = new Win10()

function IO(type) {
    this.type = type
    this.start = start
}

IO.prototype.writeFile = function(fileName, type, data = "") {
    fs.writeFile(`./${fileName}.md`, data, "utf8", err => {
        err && console.log("在目录下创建md文件时发生错误");
    });
};
IO.prototype.readdir = function(type,callback) {
    fs.readdir("./", (err, data) => {
        let mdset = data.filter(item => {
            return item.indexOf("."+type) > -1;
        });
        callback(mdset)//数组：返回读取到的文件
    });
};
IO.prototype.createMarkdownByCurrentDirectoryFileName = function(type){
    this.readdir(type,(fielNameList)=>{
        fielNameList.forEach(item=>{
            this.writeFile(item.split(`.${type}`)[0],type)
        })
        
    })
}

const cwd = process.cwd()
const backslashIndex = cwd.lastIndexOf('\\')
const dirname = cwd.slice(backslashIndex+1)

function start(){
    const params = process.argv.slice(2);

    const io = new IO()
    let paramsObj = {}
    params.forEach((item,i)=>{
        if(item.includes('=')){
            item= item.split('--')[1].split('=')
            item[1]=='true' && (item[1]=true)
            item[1]=='false' && (item[1]=false)
            paramsObj[item[0]]=item[1]     
        }else {
            item= item.split('--')[1]
            paramsObj[item[0]]=true
        }
    })

    if(paramsObj.md){
        io.createMarkdownByCurrentDirectoryFileName(paramsObj.md)
    }
    // paramsObj.open && win10.useDos("start C:/alxsd/utils")
}


start()