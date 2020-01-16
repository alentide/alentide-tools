const fs = require('fs')
const fileList = fs.readdirSync(__dirname)


const handleImg = {}

fileList.forEach(item=>{
    if(item==='main.js') return
    const filename = item.split('.js')[0]
    handleImg[filename] = require('./'+item)
})


module.exports = handleImg