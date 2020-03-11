function getFront({card, cardList}) {
    card.fronts = [card.step.join("")];
    if (card.parent) {
        const parent = cardList.find(item => item.id === card.parent);

        card.fronts.push(parent.step.join(""));
    }
    card.front = card.fronts.reverse().join("");
}

module.exports = getFront;
