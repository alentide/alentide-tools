// const inputStr = 'TI: 9.03 -  10.01 '
// const inputStr = 'TI: 9.03 -  10 '

function getVideoParams(input) {
    const paramsArr = input.split("TI:")[1].split("-");
    paramsArr[0] = paramsArr[0].trim();
    paramsArr[1] = paramsArr[1].trim();
    let StartTimeStrArr = [];
    let startMinute;
    let startHour;
    let startSecond;
    let startTimeNum = 0;
    let end = {};
    let needChangeDuration = true;
    let duration;

    let params = {};

    if (paramsArr[0].includes(".")) {
        const startTimeArr = paramsArr[0].split(".");
        const endTimeArr = paramsArr[1].split(".");

        if (startTimeArr.length == 2) {
            StartTimeStrArr.push("00");
            StartTimeStrArr.push(
                startTimeArr[0].length < 2
                    ? "0" + startTimeArr[0]
                    : startTimeArr[0]
            );
            StartTimeStrArr.push(
                startTimeArr[1].length < 2
                    ? "0" + startTimeArr[1]
                    : startTimeArr[1]
            );

            startHour = 0;
            startMinute = parseInt(startTimeArr[0]) * 60;
            startSecond = parseInt(startTimeArr[1]);
        }
        if (endTimeArr.length == 2) {
            end.hour = 0;
            end.minute = parseInt(endTimeArr[0]) * 60;
            end.second = parseInt(endTimeArr[1]);
        } else if (endTimeArr.length === 1) {
            needChangeDuration = false;
            duration = parseInt(endTimeArr[0]);
        }

        //加一，减一，是为了避免剪切视频不精准或者数据不精准，导致该剪进去的没剪进去
        // end.time = end.hour + end.minute+end.second + 1
        // startTimeNum = startHour + startMinute + startSecond -1

        end.time = end.hour + end.minute + end.second;
        startTimeNum = startHour + startMinute + startSecond;

        let startTime = StartTimeStrArr.join(":");
        needChangeDuration && (duration = end.time - startTimeNum);
        if (duration < 0) {
            console.log("error: duration is negative");
        }

        params.duration = duration;
        params.start = startTime;
        // console.log(params)
        
    }else if(paramsArr[0].includes(':')){

        let startTime = paramsArr[0]
        let endTime = paramsArr[1]

        let startTimeSplitByColon = startTime.split(':')
        let endTimeSplitByColon = endTime.split(':')
        let startNum = parseInt(startTimeSplitByColon[0])*3600 + parseInt(startTimeSplitByColon[1])*60 + parseInt(startTimeSplitByColon[2])
        let endNum = parseInt(endTimeSplitByColon[0])*3600 + parseInt(endTimeSplitByColon[1])*60 + parseInt(endTimeSplitByColon[2])
        let duration = endNum - startNum
        if(!paramsArr[1].includes('.')){
            duration = paramsArr[1]
        }
        

        params.duration = duration;
        params.start = startTime;
        // console.log(paramsArr[1].includes('.'))
    }
    // console.log(params)
    return params;
}
// getVideoParams(inputStr)
module.exports = getVideoParams;
