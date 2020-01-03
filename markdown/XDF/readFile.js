const fs = require('fs')
const {promisify} = require('util')

const readFile = promisify(fs.readFile)

export default readFile