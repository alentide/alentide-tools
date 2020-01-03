function utcDate() {
    const date = new Date()
    const dateStr = date.toLocaleDateString()
    const dateArr = dateStr.split('-')
    dateArr.forEach((item,i)=>{
        if(item.length<2){
            dateArr[i] = '0'+item
        }
    })
    // console.log(date.toLocaleDateString())
    // console.log(dateArr)
    return dateArr //[ '2020', '01', '03' ]
}

module.exports = utcDate
// 调试
// utcDate();
