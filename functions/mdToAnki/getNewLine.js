function getNewLine(content) {
    if (!content) return `<div></div>`;
    
    return `<div>${content}</div>`;
}

module.exports = getNewLine