const readXDFE = require("./readXDFE");
const fs = require("fs");

// 两张
// Q:english翻译：sfdsfsdsf

// A:english翻译：第三方第三方士大夫

// T:english

// N:

const getStr = function(english, chinese) {
    return `Q:english翻译：${english}\r\n\r\nA:english翻译：${chinese}\r\n\r\nT:english翻译\r\n\r\nN:\r\n\r\n`;
};

async function start() {
    const allContent = await readXDFE('../A-l.txt');
    // const allContent = ['例 The abstract of the conference last week was distributed before the meeting to all the members. 上周会议的摘要已于开会之前分发给所有成员。'];
    const allWords = [];

    allContent.forEach(item => {
        // const currentLines = item.split(/[\s|\s+|[；，]]/g);
        const currentLines = item.split(/[\s|\s+|；，]/g);
        // console.log(currentLines)
        currentLines.forEach(item2 => {
            const word = item2.trim();
            if (/^[a-zA-Z-.]+$/.test(word)) {
                if (word.includes(".")) {
                    allWords.push(word.split(".")[0]);
                } else {
                    allWords.push(word);
                }
            }
        });
    });

    function unique(arr) {
        return Array.from(new Set(arr));
    }

    const uniqueWords = unique(allWords);
    // console.log(uniqueWords)
    console.log(uniqueWords.length);
    const str = uniqueWords.join("\r\n");
    fs.writeFile("./md/useWords.txt", str, "utf8", err => {
        err && console.log("写入失败");
    });
    return;
    const exampleLines = allContent.filter(item => {
        return item.includes("例　");
    });

    const exampleLinesArr = exampleLines
        .map(item => {
            const tempArr = [];
            const splitTemp = item.split("　");
            splitTemp[1].trim();

            // console.log(item)
            // console.log(splitTemp)
            // return
            if (splitTemp[1].includes(".")) {
                const splitTempDot = splitTemp[1].split(".");
                const english = [];
                for (var i = 0; i < splitTempDot.length - 1; i++) {
                    english.push(splitTempDot[i]);
                }
                tempArr.push(english.join(".") + ".");
                tempArr.push(splitTempDot.slice(-1));
            }

            // if(splitTemp[1].includes('Mr.')){

            //     tempArr.push(splitTempDot[2]);
            // }else {
            //     tempArr.push(splitTemp[1].split(".")[0]+'.');
            //     tempArr.push(splitTemp[1].split(".")[1]);
            // }
            return tempArr;
        })
        .filter(item => {
            return item.length != 0;
        });
    // return
    const sayMDArr = exampleLinesArr.map((item, i) => {
        // if(/^[a-z-]+$/.test(item[0].trim())){
        //     return getStr(item[0].trim(), item[1]);
        // }

        return getStr(item[0], item[1]);
    });

    // pronouciationLinesArr.forEach((item,i)=>{
    //     if(!/^[a-z-]+$/.test(item[0].trim())){
    //         console.log(i+'==========')
    //         console.log(item)
    //     }
    // })

    return;
    sayMDArr.forEach(item => {
        fs.appendFile("./md/useWords.md", item, "utf8", err => {
            err && console.log("写入失败");
        });
    });
    // console.log(sayMDArr.slice(4600, 4676));
}

start();
