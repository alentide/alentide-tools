const fs = require("fs");

function IO(type) {
    this.type = type;
    // this.start = start
    this.children = {};
    this.allFileName = [];
}

IO.prototype.readdir = function(path, parent) {
    const data = fs.readdirSync(path + "/");
    if (!parent) {
        parent = {};
        // parent =[]
    }
    let result = [];
    if (data.length === 0) return;
    data.forEach(item => {
        const subpath = path + "/" + item;
        const stat = fs.lstatSync(subpath);
        const is_direc = stat.isDirectory(); // true || false 判断是不是文件夹

        let subItem = {};
        if (is_direc) {
            subItem.isDir = true;
            const subpath = path + "/" + item;
            this.readdir(subpath);
        } else {
            subItem.isDir = false;
        }
        subItem.parent = path;
        subItem.parentArr = subItem.parent.split("/");
        subItem.name = item;
        this.allFileName.push(subItem);
    });
};
IO.prototype.mkdir = function(path, type) {
    this.readdir(path);
    const allFileName = this.allFileName;
    const dirLen = [];
    allFileName.forEach(item => {
        dirLen.push(item.parentArr.length);
    });
    const maxDirLen = Math.max(...dirLen);

    const dirLenArr = Array(maxDirLen)
        .fill(0)
        .map((v, i) => i + 1);
    // console.log(allFileName)
    dirLenArr.forEach(c => {
        allFileName.forEach(item => {
            if (item.parentArr.length === c) {
                let newParentArr = item.parentArr.map(x =>
                    x === ".." ? (x = "./md") : x
                );
                fs.existsSync("./md") || fs.mkdirSync("./md");
                const currentPath = newParentArr.join("/");
                fs.existsSync(currentPath) || fs.mkdirSync(currentPath);
            }
        });
    });

    //创建文件
};
IO.prototype.mkmd = function(type) {
    const allFileName = this.allFileName;
    allFileName.forEach(item => {
        if (item.isDir) return;
        let newParentArr = item.parentArr.map(x =>
            x === ".." ? (x = "./md") : x
        );
        const currentPath = newParentArr.join("/");
        const fileName = item.name.split(`.${type}`)[0];
        const filePath = currentPath + "/" + fileName + ".md";
        fs.writeFile(filePath, '', "utf8", err => {
            err && console.log("在目录下创建md文件时发生错误");
        });
    });
};
IO.prototype.amkmd = function(dirname,type) {
    const data = this.readdir(`../${dirname}`);

    this.mkdir(`../${dirname}`);
    this.mkmd(type);
};

module.exports= IO

