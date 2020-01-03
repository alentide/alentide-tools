const readXDFE = require("./readXDFE");
const fs = require('fs')


// 一张
// Q:english：abstract 的读音是：

// A:［əˈbjuːs］

// T:english

// N:

const getStr = function(word, pronunciation) {
    return `Q:english：${word}的读音是：\r\n\r\nA:${pronunciation}\r\n\r\nT:english\r\n\r\nN:\r\n\r\n`;
};

async function start() {
    const allContent = await readXDFE();
    const pronouciationLines = allContent.filter(item => {
        return item.includes("［") && item.includes("］");
    });

    const pronouciationLinesArr = pronouciationLines.map(item => {
        const tempArr = [];
        tempArr.push(item.split("［")[0]);
        tempArr.push("［" + item.split("［")[1]);
        return tempArr;
    });
    const sayMDArr = pronouciationLinesArr.map(item => {
        if(/^[a-z-]+$/.test(item[0].trim())){
            return getStr(item[0].trim(), item[1]);
        }
        
    });
    
    // pronouciationLinesArr.forEach((item,i)=>{
    //     if(!/^[a-z-]+$/.test(item[0].trim())){
    //         console.log(i+'==========')
    //         console.log(item)
    //     }
    // })

    // return
    sayMDArr.forEach(item=>{
        fs.appendFile("./md/wordPronunciation.md", item, "utf8", err => {
            err && console.log("写入失败");
        });
    })
    // console.log(sayMDArr.slice(4600, 4676));
}

start();
