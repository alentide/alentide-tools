const NeDB = require('nedb')

const db = new NeDB({
    filename: __dirname +'/'+'notes.db',
    autoload: true
})

module.exports = db