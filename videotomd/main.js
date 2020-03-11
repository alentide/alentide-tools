const fs = require("fs");
function videotomd() {
    //获得执行命令的文件夹下的文件列表
    const files = fs.readdirSync(process.cwd());
    // if(!files.includes('md')){
    //     fs.mkdirSync('./md')
    // }
    // files.forEach(file=>{
    //     fs.writeFileSync(`./md/${file}.md`,'')
    // })

    files.forEach(file => {
        if (!["mp4", "avi", "rmvb", "mkv"].includes(file.split(".").slice(-1)[0]))
            return;
        const newFileName = `./v-${file}.md`
        try {
            fs.accessSync(
                newFileName,
                fs.constants.R_OK | fs.constants.W_OK
            );
            console.error(newFileName+` 该文件已存在，为防止发生覆盖不再创建`);
        } catch (err) {
            console.log(`创建了`+newFileName)
            fs.writeFileSync(newFileName, "");
        }
        // fs.access(`./${file}.md`, fs.R_OK | fs.W_OK, function(err) {
        //     if(err){
        //         console.error(`./${file}.md  该文件已存在，为防止发生覆盖不再创建`);
        //         return
        //     }
        //     fs.writeFileSync(`./${file}.md`, "");
        // });
    });
}

module.exports = videotomd;
