function getNotes ({currentLine,meta,basis='注释：',cardList}) {
    if(!meta.inputLocation) return
    cardList.slice(-1)[0].notes = [
        getNewLine(currentLine.split(basis)[1])
    ];
    meta.inputLocation = null
}

module.exports = getNotes