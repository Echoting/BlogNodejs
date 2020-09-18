const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog.js')
const handleUserRouter = require('./src/router/user.js')

// 用于处理 post data
const getPostData = req => {
	const promise = new Promise((resolve, reject) => {
		if (req.method !== 'POST') {
			resolve({})
			return
		}

		if (req.headers['content-type'] !== 'application/json') {
			resolve({})
			return
		}

		// 正式处理数据
		let postData = ''
		req.on('data', chunk => {
			postData += chunk.toString()
		})

		req.on('end', () => {
			if (!postData) {
				resolve({})
				return
			}
			resolve(
				JSON.parse(postData)
			)
		})
	})

	return promise
}

const getCookieExpires = () => {
	const d = new Date()
	d.setTime(d.getTime() + (24 * 60 * 60 * 1000))

	return d.toGMTString()
}

// session数据
let SESSION_DATA = {}

const serverHandle = (req, res) => {
	// 设置返回格式 json
	res.setHeader('Content-type', 'application/json')

	// 获取path
	const url = req.url
	req.path = url.split('?')[0]

	// 解析query
	req.query = querystring.parse(url.split('?')[1])

	// 解析cookie
	req.cookie = {}
	const cookieStr = req.headers.cookie || '' // 'k1=v1;k2=v2;k3=v3'
	cookieStr.split(';').forEach(item => {
		if (!item) {
			return
		}
		const cookieItemArr = item.split('=')
		const key = cookieItemArr[0].trim()
		const value = cookieItemArr[1].trim()
		req.cookie[key] = value
	})

	// 处理session
	let needSetCookie = false
	let userId = req.cookie.userid;
	// 如果没有userId则创建一个userId
	if (!userId) {
		needSetCookie = true
		userId = `${Date.now()}_${Math.random()}`
	}
	if(!SESSION_DATA[userId]) {
		SESSION_DATA[userId] = {}
	}
	req.session = SESSION_DATA[userId]

	// 解析post数据
	getPostData(req).then(postData => {
		req.body = postData

		// 处理blog路由
		// const blogData = handleBlogRouter(req, res)
		// if (blogData) {
		// 	res.end(JSON.stringify(blogData))
		// 	return
		// }
		const blogResult = handleBlogRouter(req, res)
		if (blogResult) {
			blogResult.then(blogData => {
				if (needSetCookie) {
					res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
				}
				res.end(JSON.stringify(blogData))
			})

			return
		}

		// 处理user路由
		const userResult = handleUserRouter(req, res)
		if (userResult) {
			
			userResult.then(userData => {
				if (needSetCookie) {
					res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
				}
				res.end(JSON.stringify(userData))
			})

			return
		}

		// 未命中路由 返回404
		res.writeHead(404, {'Content-type': 'text/plain'})
		res.write('404 Not Found')
		res.end()
	})
}

module.exports = serverHandle