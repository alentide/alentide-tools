const fs = require("fs");
const mkdirs = require("./mkdirs");
const fileChunks = require("./fileChunks");
const path = require("path");

//TODO: 目录发生改变，就需要在判断一次新目录下，文件是否生成过了
function tellNeedCopy (dir,goal){
    //判断是否已经生成了该文件
    const dirFile = fs.readdirSync(dir);
    const hasThisFile = dirFile.includes(path.basename(goal))
    if(hasThisFile) {
        console.log('已经存在'+goal)
        return false
    }else {
        return true
    }
}

function copyFile(src, goal,cb) {
    fs.readFile(src, (err, data) => {
        err && console.log("copy fail: read fail");
        // const dir = goal
        //     .split("/")
        //     .slice(0, -1)
        //     .join("/");
        const dir = path.dirname(goal);
        // console.log(dir,path.dirname(goal))
        // return
        mkdirs(dir, () => {
            

            // 判断该文件夹是否文件过多，如果过多，在上一级创建新的目录
            const newDir = fileChunks(dir);
            let finalGoal;
            if (dir !== newDir) {
                // console.log(newDir)
                finalGoal = newDir + "/" + path.basename(goal);
                cb(finalGoal)
                if(!tellNeedCopy(newDir,finalGoal)){
                    return
                }
                
                mkdirs(newDir, () => {
                    //粘贴文件
                    fs.writeFile(finalGoal, data, err => {
                        err && console.log("copy fail: write fail");
                    });
                });
            } else {
                
                finalGoal = goal;
                cb(finalGoal)
                if(!tellNeedCopy(dir,goal)){
                    return
                }
                
                fs.writeFile(finalGoal, data, err => {
                    err && console.log("copy fail: write fail");
                });
            }
            //粘贴文件
        });
    });
}

copyFile("./a.txt", "./chunk01/d.txt",(goal)=>{
    console.log(goal)
});
