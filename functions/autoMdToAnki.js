const path = require("path");

const watchFile = require("./watchFile");
const mdToAnki = require("./mdToAnki/main");

//事件节流
const throttle = function(func, delay) {
    let prev = Date.now();

    return (...args) => {
        let now = Date.now();
        if (now - prev > delay) {
            func.apply(this, args);
            prev = Date.now();
        } else {
            console.log("触发节流机制，本次事件触发无效");
        }
    };
};

function unique(arr) {
    return Array.from(new Set(arr));
}

//感觉防抖更合适
const debounce = function(func, delay) {
    let timer = null;
    const eventQueue = [];
    const tempEventQueue = [];

    // let lastAsyncIsDone = true; //判断上一次异步操作是否结束
    let asyncIsDoing = false;

    const timeoutFuc = (args) => {
        //进入此处时，之后的所有的事件都放在temp里
        // lastAsyncIsDone = false
        // asyncIsDoing = true
        
        // console.log(func)
        //但是此处事件其实并没有真正的进行
        if(asyncIsDoing){
            //自动往后推迟
            timer = setTimeout(timeoutFuc,delay)
            console.log('推迟当前的操作')
            return
        }else {
            //将temp放入event
            eventQueue.push(...tempEventQueue)
        }
        
        asyncIsDoing = true
        
        //一旦进入了这里，说明开始了操作了
        // asyncIsDoing = true;

        //对事件队列进行去重，并去掉无效的事件，比如非md文件不应当触发事件
        let uniqueEventQueue = eventQueue.filter(event => {
            return (
                event.endsWith(".md") &&
                !path.parse(event).base.startsWith(".~")
            );
        });
        uniqueEventQueue = unique(uniqueEventQueue);
        // console.log(uniqueEventQueue)
        eventQueue.splice(0, eventQueue.length, ...uniqueEventQueue);
        console.log(eventQueue);
        // return
        // console.log('结束去重啦')
        //去完重之后，就开始一个一个处理

        //以下的回调，第一次会触发多次，不知道为什么。
        function recursive(i) {
            console.log(i,eventQueue.length)
            // console.log(eventQueue)
            if (i >= eventQueue.length) {
                //到此，说明所有事件处理完毕，
                // lastAsyncIsDone = true;
                asyncIsDoing = false;
                eventQueue.splice(0);
                return;
            }
            // lastAsyncIsDone = false;
            asyncIsDoing = true;
            let lastI = i
            i++
            func.call(this, eventQueue[lastI], args[1], ()=>recursive(i));
        }

        recursive(0)

        // func.apply(this,args)
        // console.log(func)
    };

    //由于事件可能被错误的触发，所以

    return (...args) => {
        //判断之前的事件处理完了吗？
        if (asyncIsDoing) {
            tempEventQueue.push(args[0]);
        } else {
            eventQueue.push(args[0]);
        }

        clearTimeout(timer);

        timer = setTimeout(timeoutFuc.bind(this,args), delay);
    };
};

function main() {
    const watchPath = process.cwd();
    const delay = 5*1000
    watchFile(
        watchPath,
        debounce((fileName, armDB, cb) => {
            mdToAnki(fileName, armDB, cb);
        }, delay)
    );
}

module.exports = main;
