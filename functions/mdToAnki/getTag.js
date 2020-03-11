function getTag ({currentLine,meta,basis='标签：'}) {
    meta.tag = currentLine.split(basis)[1];
}

module.exports = getTag