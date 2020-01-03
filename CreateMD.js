const fs = require("fs");

class CreateMD {
    constructor(fileName) {
        this.fileName = fileName;
    }

    createMDFile(fileName,type='.md') {
        fs.writeFile("./" + fileName+type, "", "utf8", err => {
            err && console.log("在目录下创建md文件时发生错误");
        });
    }
    createDayNote(){
        const date = new Date()
        const y = date.getFullYear()
        const m = date.getMonth() +1
        const d = date.getDate()
        const fileName = `${y}年${m}月${d}日-每日笔记`
        this.createMDFile(fileName)
    }
    autoCreateMDFile() {
        this.fileName = [
            "01-css",
            "02-html",
            "03-js",
            "04-vue",
            "05-node",
            "06-react",
            '07-express',
            '08-koa',
        ];
        this.fileName.forEach(item=>{
            this.createMDFile(item)
        })
    }
}

module.exports = CreateMD