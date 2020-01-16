//目标是转换成多个对象，这些对象含有question，answer，tag属性
// const line = '\r\n\r\n'

const testStr = [
    "PROBLEM: 把大象关在冰箱里的步骤",
    "p1",
    "p2",
    "STEP: 打开冰箱",
    "s1",
    "s11",
    "DETAILS: 用手。。。。。打开冰箱",
    "d11",
    "d12",
    "STEP: 放入大象",
    "s1",
    "s11",
    "DETAILS:想抱住大象，再往冰箱里扔",
    "STEP: 关上冰箱",
    "DETAILS: 用力使劲按住冰箱门来关上冰箱",
    "TAG: test"
];

/**
 * PROBLEM: 把大象关在冰箱里的步骤
 * STEP-1: 打开冰箱
 * DETAILS: 用手。。。。。打开冰箱
 * STEP-2: 放入大象
 * DETAILS:想抱住大象，再往冰箱里扔
 * STEP-3: 关上冰箱
 * DETAILS: 用力使劲按住冰箱门来关上冰箱
 * TAG:
 * DRAFT:
 *
 * 转化成
 * {question:'',answer:''},{},{}
 */

/**
 * 拿到的是一个数组
 * 数组元素是各行字符串
 */
function stepToAnki(data, imageDir, user,currentPath) {
    const {
        copyImage,
        getAnkiImageSrc,
        isImage,
        getImageName
    } = require("./handleImg/main");
    const getNewLine = require("./getNewLine");
    const ankiCard = {};
    let inputInAnki = false;

    data.forEach(item => {
        if (item.startsWith("PROBLEM:")) {
            ankiCard.problem = [item.split("PROBLEM:")[1]];
            ankiCard.steps = [];
            ankiCard.details = [];

            inputInAnki = true;
            contentLocation = () => ankiCard.problem;
        } else if (item.startsWith("STEP")) {
            ankiCard.steps.push([item.split("STEP:")[1]]);

            contentLocation = () => ankiCard.steps.slice(-1)[0];
        } else if (item.startsWith("DETAILS:")) {
            ankiCard.details.push([item.split("DETAILS:")[1]]);
            contentLocation = () => ankiCard.details.slice(-1)[0];
        } else if (item.startsWith("TAG:")) {
            ankiCard.tag = item.split("TAG:")[1];
        } else {
            if (!inputInAnki) return;
            let content 
            if (isImage(item)) {
                content = getAnkiImageSrc(item);
                const imagName = getImageName(item);

                copyImage(imagName, imageDir, user,currentPath);
            } else {
                content = item
            }
            contentLocation().push(content);
        }
    });

    //主问题卡片：
    const mainCard = {};
    mainCard.question = [];
    mainCard.answer = [];
    ankiCard.problem.forEach(item => {
        mainCard.question.push(getNewLine(item));
    });
    ankiCard.steps.forEach(item => {
        mainCard.answer.push(
            item
                .map(item2 => {
                    return getNewLine(item2);
                })
                .join("")
        );
    });
    mainCard.tag = ankiCard.tag

    //步骤卡片
    const stepsCards = []
    mainCard.answer.forEach((item,i)=>{
        stepsCards.push({
            question: ['<div> 在以下问题中，</div>',...mainCard.question,item,'<div>的过程是：</div>'],
            answer: ankiCard.details[i].map(detailsItem=>{
                return getNewLine(detailsItem)
            }),
            tag: ankiCard.tag
        })
    })
    return [
        mainCard,
        ...stepsCards
    ]

}

// stepToAnki(testStr);

module.exports = stepToAnki;
