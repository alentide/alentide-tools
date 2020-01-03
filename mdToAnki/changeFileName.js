function changeFileName( exto, prefix,canRename=false,fill='0') {
    /**
     * ext 后缀名： 字符串 比如 .mp4
     * prefix 文件名前缀：字符串 比如 黑镜
     */
    //获得所有文件，根据后缀名filter

    const ext = '.'+exto
    const fs = require("fs");
    const AllFilesName = fs.readdirSync("./");
    const filesName = AllFilesName.filter(item => {
        return item.endsWith(ext)
    });
    
    //找出文件名不同的部分，往往是数字
    const filesNameFrom = [];
    const diffFilesName = [];
    filesName.forEach(item => {
        filesNameFrom.push(Array.from(item));
    });
    for (var i = 0; i < filesName[0].length; i++) {
        for (var j = 0; j < filesName.length; j++) {
            if (
                j !== filesName.length - 1 &&
                filesName[j][i] !== filesName[j + 1][i]
            ) {
                !diffFilesName[j] && (diffFilesName[j] = []);
                diffFilesName[j].push(filesName[j][i]);
            } else if (
                j === filesName.length - 1 &&
                filesName[j][i] !== filesName[j - 1][i]
            ) {
                !diffFilesName[j] && (diffFilesName[j] = []);
                diffFilesName[j].push(filesName[j][i]);
            } else if (
                (j === filesName.length - 1 &&
                    filesName[j][i] === filesName[j - 1][i]) ||
                (j !== filesName.length - 1 &&
                    filesName[j][i] === filesName[j + 1][i])
            ) {
                const tempArr = filesName.map(item => {
                    return filesName[j][i] === item[i];
                });
                const trueName = tempArr.filter(item => item === true);
                const falseName = tempArr.filter(item => item === false);
                if (trueName.length <= falseName.length) {
                    !diffFilesName[j] && (diffFilesName[j] = []);
                    diffFilesName[j].push(filesName[j][i]);
                }
            }
        }
    }
    // console.log(diffFilesName)
    // for(var i=0;i<filesName.length;i++){
    //     console.log(newName(diffFilesName,i,prefix,ext))
    // }
    // return
    // filesName.forEach((item,i)=>{
    //     if(canRename){
    //         fs.renameSync(item,newName(diffFilesName,i,prefix,ext))
    //     }else {
    //         fs.writeFileSync(newName(diffFilesName,i,prefix,ext))
    //     }
    // })

    let maxLen = 0
    diffFilesName.forEach(item=>{
        if(maxLen<item.length){
            maxLen = item.length
        }
    })


    for(var i=0;i<filesName.length;i++){
        let item = filesName[i]
        if(canRename==='true'){
            fs.renameSync(item,newName(diffFilesName,i,prefix,ext,maxLen,fill))
        }else if(canRename==='d'){
            console.log(diffFilesName)
            break
        }else if(canRename==='o'){
            console.log(filesName)
            break
        }else if(canRename==='n'){
            console.log(newName(diffFilesName,i,prefix,ext,maxLen,fill))
            
        }else {
            console.log(newName(diffFilesName,i,prefix,ext,maxLen,fill))
            // fs.writeFileSync(newName(diffFilesName,i,prefix,ext,maxLen))
        }
    }
    
}

function newName(diffFilesName,index,prefix,ext,maxLen,fill='0'){
    // let maxLen = 0
    // allNewNames.forEach(item=>{
    //     if(maxLen<item.length){
    //         maxLen = item.length
    //     }
    // })
    
    if( diffFilesName[index].length<maxLen){
        const times = maxLen-diffFilesName[index].length
        for(var i=0;i<times;i++){
            diffFilesName[index].unshift(fill)
        }
    }
    return prefix+diffFilesName[index].join('')+ext
    
}



module.exports = changeFileName;
