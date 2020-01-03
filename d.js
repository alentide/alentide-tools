#!/usr/bin/env node
const fs = require("fs");
const cwd = process.cwd()
const backslashIndex = cwd.lastIndexOf('\\')
const dirname = cwd.slice(backslashIndex+1)
fs.readdir("./", (err, data) => {
    const arr = data
        .map(item => {
            const index = getVideoTypeIndexInName(item)
            return item.substring(0, index);
        })
        .filter(item => {
            return item;
        });
    const index = dirname.lastIndexOf("\\");
    //排序，数字从小到大
    arr.sort((a,b)=>parseInt(a)-parseInt(b))

    let str = "## " + dirname.substring(index + 1) + "\r\n";
    arr.forEach(item => {
        str += "### " + item + "\r\n\r\n\r\n\r\n";
    });
    fs.writeFile("./d.txt", str, err => {
        err && console.log("写入错误");
    });
});

function getVideoTypeIndexInName(name){
    let index;
    const videoType=['mp4','flv']
    for(var i=0;i<videoType.length;i++){
        index = name.indexOf('.'+videoType[i])
        if(index>-1) break
    }
    return index    
}