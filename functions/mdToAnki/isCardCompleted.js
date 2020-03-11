// 接收：对象
// 返回：布尔值
function isCardCompleted(card, version) {
    switch (version) {
        case 1:
            // 第一版
            // 接收一个对象
            // 对象要有notes属性，notes是数组
            // notes有一个以上元素时，返回true，认为卡片已完成，否则返回false，认为卡片没有完成
            if (!(card && card.notes instanceof Array)) return false;
            if (!card.notes[0]) return false;
            return true;
        default:
        //判断一个卡片是否完成，改成判断一个卡片是否稳定，只有当一个卡片的各个内容在一段时间内没有发生改变，才认为它被完成了
        
    }
}

module.exports = isCardCompleted;
