const copyFile = require('../copyFile')
const path = require('path')
function copyImage(imageName, imageDir,currentPath) {
    let src = path.join(imageDir,imageName)    
    let goal = currentPath + "/anki-paste" + imageName;
    copyFile(src, goal,false);
}
module.exports = copyImage