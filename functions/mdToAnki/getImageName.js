const path = require("path");
module.exports = function getImageName(image) {

    let imageName = path.basename(image.match(/\](.+)/)[0].slice(2,-1));

    return imageName;
};
