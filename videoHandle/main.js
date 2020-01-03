const splitVideo = require("./splitVideo");
const getVideoParams = require("./getVideoParams");
const fs = require("fs");

const { promisify } = require("util");
const splitVideoAsync = promisify(splitVideo);

// const mdTI = "TI: 9.03 -  10 ";

// const { duration, start } = getVideoParams(mdTI);

// const splitVideoParams = {
//     inputPath: "./1.mp4",
//     duration,
//     start
// };
// let chunkId = 1;
// let chunkStr;
// if (chunkId < 10) {
//     chunkStr = "00" + chunkId;
// } else if (chunkId < 100) {
//     chunkStr = "0" + chunkId;
// }
// splitVideoParams.outPath = `${
//     splitVideoParams.inputPath.split(".mp4")[0]
// }_chunk_${chunkStr}.webm`;

// splitVideo(splitVideoParams);

const path = require("path");

function videoHandle(
    mdTI,
    inputPath = "1.mp4",
    chunkId = 1,
    prefix = "",
    user = "test",
    bitrate
) {
    const { duration, start } = getVideoParams(mdTI);
    const splitVideoParams = {
        inputPath,
        duration,
        start
    };

    if (chunkId < 10) {
        chunkStr = "00" + chunkId;
    } else if (chunkId < 100) {
        chunkStr = "0" + chunkId;
    }
    // const mdVideoPath = `${prefix}${
    //     path.basename(splitVideoParams.inputPath).split(".")[0]
    // }_chunk_${chunkStr}.webm`;

    const basename = path.basename(splitVideoParams.inputPath);
    const index = basename.lastIndexOf(".");
    const basenameNoExt = basename.slice(0, index);
    // const chunk = chunkPath.split('/').slice(-4).join('/')
    const mdVideoPath = `${prefix}${basenameNoExt}_${start
        .split(":")
        .join("-")}_${duration}.webm`;

    // const mdVideoPath = `${prefix}${
    //     path.basename(splitVideoParams.inputPath).split(".")[0]
    // }_${start}_${duration}.webm`;

    //由于输出的位置是动态生成的，不再写死地址，而是写成一个函数
    splitVideoParams.outPath = `C:/Users/30716/AppData/Roaming/Anki2/${user}/collection.media/${mdVideoPath}`;
    // splitVideoParams.outPath = function(currentChunk){
    //     return `C:/Users/30716/AppData/Roaming/Anki2/${user}/collection.media/${currentChunk}/${mdVideoPath}`
    // };

    const videoHTML = {};

    //html也是动态生成的
    videoHTML.html = `<video autoplay="true" loop controls="controls" id="video"  src="${mdVideoPath}" style="width:100%;display:inline-block;"></video>`;
    // videoHTML.html = function(currentChunk){
    //     return `<video autoplay="true" loop controls="controls" id="video"  src="${currentChunk}/${mdVideoPath}" style="width:100%;display:inline-block;"></video>`
    // }
    videoHTML.mdVideoPath = mdVideoPath;
    // videoHTML.mdVideoPath=function(){
    //     return currentChunk +'/'+ mdVideoPath
    // }
    bitrate && (splitVideoParams.bitrate = bitrate)
    videoHTML.splitVideo = async function() {
        const needSplitVideo = !fs.existsSync(splitVideoParams.outPath);
        needSplitVideo && (await splitVideoAsync(splitVideoParams));
    };
    return videoHTML;
}

module.exports = videoHandle;
