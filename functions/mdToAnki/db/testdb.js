const NeDB = require('nedb')

const db = new NeDB({
    filename: __dirname +'/'+'test.db',
    autoload: true
})

module.exports = db