const params = process.argv.slice(2)
const index = params.findIndex(item=>{
    return item.indexOf('--name')===0
})+1
const getProcessName = params[index]

console.log(getProcessName)