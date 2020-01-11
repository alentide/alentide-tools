const ffmpeg = require("fluent-ffmpeg");
const fs = require('fs')
const path = require('path')

function autoSplitVideo(filename = "./1.mp4",core=2,defaultDuration=4,user="test") {
    ffmpeg.ffprobe(filename, function(err, data) {
        const duration = Math.ceil(data.format.duration);
        //希望得到0-4,2-6,4-8,6-10之类的。
        const start = [0];
        const end = [4];
        let i = 0;
        while (end[i] < duration) {
            i++;
            start[i] = core * i;
            end[i] = start[i] + 4 < duration ? start[i] + 4 : duration;
        }
        const videoSplitParams = [];
        start.forEach((item, i) => {
            //00-00-00

            const hn = parseInt(item / 60 / 60);
            const mn = parseInt((item - hn * 60 * 60) / 60);
            const sn = parseInt(item - hn * 60 * 60 - mn * 60);

            const h = hn < 10 ? "0" + hn : "" + hn;
            const m = mn < 10 ? "0" + mn : "" + mn;
            const s = sn < 10 ? "0" + sn : "" + sn;
            // const duration = end[i]-item

            videoSplitParams.push({
                start: `${h}:${m}:${s}`,
                duration: defaultDuration
            });
        });
        const result = []
        videoSplitParams.forEach((item, i) => {
            result.push( `Q:english听说：代号：${i}\r\n\r\nTI:${item.start}-${item.duration}\r\n\r\nA:\r\n\r\nT:english听说\r\n\r\nN: \r\n\r\n\r\n\r\n`);
        });
        console.log(videoSplitParams);
        
        fs.writeFileSync(path.basename(filename).split('.')[0]+'.md',`V:${filename}\r\n\r\nP:\r\n\r\nU:${user}\r\n\r\nCL:mask\r\n\r\n\r\n`+result.join(''))
    });
}
module.exports = autoSplitVideo;

