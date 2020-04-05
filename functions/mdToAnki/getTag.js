function getTag ({currentLine,meta,basis='标签：'}) {
    // meta.tag = currentLine.split(basis)[1];

    //应该允许标签是可以增加的，而不是替换
    let tempTagArr = meta.tag.split(' ')
    const newTags = currentLine.split(basis)[1].split(' ')
    newTags.forEach(tag=>{
        if(tag.startsWith('+')){
            tempTagArr.push(tag.substring(1))
        }else if(tag.startsWith('-')){
            const index = tempTagArr.indexOf(tag.substring(1))
            if(index>0){
                tempTagArr.splice(index,1)
            }
        }else {
            tempTagArr= [tag]
        }
    })
    //去除空字符串并连接成字符串。
    meta.tag = tempTagArr.filter(item=>item).join(' ')
}

module.exports = getTag