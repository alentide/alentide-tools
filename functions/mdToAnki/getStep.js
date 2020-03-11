const getNewline = require("./getNewLine");
const shortid = require("shortid");

function getStep({
    originLine: line,
    meta,
    prefix = "",
    basis = "问：",
    parentList,
    cardList
}) {
    //如果索引不存在，则该卡片不被录入
    if (!meta.index) {
        meta.inputLocation = null
        return;
    }
    if (
        cardList.find(card => {
            return card.index === meta.index;
        })
    ) {
        meta.inputLocation = null
        return;
    }

    if (!meta.tag) {
        meta.tag = "默认";
    }
    const currentLine = line.slice(-1)[0];
    // if(meta.index == null)
    const card = {
        index: meta.index,
        step: [getNewline(meta.tag + prefix + currentLine.split(basis)[1])],
        id: shortid.generate(),
        tag: meta.tag,
        deckName: meta.deckName,
        modelName: meta.modelName,
        prefix,
        deleted: meta.deleted
    };
    cardList.push(card);
    if (!parentList["parent" + line.length]) {
        parentList["parent" + line.length] = [];
    }
    parentList["parent" + line.length].push(card);

    if (line.length > 1) {
        card.parent = parentList["parent" + (line.length - 1)].slice(-1)[0].id;
    }
    meta.inputLocation = card.step;
}

module.exports = getStep;
