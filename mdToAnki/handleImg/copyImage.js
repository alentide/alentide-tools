const copyFile = require('./copyFile')
function copyImage(imageName, imageDir, user = "按钮开",currentPath) {
    let src = imageDir + imageName;
    let ccpath = currentPath.getNew();
<<<<<<< HEAD
=======
    console.log(ccpath);
>>>>>>> 多步骤问题自动生成多张anki卡片
    let goal = ccpath + "/anki-paste" + imageName;
    copyFile(src, goal);
}
module.exports = copyImage