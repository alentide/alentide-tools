function getUser({currentLine,meta,basis='用户名：'}){
    meta.user = currentLine.split(basis)[1];
}

module.exports = getUser