const axios = require('axios')

const http = axios.create({
    baseURL: 'http://localhost:8765'
})

module.exports = http