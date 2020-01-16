const copyFile = require('./copyFile')
function copyImage(imageName, imageDir, user = "按钮开",currentPath) {
    let src = imageDir + imageName;
    let ccpath = currentPath.getNew();
    let goal = ccpath + "/anki-paste" + imageName;
    copyFile(src, goal);
}
module.exports = copyImage