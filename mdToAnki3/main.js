
const fs = require("fs");
const path = require("path");
const shortid = require("shortid");
const videoHandle = require('../videoHandle/main.js')

//获得div标签包裹的行
const getNewLine = require("../mdToAnki/getNewLine");

//获得处理图片所需要的函数
const cwd = process.cwd();
const {
    isImage,
    getAnkiImageSrc,
    getImageName,
    copyImage
} = require("../mdToAnki/handleImg/main");
const currentPath = {};
const user = "fractium";
currentPath.getNew = function() {
    return "C:/Users/30716/AppData/Roaming/Anki2/" + user + "/collection.media";
};


let tag = ""; //卡片的标签
let prefix = ''; //卡片前缀
let bitrate = 10
let className = ''
let asyncQueue = []

const { mkdirsSync } = require("../mdToAnki/mkdirs");

function MdToAnki() {
    const localPath = arguments.path;
    this.path = localPath || process.cwd(); //文件的绝对路径
    this.fileList = []; //当前文件夹内的文件列表
    this.fileContentList = [];
    this.videoPaths=[]

    //初始化，拿到md文件列表
    this.init = function() {
        const allFilesList = fs.readdirSync(this.path);
        const mdFileList = allFilesList.filter(file => {
            return file.endsWith(".md");
        });
        this.fileList = mdFileList;
    };
    this.init();

    this.fileCards = [];

    this.parentList = {};

    //读文件
    this.fileList.forEach(file => {
        const fileStr = fs.readFileSync(this.path + "/" + file).toString();
        let line
        if(fileStr.startsWith('\\r\\n')){
            line = '\r\n'
        }else if(fileStr.startsWith('\\n')){
            line = '\n'
        }else {
            line = '\r\n\r\n'
        }
        this.fileContentList.push(fileStr.split(line));
    });

    this.fileContentList.forEach(file => {
        const fileLineSplitByTab = file.map(line => line.split("\t"));

        const fileCard = [];
        this.fileCards.push(fileCard);

        let inputLocation;

        fileLineSplitByTab.forEach(line => {
            const currentLine = line.slice(-1)[0];

            if (currentLine.startsWith("问：")) {
                fileCard.push({
                    step: [getNewLine((tag?tag+'：':'默认：')+(prefix?prefix:'')+ currentLine.split("问：")[1])],
                    // step: [getNewLine((tag?tag+'：':'默认：')),getNewLine(prefix?prefix:''), getNewLine(currentLine.split("问：")[1])],
                    id: shortid.generate(),
                    // id:currentLine.split("问：")[1],
                    tag,
                    prefix,
                });
                
                if (!this.parentList["parent" + line.length]) {
                    this.parentList["parent" + line.length] = [];
                }
                this.parentList["parent" + line.length].push(
                    fileCard.slice(-1)[0]
                );

                if (line.length > 1) {
                    fileCard.slice(-1)[0].parent = this.parentList[
                        "parent" + (line.length - 1)
                    ].slice(-1)[0].id;
                }
                inputLocation = fileCard.slice(-1)[0].step;
            } else if (currentLine.startsWith("答：")) {
                fileCard.slice(-1)[0].detail = [
                    getNewLine(currentLine.split("答：")[1])
                ];
                inputLocation = fileCard.slice(-1)[0].detail;
            } else if (currentLine.startsWith("注释：")) {
                inputLocation = null;
            } else if (currentLine.startsWith("用户名：")) {
                user = currentLine.split("用户名：")[1];
            } else if (currentLine.startsWith("标签：")) {
                tag = currentLine.split("标签：")[1];
                fileCard.slice(-1)[0] && (fileCard.slice(-1)[0].tag = tag);
            } else if(currentLine.startsWith('前缀：')) {
                prefix = currentLine.split("前缀：")[1];
                fileCard.slice(-1)[0] && (fileCard.slice(-1)[0].prefix = prefix);
            }else if(currentLine.startsWith('比特率：')){
                bitrate = currentLine.split("比特率：")[1];
            }else if(currentLine.startsWith('样式类：')){
                className = currentLine.split("样式类：")[1];
            }else if (currentLine.startsWith("视频地址：")) {
                //TODO: 视频处理
                videoPath = currentLine.split("视频地址：")[1];
                //set video path
                this.videoPaths.push(videoPath)
            }else if(currentLine.startsWith("视频参数：")){
                let { html, mdVideoPath, splitVideo } = videoHandle(
                    currentLine.split("视频参数：")[1],
                    this.videoPaths.slice(-1)[0],
                    1,//chunkId 暂时不使用
                    prefix,
                    user,
                    bitrate,
                    className,
                    true,//mk2 mode
                );
                asyncQueue.push(splitVideo);
                let content = getNewLine(html);
                inputLocation.push(
                    `<img style="display: none" src="${mdVideoPath}" />`
                );
                inputLocation.push(getNewLine(content));

            } else if (isImage(currentLine)) {
                let content = getAnkiImageSrc(currentLine);
                const imagName = getImageName(currentLine);
                //获得图片路径
                // const imageDir = cwd + `/md/${currentLine.split("/")[1]}/`;

                // const imageDir = path.dirname(currentLine.split('(')[1].substring(0,currentLine.split('(')[1].length-1))
                

                const imageDir = path.dirname(currentLine.match(/\](.+)/)[0].slice(2,-1))
                // console.log(imagName)
                // console.log(imageDir)
                // console.log(currentPath)
                // console.log('===================')
                copyImage(imagName, imageDir, user, currentPath);
                inputLocation && inputLocation.push(getNewLine(content));
            } else {
                inputLocation && inputLocation.push(getNewLine(currentLine));
            }
        });
    });

    this.cards = [];
    this.fileCards.forEach(fileCard => {
        this.cards.push([]);
        // console.log('============')
        // console.log(fileCard)
        fileCard.forEach(item => {
            const card = {};
            // card.front = item.step.join("\r\n");
            // if(item.parent){
            //     card.fronts = [item.step.slice(2).join('')];
            // }else {
            //     card.fronts = [item.step.join("")];
            // }

            card.fronts = [item.step.join("")];
            
            // console.log(item)
            function getParentStep(item) {
                if (item.parent) {
                    // console.log('==========')
                    // console.log(fileCard)
                    const parent = fileCard.find(
                        item2 => {
                            // console.log(item2)
                            return item2.id === item.parent
                        }
                    );
                    // console.log('=======')
                    // console.log(item)
                    // console.log(parent)
                    card.fronts.push(parent.step.join(""));
                    return 
                    // if (parent.parent) {
                    //     getParentStep(parent);
                    // }
                }
            }

            getParentStep(item);

            card.front = card.fronts.reverse().join("");
            
            card.back =
                item.detail.join("") +
                fileCard
                    .filter(item2 => item2.parent === item.id)
                    .map(item3 => {
                        return item3.step.join("");
                    })
                    .join("");
            
            if (item.parent) {
                card.tag = fileCard.find(oneFileCard => {
                    return (oneFileCard.id === item.parent);
                }).tag;
            } else {
                card.tag = item.tag;
            }
            // card.tag = item.tag
            this.cards.slice(-1)[0].push(card);
        });
    });


    //如果已经有alltxtforanki，那就先删除
    mkdirsSync("./txtforanki/");
    const alltxtforankiPath = './txtforanki/alltxtforanki.txt'
    if(fs.existsSync(alltxtforankiPath)){
        fs.unlinkSync(alltxtforankiPath)
    }

    this.cards.forEach((file, fileIndex) => {
        
        const content = file.map(card => {
            if (!card.front && !card.back) return "";
            return (
                card.front +
                "\t" +
                card.back +
                "\t" +
                (card.tag ? card.tag : "默认") +
                "\r\n"
            );
        });
        const result = content.join("");

        if (result) {
            fs.writeFileSync(
                `./txtforanki/${this.fileList[fileIndex].split(".md")[0]}.txt`,
                result
            );
            fs.appendFileSync(`./txtforanki/alltxtforanki.txt`, result);
        }
    });

    //处理视频分割
    async function chunkAsyncFunc(arr) {
        // arr.forEach(async (item,i)=>{
        // 	await item(i)
        // })

        for (var i = 0; i < arr.length; i++) {
            await arr[i]();
        }
    }
    chunkAsyncFunc(asyncQueue)
}

// const mdToAnki = new MdToAnki({ path: "./test" });

module.exports = MdToAnki;
// console.log(mdToAnki.cards);
