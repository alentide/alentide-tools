const fs = require("fs");
const path = require("path");
const shortid = require("shortid");

const mdToAnkiFunctions = [
    "getDetail",
    "getStep",
    "getNotes",
    "getUser",
    "getTag",
    "getPrefix",
    "getImage",
    "getFileContentArr",
    "getNewLine",
    "getFront",
    "getBack"
];

mdToAnkiFunctions.forEach(key => {
    global[key] = require(`./${key}`);
});

let options = [
    {
        basis: "用户名：",
        handler: getUser
    },
    {
        basis: '牌组类：',
        handler({ meta, currentLine, basis }) {
            meta.deckName = currentLine.split(basis)[1];
        }
    },
    {
        basis: '笔记类：',
        handler({ meta, currentLine, basis }) {
            meta.modelName = currentLine.split(basis)[1];
        }
    },
    {
        basis: "序号：",
        handler({ meta, currentLine, basis }) {
            const content = currentLine.split(basis)[1]
            if(content.startsWith('d')){
                meta.index = content.split('d')[1]
                meta.deleted = true
            }else {
                meta.deleted = false
                meta.index = currentLine.split(basis)[1];
            }
            
        }
    },
    {
        basis: "标签：",
        handler: getTag
    },
    {
        basis: "前缀：",
        handler: getPrefix
    },
    {
        basis: "问：",
        handler: getStep
    },
    {
        basis: "答：",
        handler: getDetail
    },
    {
        basis: "注释：",
        handler: getNotes
    },
    {
        basis: "![",
        handler: getImage
    },
    {
        basis: "",
        handler({ currentLine, meta }) {
            meta.inputLocation &&
                meta.inputLocation.push(getNewLine(currentLine));
        }
    }
];

async function mdToAnki(filePath) {
    const meta = {
        user: "fractium",
        tag: "",
        prefix: "",
        bitrate: 10,
        className: "",
        inputLocation: [],
        filePath,
        deckName: '',
        modelName: '',
        deleted: false,

        get currentPath() {
            return (
                "C:/Users/30716/AppData/Roaming/Anki2/" +
                this.user +
                "/collection.media"
            );
        }
    };
    const parentList = [], //根据tab缩进次数存储当前卡片，方便后续卡片找到他们的父卡片
        cardList = [], //初次处理得到的卡片列表，此时，step，detail还是数组，不是最终的字符串，而且未将父卡片或子卡片部分内容放到当前卡片。
        cards = []; //这个cards是最终的卡片列表，这里的step，detail等属性都是处理后的字符串，并且父子关系处理完毕，可直接用于生成txt文件

    // 读取文件，获得文件数据
    const fileContentArr = getFileContentArr(filePath);

    //去除每行开头的tab缩进
    const fileLineSplitByTab = fileContentArr.map(line => line.split("\t"));

    fileLineSplitByTab.forEach(originLine => {
        //取出非空部分
        const currentLine = originLine.slice(-1)[0];
        options.some((option, i, keysList) => {
            if (currentLine.startsWith(option.basis)) {
                option.handler({
                    meta,
                    currentLine,
                    parentList,
                    cardList,
                    originLine,
                    basis: option.basis
                });
                return true;
            }
            return false;
        });
    });

    // 得到正反两面
    cardList.forEach(card => {
        getFront({ card, cardList });
        getBack({ card, cardList });
        card.filePath = meta.filePath;
    });

    //发送请求
    let notesIdList;
    const db = require("./db/db");
    // const cardDB = require('./db/card')

    // cardDB.findOne()

    const notes = cardList.map(card => {
        return {
            deckName: card.deckName,
            modelName: card.modelName,
            fields: {
                正面: card.front,
                背面: card.back
            },
            originFields: {
                front: card.front,
                back: card.back
            },
            randomCode: "",
            tags: card.tag.split(" "),
            filePath: card.filePath,
            index: card.index,
            deleted: card.deleted
        };
    }).filter(card=>card.deleted === false && card.deckName && card.modelName);//anki的删除还是手动删除比较好，这里仅跳过对本地删除的卡片
    const http = require("./http/main");

    //判断是否以添加到anki过

    //如果没有添加过，则添加到数据库和anki
    (async function recursiveFind(i) {
        if (i === notes.length) {
            notes.forEach(note => {
                note.fields.正面 =
                    note.originFields.front+note.randomCode;
            });
            const needInputNotes = notes.filter(
                note => note.needInput === true
            );
            if (needInputNotes.length > 0) {
                const {data} = await http.post("/", {
                    action: "addNotes",
                    version: 6,
                    params: {
                        notes: needInputNotes
                    }
                });
                notesIdList = data.result;
                needInputNotes.forEach((note, i) => {
                    // db.update(
                    //     { filePath: note.filePath, index: note.index },
                    //     { id: notesIdList[i] }
                    // );
                    note.id = notesIdList[i];
                });
                db.insert(needInputNotes);
            }

            // 更新
            const needUpdateNotes = notes.filter(
                note => note.needUpdate === true
            );
            if (needUpdateNotes.length > 0) {
                needUpdateNotes.forEach(async (note, i) => {
                    note.id = parseInt(note.id);
                    const result = await http.post("/", {
                        action: "updateNoteFields",
                        version: 6,
                        params: {
                            note: note
                        }
                    });
                });

                needUpdateNotes.forEach((note, i) => {
                    db.update(
                        { filePath: note.filePath, index: note.index },
                        { $set: { fields: note.fields } }
                    );
                });
            }
            return;
        }
        const note = notes[i];
        db.findOne(
            { filePath: note.filePath, index: note.index },
            async function(err, doc) {
                note.randomCode = `<div style="display:none" >${Math.random()+Date.now()}</div>`;
                if (doc) {
                    if (
                        note.originFields.front !== doc.originFields.front ||
                        note.originFields.back !== doc.originFields.back
                    ) {
                        note.needUpdate = true;
                        note.id = doc.id;
                    } else {
                        note.needUpdate = false;
                    }
                    note.needInput = false;
                } else {
                    note.needInput = true;
                    note.needUpdate = false;
                }

                i++;
                recursiveFind(i);
            }
        );
    })(0);

 
    //保留下来note的id,
}
// mdToAnki("D:/Notes/2020年/2020年03月10日-2020年03月15日.md");

module.exports = mdToAnki;
