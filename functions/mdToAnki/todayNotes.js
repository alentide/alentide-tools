const fs = require("fs");
const path = require("path");
const moment = require("moment");

const todayNotes = function() {
    const meta = {
        dir: "./" + moment().format("YYYY年MM月DD日"),
        fileTemplates: [],
        line: "\r\n\r\n",
        templates({ fileName, noteType, cardType, tag, use }) {
            const line = this.line;
            if (!use) return false;
            return `牌组类：${cardType}${line}笔记类：${noteType}${line}标签：${tag}${line}`;
        }
    };
    fs.access(meta.dir, fs.constants.R_OK, err => {
        if (err) {
            fs.mkdirSync(meta.dir);
        }

        meta.fileTemplates.push(
            ...JSON.parse(
                fs.readFileSync("C:/alxsd/utils/db/mdtoanki.json").toString()
            )
        );

        meta.fileTemplates.forEach(fileMeta => {
            const filePath = path.join(meta.dir, fileMeta.fileName) + ".md";
            fs.access(filePath, fs.constants.R_OK, err => {
                if (!err) return;
                fs.writeFile(filePath, meta.templates(fileMeta), err => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    });
};

module.exports = todayNotes;
