module.exports = function copyFile(src, goal) {
    const fs = require('fs')
    fs.readFile(src, (err, data) => {
        err && console.log("copy fail: read fail");
        fs.writeFile(goal, data, err => {
            err && console.log("copy fail: write fail");
        });
    });
};
