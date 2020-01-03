const fs = require('fs')
const {promisify} = require('util')

const readFile = promisify(fs.readFile)


function getVB(){
    
}


const readXDFE = async function (){
    const allContent  = await readFile('./all.txt')
    const allContentStr = allContent.toString()

    const result  = await readFile('./test.txt')
    const resultStr = result.toString()
    
    const reulstStrSplitByLines = resultStr.split('\r\n')
    const allContentStrSplitByLines = allContentStr.split('\r\n')
    
    const wordLines = reulstStrSplitByLines.filter(item=>{
        return item.includes('［') && item.includes('］')
    })

    const allContentLines = allContentStrSplitByLines.filter(item=>{
        return (item.includes('［') && item.includes('］') )|| (item.includes('同　'))||(item.includes('〈同'))
    })
    const some = allContentLines.slice(8400,8456)

    const examples = allContentStrSplitByLines

    console.log(some)
    console.log(allContentLines.length)
}

readXDFE()