const {exec} = require('child_process')
class Win10 {
    
    useDos=(instruction)=>{
        exec(instruction,(err,stdout,stderr)=>{
            if(err) {
                console.log(err);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        })
    }
}

module.exports = Win10