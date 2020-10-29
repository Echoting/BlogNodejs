const {exec, escape} = require('../database/mysql.js')
const {genPassword} = require('../utils/cryp')

const login = async (username, password) => {
	// 防止sql注入
	username = escape(username)

	// 密码加密
	password = genPassword(password)
	password = escape(password)

	const sql = `select username, realname from users where username=${username} and password=${password}`

	const rows = await exec(sql)
	return rows[0] || {}
}

module.exports = {
	login
}