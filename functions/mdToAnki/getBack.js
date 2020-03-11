function getBack({card, cardList}) {
    card.back =
        card.detail.join("") +
        cardList
            .filter(item => item.parent === card.id)
            .map(item => {
                return item.step.join("");
            })
            .join("");
}

module.exports = getBack;
