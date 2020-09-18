
const {
	login
} = require('../controller/user.js')
const {SuccessModel, ErrorModel} = require('../model/resModel.js')

const handleUserRouter = (req, res) => {
	const {method, path} = req
	
	if (method === 'GET' && path === '/api/user/login') {
		// const {username, password} = req.body
		const {username, password} = req.query
		const result = login(username, password)
		const {userid} = req.cookie
		
		return result.then(data => {
			if (data && data.username) {
				// 操作cookie
				req.session[userid] = {
					username: data.username,
					realname: data.realname
				}
				return new SuccessModel({
					username: data.username
				})
			}
			return new ErrorModel('尚未登录')
		})
	}

	if (method === 'GET' && path === '/api/user/login-test') {
		// const {username, password} = req.body
		const {userid} = req.cookie
		if (req.session[userid]) {
			return Promise.resolve(new SuccessModel({
					...req.session[userid]
				})
			)
		}

		return Promise.resolve(new ErrorModel('尚未登录'))
	}
}

module.exports = handleUserRouter
