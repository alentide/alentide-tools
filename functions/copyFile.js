module.exports = function copyFile(src, goal,cover=false) {
    const fs = require('fs')
    fs.readFile(src, (err, data) => {
        err && console.log("copy fail: read fail",`goal: ${src}`);
        
        fs.access(goal, fs.R_OK,(err)=>{
            //没有错误就当作文件存在，不再往下执行
            if(!err)return

            //有错误就表示没有这个文件，开始写入文件
            fs.writeFile(goal, data, err => {
                err && console.log("copy fail: write fail",`goal: ${goal}`,);
            });
        })
        // fs.stat(goal,(err,stats)=>{
            
            
        //     if(!cover && stats.isFile())return
        //     console.log('start copy image',src)
            
        // })
        
    });
};
