function getPrefix ({currentLine,basis='前缀：',meta}) {
    meta.prefix = currentLine.split(basis)[1];

}

module.exports = getPrefix