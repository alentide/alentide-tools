const path = require("path");
module.exports = function getImageName(image) {
    // let ArrayImageSrc = image.split("/");
    // let imageName = ArrayImageSrc[ArrayImageSrc.length - 1];
    // imageName = imageName.slice(0, imageName.length - 1);
    // let imageName = image
    //     .split("(")[1]
    //     .substring(0, image.split("(")[1].length - 1);
    let imageName = path.basename(image.match(/\](.+)/)[0].slice(2,-1));
    // console.log(path.basename(imageName))
    return imageName;
};
