/**
 * 一个问题可能包含多个步骤，
 * 而一个步骤也可能包含很多步骤，这个问题没有考虑到
 * 现在mdToAnki2将解决这个问题
 *
 *
 * 1.首先：mdToAnki2简称mta ,不在设置问题和答案，而是设置做法的概括和详情
 * 比如：
 * 问题： 如何做到a？
 * 答：1.先做到a-1
 *      先做b-1
 *      再做b-2
 *
 * step:
 *
 */

const fs = require("fs");
const path = require("path");
const shortid = require("shortid");

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

const { mkdirsSync } = require("../mdToAnki/mkdirs");

function MdToAnki() {
    const path = arguments.path;
    this.path = path || process.cwd(); //文件的绝对路径
    this.fileList = []; //当前文件夹内的文件列表
    this.fileContentList = [];

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
        this.fileContentList.push(
            fs
                .readFileSync(this.path + "/" + file)
                .toString()
                .split("\r\n\r\n")
        );
    });

    this.fileContentList.forEach(file => {
        const fileLineSplitByTab = file.map(line => line.split("\t"));

        const fileCard = [];
        this.fileCards.push(fileCard);

        let inputLocation;

        fileLineSplitByTab.forEach(line => {
            const currentLine = line.slice(-1)[0];

            if (currentLine.startsWith("s;")) {
                fileCard.push({
                    step: [getNewLine(currentLine.split("s;")[1])],
                    id: shortid.generate()
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
            } else if (currentLine.startsWith("d;")) {
                fileCard.slice(-1)[0].detail = [
                    getNewLine(currentLine.split("d;")[1])
                ];
                inputLocation = fileCard.slice(-1)[0].detail;
            } else if (currentLine.startsWith("n;")) {
                inputLocation = null;
            } else if (currentLine.startsWith("u;")) {
                user = currentLine.split("u;")[1];
            } else if (currentLine.startsWith("t;")) {
                tag = currentLine.split("t;")[1];
                fileCard.slice(-1)[0].tag = tag;
            } else if (currentLine.startsWith("TI:")) {
                //TODO: 视频处理
                
                //还没有写

                if (!inputLocation) return;
                chunkId++;
                let thisCardVideoPath;
                if (item.split("TI:")[1].split("-")[2]) {
                    thisCardVideoPath = item
                        .split("TI:")[1]
                        .split("-")
                        .slice(2)
                        .join("-")
                        .trim();
                } else {
                    thisCardVideoPath = videoPath;
                }
                currentPath.getNew();
                let { html, mdVideoPath, splitVideo } = videoHandle(
                    item,
                    thisCardVideoPath,
                    chunkId,
                    prefix,
                    user,
                    bitrate,
                    className
                );
                asyncQueue.push(splitVideo);
                let content = getNewLine(html);
                ankiArrayData[ankiArrayData.length - 1][contentLocation].push(
                    `<img style="display: none" src="${mdVideoPath}" />`
                );
                ankiArrayData[ankiArrayData.length - 1][contentLocation].push(
                    content
                );
            } else if (isImage(currentLine)) {
                content = getAnkiImageSrc(currentLine);
                const imagName = getImageName(currentLine);
                //获得图片路径
                const imageDir = cwd + `/md/${currentLine.split("/")[1]}/`;
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
        fileCard.forEach(item => {
            const card = {};

            // card.front = item.step.join("\r\n");

            card.fronts = [item.step.join("\r\n")];
            function getParentStep(item) {
                if (item.parent) {
                    const parent = fileCard.find(
                        item2 => item2.id === item.parent
                    );
                    card.fronts.push(parent.step.join("\r\n"));
                    if (parent.parent) {
                        getParentStep(parent);
                    }
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
                    return (oneFileCard.id = item.parent);
                }).tag;
            } else {
                card.tag = item.tag;
            }
            // card.tag = item.tag
            this.cards.slice(-1)[0].push(card);
        });
    });

    this.cards.forEach((file, fileIndex) => {
        mkdirsSync("./txtforanki/");
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
}

// const mdToAnki = new MdToAnki({ path: "./test" });

module.exports = MdToAnki;
// console.log(mdToAnki.cards);
