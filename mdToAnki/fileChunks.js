
function fileChunks(dirPath) {
    const _ = require('lodash')
    var fs = require("fs");
    const path = require('path')
    const dirFile = fs.readdirSync(dirPath);
    const allFile = dirFile.map(item => {
        var stat = fs.lstatSync(dirPath+'/'+item);
        // var is_direc = stat.isDirectory(); // true || false 判断是不是文件夹
        if(stat.isFile()){
            return item
        }else {
            return false
        }
        
    });
    allTrueFile = _.compact(allFile)
    // console.log(allTrueFile);
    const len = allTrueFile.length

    if(len>=2){
        // console.log(path.dirname(dirPath))
        // console.log(path.basename(dirPath))
        let chunkNum = parseInt(path.basename(dirPath).slice(-2))+1
        if(chunkNum <10){
            chunkNum = '0'+chunkNum
        }
        // console.log(path.dirname(dirPath)+'/'+'chunk'+chunkNum)
        return path.dirname(dirPath)+'/'+'chunk'+chunkNum
    }else {
        return dirPath
    }
}
fileChunks('./chunk01');

module.exports = fileChunks