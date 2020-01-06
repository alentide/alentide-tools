const fs = require('fs')
const _ = require('lodash')
function main() {
    const originDataSplitByLine = require('./originDataSplitByLine')

    //有单词的行 abstract　［ˈæbstrækt］
    const regWrod = /^[a-z]+[　［]+\S+[］]$/
    const regMeaning = /^(adj|n|vt|adv|vi|v|prep|aux\.v|art|prop|num|int|conj)\./
    const regExample = /^例 /
    let inputWord = false

    const result = []

    originDataSplitByLine.forEach((item,i)=>{
        if(regWrod.test(item)){
            //如果是单词行
            inputWord = true
            const word = item.split('［')[0].trim()
            const pronunciation = '［'+item.split('［')[1].trim()
            result.push({word})
            !result.slice(-1)[0].pronunciation && (result.slice(-1)[0].pronunciation = [])
            result.slice(-1)[0].pronunciation.push(pronunciation)
        }else if(regMeaning.test(item)||regExample.test(originDataSplitByLine[i+1])){
            //如果是意思行
            if(!result.slice(-1)[0].meaning ){
                result.slice(-1)[0].meaning = []
            }
            result.slice(-1)[0].meaning.push(item)
            
        }
    })
    //处理相同单词行
    function isArray(o){
        return Object.prototype.toString.call(o)=='[object Array]';
    }
    result.forEach((item,i)=>{
        result.forEach((item2,i2)=>{
            if(item2.word === item.word && item2.meaning !== item.meaning){
                for(var key in item2){
                    if(key!=='word'){
                        if(isArray(item[key])){
                            item[key] = _.unionWith(item[key],item2[key],_.isEqual)
                        }
                    }
                }
                result.splice(i2,1)
            }
        })
        
    })
    const tomd = require('./tomd')
    tomd(result)
    const vote = result.find(item=>{
        return item.word === 'outrage'
    })
    // console.log(vote)
    // console.log(result.length)
    // console.log(originDataSplitByLine);
}

main()
