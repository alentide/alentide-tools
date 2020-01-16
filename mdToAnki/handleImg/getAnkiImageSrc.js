const getImageName= require('./getImageName')

module.exports = function getAnkiImageSrc(image) {
    return `<img src="anki-paste${getImageName(image)}" >`;
};
