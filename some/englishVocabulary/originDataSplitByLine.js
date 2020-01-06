const fs = require("fs");
const originData = fs.readFileSync("content.txt").toString();
const _ = require('lodash')
// 该文本是以\n换行的
const originDataSplitByLine = originData.split("\n");
//去掉空行
originDataLinesWithContent = _.compact(originDataSplitByLine)

module.exports = originDataLinesWithContent