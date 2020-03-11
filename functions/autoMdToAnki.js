const path = require("path");

const watchFile = require("./watchFile");
const mdToAnki = require("./mdToAnki/main");

function main() {
    const watchPath = process.cwd();
    watchFile(process.cwd(), fileName => {
        if (!fileName.endsWith(".md")) return;
        console.log(fileName)
        mdToAnki(fileName);
    });
}

module.exports = main;
