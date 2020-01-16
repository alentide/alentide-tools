const fs = require("fs");
const regWord = /^[a-zA-Z-,()'`;\s\/]+$/
let num = 0
function getWord(path, wordBox) {
    const data = fs
        .readFileSync(path, "utf8")
        .toString()
        .trim();
    const dataSplitLines = data.split("\r\n");
    // const wordBox = [];
    dataSplitLines.forEach((item, i) => {
        // if(num<3 &&!regWord.test(item) && !regWord.test(dataSplitLines[i-1])){
        //     console.log(dataSplitLines[0]+"===="+i+"======"+item)
        //     num ++
        // }
        // return
        if (i%2===0) {
            wordBox.push({ word: item ,category:dataSplitLines[0],line:i});
        } else {
            wordBox.slice(-1)[0].allMeaning = item;
            if (item.startsWith("/")) {
                //如果以/ 开头，说明有音标
                wordBox.slice(-1)[0].pronunciation =
                    "/" + item.split("/")[1] + "/";

                //单词意思是：拿到除去音标的部分
                const meaning = item
                    .split("/")
                    .slice(2)
                    .join("/");
                wordBox.slice(-1)[0].meaning = meaning;
                // 如果意思部分含有冒号，则说明有例句，例句以. 或?分割
                if (meaning.includes(": ")) {
                    wordBox.slice(-1)[0].meaning = meaning.split(": ")[0];
                    wordBox.slice(-1)[0].sentence = meaning.split(": ")[1];
                }
            } else {
                //没有音标的情况
                wordBox.slice(-1)[0].meaning = item;
            }
        }
    });
    return wordBox;
}

//单词在第偶数行0,2,4

function getAllWord(root, wordBox) {
    const file = fs.readdirSync(root);
    file.forEach(item => {
        const path = root + "/" + item;
        const stat = fs.lstatSync(path);
        if (!stat.isDirectory()) {
            getWord(path, wordBox);
        } else {
            getAllWord(path,wordBox);
        }
    });
}

const wordBox = [];

const root = "./materials/niujin";

getAllWord(root, wordBox);
// console.log(wordBox.length)
fs.writeFileSync('./njonewordonemeanforanki.txt','')
wordBox.forEach(item=>{
    const template = `<div>牛津一个单词一个意思:${item.word}=======${item.category}=====${item.line}</div>\t<div>${item.allMeaning}</div>\t牛津一个单词一个意思\r\n`
    fs.appendFileSync('./njonewordonemeanforanki.txt',template)
})
// console.log(wordBox[0]);
