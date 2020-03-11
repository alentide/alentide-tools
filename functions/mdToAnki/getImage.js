const getAnkiImageContent = require('./getAnkiImageContent')
const getImageName = require('./getImageName')
const path = require('path')
const copyImage = require('./copyImage')


function getImage({currentLine,meta}){
    if(!meta.inputLocation) return

    const imagName = getImageName(currentLine);
    let content = getAnkiImageContent(imagName);


    let imageDir = [path.dirname(currentLine.match(/\](.+)/)[0].slice(2,-1))]
    if(!path.isAbsolute(imageDir[0])){
        imageDir.unshift(path.dirname(meta.filePath))
    }

    copyImage(imagName, imageDir.join('/'), meta.currentPath);
    meta.inputLocation && meta.inputLocation.push(getNewLine(content));
}

module.exports = getImage