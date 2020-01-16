function getNewLine(content) {
    if (!content) return "";
    
    return `<div>${content}</div>`;
}

module.exports = getNewLine