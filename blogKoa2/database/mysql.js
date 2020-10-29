const mysql = require('mysql')
const {MYSQL_CONF} = require('../config/db.js') 

// 创建链接对象
const con = mysql.createConnection(MYSQL_CONF)

// 开始连接
con.connect()

// 统一执行sql语句
function exec(sql) {
	const promise = new Promise((resolve, reject) => {
		con.query(sql, (err, result) => {
			if (err) {
				reject(err)
				return
			}
			resolve(result)
		})
	})

	return promise
}

// 关闭连接，这里不能关闭，需要一直保持连接
// con.end()

module.exports = {
	exec,
	escape: mysql.escape
}