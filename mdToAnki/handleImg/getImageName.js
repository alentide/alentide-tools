module.exports = function getImageName(image) {
    let ArrayImageSrc = image.split("/");
    let imageName = ArrayImageSrc[ArrayImageSrc.length - 1];
    imageName = imageName.slice(0, imageName.length - 1);
    return imageName;
};
