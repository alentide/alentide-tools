function isImage(string) {
    return string.indexOf("![") > -1;
}

module.exports =isImage