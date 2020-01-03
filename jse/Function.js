function asyncfunction(functionCode){
    return new Promise((resolve,reject)=>{
        functionCode.replace(/callback/gi,'resolve')()
    })
}
global.prototype.asyncfunction = asyncfunction