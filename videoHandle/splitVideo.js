const ffmpeg = require("fluent-ffmpeg");


function splitVideo ({inputPath,outPath,start,duration,bitrate=10},cb){
    let needRun = true
    !inputPath && (needRun = false)
    !outPath && (needRun = false)
    if(!needRun) {
        console.log('分割视频缺少必要参数')
        return
    }
    ffmpeg(inputPath)
    .setStartTime(start)
    .setDuration(duration)
    .videoBitrate(bitrate)
    .output(outPath)
    .on("end", function(err, file) {
        if (!err) {
            console.log("conversion Done");
        }else {
            console.log(err)
        }
        cb && cb(null,true)
        
    })
    .on("error", function(err) {
        console.log("error: ", +err);
    })
    .run();
}

// splitVideo({inputPath: './1.mp4',outPath:'./1-chunk01.webm',start:'00:12:20',duration:10})

module.exports = splitVideo

{/* <video autoplay="true" controls="controls" id="video" playbackrate="0.5" src="1-chunk.webm" style="width:100%;display:inline-block;"></video> */}