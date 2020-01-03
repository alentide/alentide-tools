console.log(123);
function oneAsyncFun(index, cb) {
    setTimeout(function() {
        console.log("执行了一个异步操作--" + index);
        cb(null, true);
    }, 2000);
}
const { promisify } = require("util");
const promiseAsync = promisify(oneAsyncFun);

//for(var i =0;i<10;i++){
//	oneAsyncFun(i)
//}
//

// promiseasync(0).then((success)=>{
// 	if(success){
// 		return promiseasync(1)
// 	}
// 	console.log(error,success)
// }).then((success)=>{
// 	if(success){
// 		return promiseasync(2)
// 	}
// }).catch(error=>{
// 	console.log(error)
// })
const _ = require('lodash')

async function chunkAsyncFunc (arr){
	// arr.forEach(async (item,i)=>{
	// 	await item(i)
	// })

	for(var i =0;i<arr.length;i++){
		await arr[i](i)
	}
}

let arr = []
arr.push(promiseAsync)
arr.push(promiseAsync)
arr.push(promiseAsync)
arr.push(promiseAsync)
arr.push(promiseAsync)
arr.push(promiseAsync)
arr.push(promiseAsync)
const chunk = _.chunk(arr,(arr.length/3))
if(arr.length%3>0){
	const deletedArr = chunk.splice(-1,1)
	chunk[0].push(...deletedArr[0])
	console.log(chunk)
}

chunk.forEach(item=>{
	chunkAsyncFunc(item)
})



// console.log(chunk)

// (async function() {
//     for (var i = 0; i < 10; i++) {
//         await promiseAsync(i);
//     }
// })();
// (async function() {
//     for (var i = 10; i < 20; i++) {
//         await promiseAsync(i);
//     }
// })();
