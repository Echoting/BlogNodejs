const fs = require('fs')
const path = require('path')

// const data = require('../../logs/access.log');

// 写日志
function writeLog(writeStream, log) {
	writeStream.write(log + '\n')
}

// 生成write Stream
function getWriteStream(fileName) {
	const fullFileName = path.join(__dirname, '../../logs', fileName)
	const writeStream = fs.createWriteStream(fullFileName, {
		flags: 'a' // a 是追加，w是覆盖 
	})

	return writeStream
}

// 写访问日志
const accessWriteStream = getWriteStream('access.log')
function access(log) {
	writeLog(accessWriteStream, log)
}

// 写错误日志
const errorWriteStream = getWriteStream('error.log')
function errorLog(log) {
	writeLog(errorWriteStream, log)
}

module.exports = {
	access,
	errorLog
}