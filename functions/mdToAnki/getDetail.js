const getNewLine = require('./getNewLine')

function getAnswers ({currentLine,meta,basis='答：',cardList}) {
    if(!meta.inputLocation)return
    cardList.slice(-1)[0].detail = [
        getNewLine(currentLine.split(basis)[1])
    ];
    meta.inputLocation = cardList.slice(-1)[0].detail;
}

module.exports = getAnswers