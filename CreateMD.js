const fs = require("fs");

const { mkdirsSync } = require("./mdToAnki/mkdirs");

class CreateMD {
    constructor(fileName) {
        this.fileName = fileName;
    }

    createMDFile(fileName, type = ".md", path = "./", content = "") {
        //如果有该文件，不应该再创建这个文件
        if(fs.existsSync(path + fileName + type)){
            return
        }

        fs.writeFile(path + fileName + type, content, "utf8", err => {
            err && console.log("在目录下创建md文件时发生错误");
        });
    }
    getDay() {
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        return { y, m, d, note: `${y}年${m}月${d}日-每日笔记` };
    }
    createDayNote() {
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const fileName = `${y}年${m}月${d}日-每日笔记`;
        this.createMDFile(fileName);
    }
    autoSetFileName() {
        // this.fileName = [
        //     "01-css",
        //     "02-html",
        //     "03-js",
        //     "04-vue",
        //     "05-node",
        //     "06-react",
        //     "07-express",
        //     "08-koa"
        // ];
        this.fileName = [
            "EnglishTVPlayListening",
            "EnglishTVPlaySpeaking",
            "EnglishPhrases",
            "Git"
        ];
        this.rule = {
            EnglishTVPlayListening: {
                qVideo: true,
                contentDescription: "听视频对话，确定每一个单词"
            },
            EnglishTVPlaySpeaking: {
                aVideo: true,
                contentDescription: "根据中文，说英语并与视频比对，且要模仿口音"
            },
            EnglishPhrases: {
                twoCard: true,
                contentDescription:
                    "第一张卡片：根据汉语说英语，第二张：根据英语说汉语"
            },
            Git:{
                contentDescription: '一般与git相关的知识'
            }
        };
    }
    autoCreateMDFile() {
        this.autoSetFileName();
        this.fileName.forEach(item => {
            this.createMDFile(item);
        });
    }
    makeMdDirAndFile(len = 50) {
        const { note } = this.getDay();
        mkdirsSync(note);
        this.autoSetFileName();
        this.fileName.forEach(item => {
            this.createMDFile(
                item,
                ".md",
                "./" + note + "/",
                this.getMDContent(item, len)
            );
        });
    }

    /**
     * 根据文件名，获得对应md文件的模板
     * aVideo指的是回答里有视频
     * qVideo指的是问题里有视频
     */
    getMDTemplate({
        category,
        len = 50,
        qVideo,
        aVideo,
        contentDescription,
        twoCard
    }) {
        const template = [];

        //一些video卡片，可能问题是空的，如果是空的可能被忽略掉，所以加点描述
        const description = (qVideo||aVideo) ? contentDescription:''

        for (var i = 0; i < len; i++) {
            template.push(
                `Q:${category}：${description}\r\n\r\n${
                    qVideo ? "TI:   -   \r\n\r\n" : ""
                }A:${twoCard ? category + "：" : ""}\r\n\r\n${
                    aVideo ? "TI:   -   \r\n\r\n" : ""
                }T:${category}\r\n\r\nN:${i + 1}\r\n\r\n\r\n\r\n`
            );
        }
        const BaseTemplate = `V:\r\n\r\nP:\r\n\r\nU:fractium\r\n\r\n`;

        return (
            BaseTemplate +
            ((contentDescription?contentDescription:'')  + "\r\n\r\n\r\n\r\n") +
            template.join("")
        );
    }

    /**
     * 根据文件名，获得对应md文件的内容
     */
    getMDContent(fileName, len) {
        // const category = fileName.split("-")[1].split(".")[0];
        const category = fileName;
        const rule = this.rule;
        // const qVideo = rule[category] && rule[category].qVideo;
        // const aVideo = rule[category] && rule[category].aVideo;
        // const contentDescription = rule[category] && rule[category].contentDescription;
        const {qVideo,aVideo,contentDescription,twoCard} = rule[category] && rule[category]
        return this.getMDTemplate({
            category,
            len,
            qVideo,
            aVideo,
            contentDescription,
            twoCard
        });
    }
}

// 测试
// const createMD = new CreateMD();
// console.log(
//     createMD.getMDTemplate({
//         category: "nihao",
//         len: 3,
//         qVideo: true,
//         aVideo: true
//     })
// );
module.exports = CreateMD;
