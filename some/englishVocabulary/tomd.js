module.exports = function(data) {
    const newline = "\r\n\r\n";
    // const template = `Q:看英语单词说中文意思${word}${newline}A:看中文意思说英语单词${meaning}${newline}`;
    const template = function({ word, meaning, pronunciation }) {
        return (
            "Q:看英语单词说中文意思：" +
            word +
            newline +
            "A:" +
            "读音：" +
            pronunciation.join('  ') +newline+
            meaning.join(newline) +
            newline +
            "T:看英语单词说中文意思" +
            newline +
            newline
        );
    };
    const strArr = [];
    data.forEach(item => {
        if (!item.meaning || item.meaning.length === 0) {
            item.meaning = ["（该单词没有获得中文意思）"];
        }
        strArr.push(template(item));
    });
    const fs = require("fs");
    fs.writeFile("./成果/一个英文单词一个意思.md", strArr.join(""), err => {
        if (err) {
            console.log('写入"一个英文单词一个意思.md" 失败');
        }
    });
};
