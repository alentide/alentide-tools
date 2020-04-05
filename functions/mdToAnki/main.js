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
        basis: "牌组类：",
        handler({ meta, currentLine, basis }) {
            meta.deckName = currentLine.split(basis)[1];
        }
    },
    {
        basis: "笔记类：",
        handler({ meta, currentLine, basis }) {
            meta.modelName = currentLine.split(basis)[1];
        }
    },
    {
        basis: "序号：",
        handler({ meta, currentLine, basis }) {
            const content = currentLine.split(basis)[1];
            if (content.startsWith("d")) {
                meta.index = content.split("d")[1];
                meta.deleted = true;
            } else {
                meta.deleted = false;
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

async function mdToAnki(filePath, armDB, cb) {
    const meta = {
        user: "fractium",
        tag: '',
        prefix: "",
        bitrate: 10,
        className: "",
        inputLocation: [],
        filePath,
        deckName: "",
        modelName: "",
        deleted: false,
        intendation: '====',

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
    const fileLineSplitByIntendation = fileContentArr.map(line => line.split(meta.intendation));

    fileLineSplitByIntendation.forEach(originLine => {
        // console.log(originLine)
        //取出非空部分
        // let currentLine
        // if(originLine.length===1){
        //     currentLine = originLine.join(meta.intendation);
        // }else {
        //     currentLine = originLine.slice(1).join(meta.intendation);
        // }
        currentLine = originLine.slice(-1)[0];
        
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
    
    // const cardDB = require('./db/card')

    // cardDB.findOne()

    //内存数据库
    // const armDB = [];

    const originNotes = cardList.map(card => {
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
    });


    //测试用的db数据库和正常用的分开
    let db
    if(meta.deckName === 'test'&& meta.modelName === 'test'){
        db = require('./db/testdb')
    }else {
        db = require("./db/db");
    }
    //得到被判定为删除的卡片
    const deletedNotes = originNotes.filter(note=>{
        return note.deleted === true
    })
    //从db中获得删除卡片id
    deletedNotes.forEach(note=>{
        db.findOne({filePath:note.filePath,index:note.index},async function(err,doc){
            if(doc){
                //发送请求，使anki删除对应卡片，并删除db里面的那份,还有armDB那份
                const result = await http.post("/", {
                    action: "deleteNotes",
                    version: 6,
                    params: {
                        notes: [doc.id]
                    }
                });
                armDB.splice(armDB.findIndex(armDBNote=>{
                    return armDBNote.id ===doc.id
                }),1)

                db.remove({id:doc.id},{},function(err,numRemove){
                    console.log(`本地仓库db移除了${numRemove}条数据`)
                })
            }
        })
    })
    


    const notes = originNotes
        .filter(
            //anki的删除还是手动删除比较好，这里仅跳过对本地删除的卡片
            card => card.deleted === false && card.deckName && card.modelName
        )
        .filter(note => {
            const equalNote = armDB.find(armNote => {
                // console.log(note.originFields.front===armNote.originFields.front,note.originFields.back === armNote.originFields.back)
                if (
                    note.originFields.front === armNote.originFields.front &&
                    note.originFields.back === armNote.originFields.back
                ) {
                    return true;
                }
                return false;
            });
            return !equalNote;
        });

    const http = require("./http/main");

    // console.log(notes)
    // console.log(
    //     "===============================",
    //     notes,
    //     "--------------------",
    //     "armDB[0]"
    // );
    // console.log("mdtoanki会被频繁触发吗");
    if (notes.length === 0) {
        // console.log(armDB);
        cb && cb();
        return;
    } //如果没有添加过，则添加到数据库和anki;

    (async function recursiveFind(i) {
        if (i === notes.length) {
            notes.forEach(note => {
                note.fields.正面 = note.originFields.front + note.randomCode;
            });
            const needInputNotes = notes.filter(
                note => note.needInput === true
            );
            if (needInputNotes.length > 0) {
                const { data } = await http.post("/", {
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
                db.insert(
                    needInputNotes.filter(note => {
                        //如果没有拿到id，说明加入anki失败，那么也不应该添加到本地
                        return note.id;
                    })
                );
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
        if (!note) {
            cb && cb();
            return;
        }
        db.findOne(
            { filePath: note.filePath, index: note.index },
            async function(err, doc) {
                note.randomCode = `<div style="display:none" >${Math.random() +
                    Date.now()}</div>`;
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
                    //在内存里保存引入的数据
                    const thisDocInArmDBHasIndex = armDB.findIndex(armNote => {
                        return (
                            armNote.originFields.front ===
                                doc.originFields.front &&
                            armNote.originFields.back === doc.originFields.back
                        );
                    });
                    // console.log(thisDocInArmDBHasIndex);
                    if (thisDocInArmDBHasIndex > -1) {
                        armDB.splice(thisDocInArmDBHasIndex, 1, note);
                    } else {
                        armDB.push(note);
                    }

                    //允许下个一mdtoanki执行
                    cb && cb();

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
