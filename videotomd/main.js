const fs = require('fs')
function videotomd() {
    //获得执行命令的文件夹下的文件列表
    const files = fs.readdirSync(process.cwd())
    if(!files.includes('md')){
        fs.mkdirSync('./md')
    }
    files.forEach(file=>{
        fs.writeFileSync(`./md/${file}.md`,'')
    })

}

module.exports = videotomd