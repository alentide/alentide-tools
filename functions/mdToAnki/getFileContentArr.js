// 接收1：string 文件路径
// 返回：数组

const fs = require('fs')

function getFileContentArr(filename) {

    const fileStr = fs.readFileSync(filename).toString();

    if (fileStr.startsWith("\\r\\n")) {
        line = "\r\n";
    } else if (fileStr.startsWith("\\n")) {
        line = "\n";
    } else {
        line = "\r\n\r\n";
    }

    return fileStr.split(line)
}

module.exports = getFileContentArr;
