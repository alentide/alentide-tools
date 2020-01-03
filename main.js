#!/usr/bin/env node

const CreateMD = require("./CreateMD");
const createMD = new CreateMD();

// require('./markdown/IO')
const IO = require('./markdown/IOSync')


const params = process.argv.slice(2);

const haveDayNote = params.find(
    item => item.includes("--daynote") || item.includes("-dn")
);
haveDayNote && createMD.createDayNote();

const io = new IO();

const cwd = process.cwd();
const backslashIndex = cwd.lastIndexOf("\\");
const dirname = cwd.slice(backslashIndex + 1);



function start(){
    const params = process.argv.slice(2);
    const io = new IO()
    let paramsObj = {}
    params.forEach((item,i)=>{
        if(item.includes('=')){
            item= item.split('-')[1].split('=')
            item[1]=='true' && (item[1]=true)
            item[1]=='false' && (item[1]=false)
            paramsObj[item[0]]=item[1]     
        }else {
            
            item= item.split('-')[1]
            paramsObj[item[0]]=true
        }
    })

    if(paramsObj.md){
        io.createMarkdownByCurrentDirectoryFileName(paramsObj.md)
    }
    paramsObj.amd && io.amkmd(dirname,paramsObj.amd)
    // paramsObj.open && win10.useDos("start C:/alxsd/utils")
}

start()