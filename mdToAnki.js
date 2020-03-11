#!/usr/bin/env node
function main() {
    const fs = require("fs");
    const path = require("path");
    // console.log(process.argv)
    const tag = getTag();
    const cwd = process.cwd();
    // const dirname = cwd.slice(backslashIndex+1)
    const mdfilename = getFileName();
    const _ = require("lodash");

    const stepToAnki = require('./mdToAnki/stepToAnki')

    async function chunkAsyncFunc(arr) {
        // arr.forEach(async (item,i)=>{
        // 	await item(i)
        // })

        for (var i = 0; i < arr.length; i++) {
            await arr[i]();
        }
    }
    const parallel = 1;

    const videoHandle = require("./videoHandle/main");

    const asyncQueue = [];

    // 用户名
    let user;

    //获得文件夹分支
    const fileNum = [];
    const utcDate = require("./date/utcDate");
    const { mkdirsSync } = require("./mdToAnki/mkdirs");
    const currentPath = {};
    
    function getChunk() {
        
        currentPath.getNew = function() {
            return (
                "C:/Users/30716/AppData/Roaming/Anki2/" +
                user +
                "/collection.media"
            );
        };
        return

        // 本函数以下作废，我就记得anki不支持多级目录，哈哈哈哈哈哈

        // 获取日期
        const dateChunk = utcDate().join("/");

        //路径前缀
        const pathPrefix =
            "C:/Users/30716/AppData/Roaming/Anki2/" +
            user +
            "/collection.media/" +
            dateChunk;

        //如果文件夹没有创建则创建
        mkdirsSync(pathPrefix);
        //判断日期文件夹内是否有chunk
        const filesNameArr = fs.readdirSync(pathPrefix);

        let maxNum = -1;
        filesNameArr.forEach((item, i) => {
            if (item.includes("chunk")) {
                let currentNum = parseInt(item.slice(-2));
                if (currentNum > maxNum) {
                    maxNum = currentNum;
                }
            }
        });
        //没有chunk文件夹，则创建chunk01
        let currentChunk;
        if (maxNum === -1) {
            currentChunk = pathPrefix + "/chunk01";
            fs.mkdirSync(currentChunk);
        } else {
            currentChunk =
                pathPrefix + "/chunk" + (maxNum < 10 ? "0" + maxNum : maxNum);
            //如果有chunk文件夹，判断该文件夹内文件数量
            const currentChunkFilesNameArr = fs.readdirSync(currentChunk);
            const currentChunkFilesNameArrLen = currentChunkFilesNameArr.length;
            if (currentChunkFilesNameArrLen > 49) {
                //如果该chunk文件夹内文件超过50，则创建新的文件夹
                currentChunk =
                    pathPrefix +
                    "/chunk" +
                    (maxNum + 1 < 10 ? "0" + maxNum + 1 : maxNum + 1);
                fs.mkdirSync(currentChunk);
                currentPath.maxChunkSurplus = 50;
                currentPath.maxChunk = maxNum + 1;
            } else {
                //如果文件数没有超过50，则继续在这个文件夹内放文件
                const lastNum = 50 - currentChunkFilesNameArrLen;
                currentPath.maxChunkSurplus = lastNum;
                currentPath.maxChunk = maxNum;
            }
            currentPath.pathPrefix = pathPrefix;
            currentPath.path = function() {
                return (
                    currentPath.pathPrefix +
                    "/chunk" +
                    (currentPath.maxChunk < 10
                        ? "0" + currentPath.maxChunk
                        : currentPath.maxChunk)
                );
            };
            //创建新文件时，动态生成地址
            currentPath.getNew = function() {
                currentPath.maxChunkSurplus -= 1;
                if (currentPath.maxChunkSurplus < 1) {
                    currentPath.maxChunk += 1;
                    const ccpath = currentPath.path();
                    fs.mkdirSync(ccpath);
                    currentPath.maxChunkSurplus = 50;
                    return (
                        "C:/Users/30716/AppData/Roaming/Anki2/" +
                        user +
                        "/collection.media"
                    );
                    return ccpath;
                } else {
                    return (
                        "C:/Users/30716/AppData/Roaming/Anki2/" +
                        user +
                        "/collection.media"
                    );
                    return currentPath.path();
                }
            };
        }
    }
    function getTag() {
        const params = process.argv.slice(2);
        const index =
            params.findIndex(item => {
                return item.indexOf("--tag") === 0;
            }) + 1;
        const getProcessName = params[index];
        return getProcessName;
    }

    function getFileName() {
        const params = process.argv.slice(2);
        const index =
            params.findIndex(item => {
                return item.indexOf("--name") === 0;
            }) + 1;
        const getProcessName = params[index];
        return getProcessName;
    }

    function mdToAnki(md, i) {
        let mdName = md.slice(0, md.length - 3);
        let imageDir = cwd + `/md/${mdName}.assets/`;
        // console.log(imageDir)
        getAnkiContent({ mdName, mdPath: md, imageDir, tag }, i);
    }

    //每次执行mdtoanki的命令，都应该先删除txrforanki下的allanki.txt文件 文件路径txtforanki/allanki.txt
    const txtForAnkiPath = 'txtforanki/allanki.txt'
    if(fs.existsSync(txtForAnkiPath)){
        fs.unlinkSync('txtforanki/allanki.txt')
    }
    

    let asyncDone;
    fs.readdir("./", (err, data) => {
        if (mdfilename) {
            mdToAnki(mdfilename);
        } else {
            let mdset = data.filter(item => {
                return item.indexOf(".md") > -1;
            });


            let mdLen = mdset.length;
            asyncDone = new Array(mdLen).fill(false);
            mdset.forEach((md, i) => {
                mdToAnki(md, i);
                // let mdName = md.slice(0, md.length - 3);
                // let imageDir = cwd + `/md/${mdName}.assets/`;
                // // console.log(imageDir)
                // getAnkiContent({ mdName, mdPath: md, imageDir, tag });
            });
        }
    });

    function getAnkiContent({ mdName, mdPath, tag, imageDir }, currentMdIndex) {
        // const asyncQueue = []
        fs.readFile(mdPath, (err, data) => {
            if (err) {
                console.log("读取文件失败");
                return;
            }
            const stringData = data.toString();

            let arrayData = stringData.split("\r\n\r\n");
            let ankiArrayData = [];
            let inputInAnki = false;
            let inputInAnswer = false;
            let contentLocation = "question";

            let chunkId = 0;

            // const mdVP = arrayData.find(item => item.startsWith("V:"));
            // let videoPath = mdVP.split("V:")[1];

            // const prefix = arrayData
            //     .find(item => item.startsWith("P:"))
            //     .split("P:")[1];
            // const user = arrayData
            //     .find(item => item.startsWith("U:"))
            //     .split("U:")[1];

            function setMeta(tag) {
                const tagOption = [
                    { tag: "V:", default: "" },
                    { tag: "P:", default: "" },
                    { tag: "U:", default: 'fractium' },
                    { tag: "B:", default: 10 },
                    { tag: "CL:", default: '' },
                ];
                if (arrayData.find(item => item.startsWith(tag))) {
                    return arrayData
                        .find(item => item.startsWith(tag))
                        .split(tag)[1];
                } else {
                    return tagOption.find(item => item.tag === tag).default;
                }
            }

            const videoPath = setMeta("V:");
            const prefix = setMeta("P:");
            user = setMeta("U:");
            const className = setMeta("CL:");
            const bitrate = parseInt(setMeta("B:"))

            getChunk();
            let lanLearn = false;

            arrayData.forEach((item, i) => {
                if(item.startsWith('PROBLEM:')){
                    // 如果开头是PROBLEM，就判断是含有多个步骤的大问题。将之后的多行传递给 。。。函数处理。
                    
                    // 判断该问题有多少行
                    let nextLine = i+1

                    const problem = [item]

                    // 在草稿处停止
                    while(!arrayData[nextLine].startsWith('DRAFT:')){
                        arrayData[nextLine].skip=true
                        problem.push(arrayData[nextLine])
                        nextLine++
                    }
                    stepToAnki(problem,cwd,user,currentPath).forEach((cardItem,cardItemIndex)=>{
                        ankiArrayData.push({...cardItem,id:i+cardItemIndex})
                    })
                }

                if(item.skip){
                    return
                }

                if (item.indexOf("Q:") == 0) {
                    //中文冒号分割
                    if(item.split('Q:')[1].split('：')[1]){
                        inputInAnki = true;
                    }else {
                        inputInAnki = false;
                        return
                    }
                    inputInAnswer = false;
                    ankiArrayData.push({
                        id: i,
                        question: Array.of(getNewLine(item.split("Q:")[1])),
                        tag: tag + prefix
                    });
                    contentLocation = "question";
                } else if (item.indexOf("A:") == 0) {
                    // //中文冒号分割
                    // if(item.split('A:')[1]){
                    //     inputInAnswer = true;
                    // }else {
                    //     inputInAnswer = false;
                    //     return
                    // }
                    if(!inputInAnki)return
                    lanLearn = false;
                    // let card = ankiArrayData.find(aItem=>{
                    //     return aItem.id==i-1
                    // })
                    contentLocation = "answer";
                    ankiArrayData[ankiArrayData.length - 1][
                        contentLocation
                    ] = Array.of(getNewLine(item.split("A:")[1]));
                    // card && (card.answer=Array.of(getNewLine(item.split('A:')[1])))
                } else if (item.indexOf("T:") == 0) {
                    if(!inputInAnki)return
                    ankiArrayData[ankiArrayData.length - 1].tag =
                        item.split("T:")[1] + prefix;
                } else if (item.indexOf("N:") == 0) {
                    inputInAnki = false;
                } else if (item.indexOf("TI:") == 0) {
                    if(!inputInAnki)return
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
                    // ankiArrayData[ankiArrayData.length - 1].question.push(
                    //     getNewLine(`${mdVideoPath}`)
                    // );
                    // contentLocation = "question";
                    ankiArrayData[ankiArrayData.length - 1][
                        contentLocation
                    ].push(
                        `<img style="display: none" src="${mdVideoPath}" />`
                    );
                    ankiArrayData[ankiArrayData.length - 1][
                        contentLocation
                    ].push(content);
                } else if (item.startsWith("F:")) {
                    if(!inputInAnki)return
                    ankiArrayData[ankiArrayData.length - 1].lanLearn = true;
                    contentLocation = "foreign";
                    content = getNewLine(item.split("F:")[1]);
                    if (
                        !ankiArrayData[ankiArrayData.length - 1][
                            contentLocation
                        ]
                    ) {
                        ankiArrayData[ankiArrayData.length - 1][
                            contentLocation
                        ] = [];
                    }
                    ankiArrayData[ankiArrayData.length - 1][
                        contentLocation
                    ].push(content);
                } else if (item.startsWith("C:")) {
                    if(!inputInAnki)return
                    contentLocation = "chinese";
                    content = getNewLine(item.split("C:")[1]);
                    if (
                        !ankiArrayData[ankiArrayData.length - 1][
                            contentLocation
                        ]
                    ) {
                        ankiArrayData[ankiArrayData.length - 1][
                            contentLocation
                        ] = [];
                    }
                    ankiArrayData[ankiArrayData.length - 1][
                        contentLocation
                    ].push(content);
                } else if (item.indexOf("#") !== 0 && inputInAnki) {
                    if(!inputInAnki)return
                    // if (!inputInAnki) return;
                    let content;
                    if (isImage(item)) {
                        content = getAnkiImgaeSrc(item);
                        const imagName = getImageName(item);
                        //获得图片路径
                        
                        const imageDir = cwd + `/md/${item.split('/')[1]}/`

                        copyImage(imagName, imageDir, user);
                    } else {
                        content = getNewLine(item);
                    }
                    // if (inputInAnswer) {
                    //     contentLocation = "answer";
                    // } else {
                    //     contentLocation = "question";
                    // }
                    ankiArrayData[ankiArrayData.length - 1][
                        contentLocation
                    ].push(content);
                }

                //如果是最后一行，则认为对该文件的处理已经完成
                if (i === arrayData.length - 1) {
                    asyncDone[currentMdIndex] = true;
                }
                // console.log(i,arrayData.length-1)
                //如果所有的文件处理都已经完成，则进行拆分视频

                if (asyncDone.every(item => item)) {
                    let chunk
                    if(asyncQueue.length<parallel){
                        chunk = []
                        chunk.push(asyncQueue)
                    }else {
                        chunk = _.chunk(
                            asyncQueue,
                            asyncQueue.length / parallel
                        );
                        
                    }
                    if (chunk.length>parallel) {
                        const deletedArr = chunk.splice(-1, 1);
                        chunk[0].push(...deletedArr[0]);
                    }
                    
                    chunk.forEach(item => {
                        chunkAsyncFunc(item);
                    });
                }
            });

            let ankiArrayContent = [];
            ankiArrayData.forEach((item, i) => {
                let cardString;
                if (item.tag) {
                    if (item.lanLearn) {
                        cardString =
                            item.question.join("") +
                            "\t" +
                            item.answer.join("") +
                            "\t" +
                            item.foreign.join("") +
                            "\t" +
                            item.chinese.join("") +
                            "\t" +
                            item.tag +
                            "\t";
                    } else {
                        cardString =
                            item.question.join("") +
                            "\t" +
                            item.answer.join("") +
                            "\t" +
                            item.tag +
                            "\t";
                    }
                } else {
                    cardString =
                        item.question.join("") +
                        "\t" +
                        item.answer.join("") +
                        "\t";
                }
                // console.log(cardString)
                ankiArrayContent.push(cardString);
            });
            let result = ankiArrayContent.join("\n");
            mkdirsSync('./txtforanki')
            if(result){
                fs.writeFile('txtforanki/'+mdName + ".txt", result, "utf8", err => {
                    err && console.log("写入失败");
                });
            }
            if (result) {
                fs.appendFile("txtforanki/allanki.txt", "\n" + result, "utf8", err => {
                    err && console.log("写入失败");
                });
            }
        });
    }

    // getAnkiContent({mdPath:'./test.md' ,tag:'测试'})

    function isImage(string) {
        return string.indexOf("![") > -1;
    }
    function getImageName(image) {
        let ArrayImageSrc = image.split("/");
        let imageName = ArrayImageSrc[ArrayImageSrc.length - 1];
        imageName = imageName.slice(0, imageName.length - 1);
        return imageName;
    }
    function getAnkiImgaeSrc(image) {
        return `<img src="anki-paste${getImageName(image)}" >`;
    }
    function getNewLine(content) {
        if (!content) return "";
        return `<div>${content}</div>`;
    }

    function copyFile(src, goal) {
        fs.readFile(src, (err, data) => {
            err && console.log("copy fail: read fail");
            fs.writeFile(goal, data, err => {
                err && console.log("copy fail: write fail");
            });
        });
    }

    function copyImage(imageName, imageDir, user = "按钮开") {
        let src = imageDir + imageName;
        let ccpath = currentPath.getNew();
        // console.log(ccpath);
        let goal = ccpath + "/anki-paste" + imageName;
        copyFile(src, goal);
    }
}
main();
