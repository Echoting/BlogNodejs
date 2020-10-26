const {exec, escape} = require('../database/mysql.js')
const {genPassword} = require('../utils/cryp')

const login = (username, password) => {
	// 防止sql注入
	username = escape(username)

	// 密码加密
	password = genPassword(password)
	password = escape(password)

	const sql = `select username, realname from users where username=${username} and password=${password}`
	return exec(sql).then(rows => {
		return rows[0]
	})
}

module.exports = {
	login
}