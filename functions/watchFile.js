const fs = require("fs"),
    md5 = require("md5");
const path = require("path");

const canNotOperate = []

const armDB = []

function watchFile(filePath, cb) {
    var watch = require("node-watch");

    watch(filePath, { recursive: true }, function(evt, name) {
        console.log("%s changed.", name);
        //如果已经记录该文件不可操作就直接返回
        if(canNotOperate.find(item=>item===name)) return
        fs.access(name, fs.R_OK | fs.W_OK, function(err) {
            console.log(name + (err ? "不可操作!" : "可以读/写"));
            if (err) {
                canNotOperate.push(name)
                return
            };
            cb && cb(name,armDB);
        });
        
    });
}

// function watchFile(filePath = "./", cb) {
//   console.log('==========开始监听路径'+filePath+'==========')
//     let preveMd5 = null,
//         fsWait = false;
//     if (!filePath.endsWith("/")) {
//         filePath += "/";
//     }
//     console.log(`正在监听 ${filePath}`);
//     fs.watch(filePath, (event, filename) => {
//         console.log(`文件：${filename}  发生了事件：${event}`);
//         // const updatedFile = path.resolve(filePath, filename);
//         const updatedFile = filePath + (filePath.endsWith("/")?"":"/") + filename;
//         if (filename) {
//             fs.access(updatedFile, fs.R_OK | fs.W_OK, function(err) {
//                 console.log(err ? updatedFile+"不可操作!" : "可以读/写");
//                 if (err) return;
//                 fs.stat(updatedFile, (err, stats) => {
//                     // console.log(
//                     //     `接下来判断该文件===${updatedFile}===是目录还是文件`
//                     // );
//                     if (stats.isDirectory()) {
//                         console.log(`${updatedFile}该文件是文件夹`);
//                         watchFile(updatedFile, cb);
//                         return;
//                     }
//                     if (fsWait) return;
//                     fsWait = setTimeout(() => {
//                         fsWait = false;
//                     }, 1000);
//                     var currentMd5 = md5(fs.readFileSync(filePath + filename));
//                     if (currentMd5 == preveMd5) {
//                         return;
//                     }
//                     preveMd5 = currentMd5;
//                     console.log(`${filePath + filename}文件发生更新`);

//                     cb && cb(updatedFile);
//                 });
//             });
//         }
//     });
// }
// watchFile("./", updatedFile => {
//     const fileContent = fs.readFileSync(updatedFile).toString();
//     console.log(fileContent);
// });
module.exports = watchFile;
