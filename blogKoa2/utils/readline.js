const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 文件名
const fileName = path.join(__dirname, '../../logs', 'access.log')
// 创建readSteam
const readStream = fs.createReadStream(fileName)

// 创建readline对象
const readlineObj = readline.createInterface({
	input: readStream
})

let totalLog = 0
let chromeNum = 0

// 逐行读取
readlineObj.on('line', lineData => {
	if (!lineData) {
		return
	}

	// 记录总行数
	totalLog++

	const logArr = lineData.split(' -- ')
	if (logArr[2] && logArr[2].indexOf('Chrome') > 0) {
		chromeNum ++
	}
})

readlineObj.on('close', () => {
	console.log('chore占比情况', chromeNum/totalLog)
})