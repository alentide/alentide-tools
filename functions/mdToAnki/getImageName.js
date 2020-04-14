const path = require("path");
 function getImageName(originImage) {
    const image = originImage.trim()
    let imageName = path.basename(image.match(/\](.+)/)[0].slice(2,-1));
    return imageName;
};


module.exports =getImageName
