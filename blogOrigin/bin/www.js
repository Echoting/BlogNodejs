const http = require('http')

const serverHandle = require('../app.js')

const port = 4000

const server = http.createServer((req, res) => {
	serverHandle(req, res)
})

server.listen(port)
console.log('listening ', port)

