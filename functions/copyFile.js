module.exports = function copyFile(src, goal,cover=false) {
    const fs = require('fs')
    fs.readFile(src, (err, data) => {
        err && console.log("copy fail: read fail");
        fs.stat(goal,(err,stats)=>{
            if(!cover && stats.isFile())return
            console.log('start copy image',src)
            fs.writeFile(goal, data, err => {
                err && console.log("copy fail: write fail");
            });
        })
        
    });
};
