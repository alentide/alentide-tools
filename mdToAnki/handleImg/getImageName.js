const path = require("path");
module.exports = function getImageName(image) {
    // let ArrayImageSrc = image.split("/");
    // let imageName = ArrayImageSrc[ArrayImageSrc.length - 1];
    // imageName = imageName.slice(0, imageName.length - 1);
    let imageName = image
        .split("(")[1]
        .substring(0, image.split("(")[1].length - 1);

    imageName = path.basename(imageName);
    // console.log(path.basename(imageName))
    return imageName;
};
