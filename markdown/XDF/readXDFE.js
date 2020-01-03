const fs = require('fs')
const {promisify} = require('util')

const readFile = promisify(fs.readFile)


const readXDFE = async function (path='../all.txt'){
    const allContent  = await readFile(path)
    const allContentStr = allContent.toString()
    const allContentStrSplitByLines = allContentStr.split('\r\n')

    return allContentStrSplitByLines
}

module.exports =  readXDFE