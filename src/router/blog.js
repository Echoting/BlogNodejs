
const {
	getBlogList,
	getBlogDetail,
	addBlog,
	updateBlog,
	deleteBlog
} = require('../controller/blog.js')
const {SuccessModel, ErrorModel} = require('../model/resModel.js')

// 统一的登录验证函数
const loginCheck = req => {
	if (!req.session.username) {
		return new Promise((resolve, reject) => {
			resolve(new ErrorModel('尚未登录'))
		})
	}
}

const handleBlogRouter = (req, res) => {
	const {method, path} = req

	
	if (method === 'GET' && path === '/api/blog/list') {

		const {keyword, author} = req.query
		const result = getBlogList(author, keyword)

		return result.then(listData => {
			return new SuccessModel(listData)
		})
	}

	if (method === 'GET' && path === '/api/blog/detail') {
		const id = req.query.id || ''
		const result = getBlogDetail(id)
		return result.then(blogData => {
			return new SuccessModel(blogData)
		})
	}

	if (method === 'POST' && path === '/api/blog/add') {
		const checkLoginResult = loginCheck(req)
		if (checkLoginResult) {
			return checkLoginResult
		}

		const author = req.session.username
		const reqBlogData = req.body
		const addBlogData = {
			...reqBlogData,
			createtime: new Date().getTime(),
			author: author
		}

		const result = addBlog(addBlogData)

		return result.then(insertResult => {
			return new SuccessModel(insertResult)
		})
	}

	if (method === 'POST' && path === '/api/blog/update') {
		const checkLoginResult = loginCheck(req)
		if (checkLoginResult) {
			return checkLoginResult
		}

		const {id, blogData} = req.body
		const updateBlogResult = updateBlog(id, blogData)
		return updateBlogResult.then(res => {
			if (res) {
				return new SuccessModel(updateBlogResult)
			} else {
				return new ErrorModel(`未找到id = ${id}的博客`)
			}
		})
	}

	if (method === 'POST' && path === '/api/blog/delete') {
		const checkLoginResult = loginCheck(req)
		if (checkLoginResult) {
			return checkLoginResult
		}

		const id = req.body.id || ''
		const deleteResult = deleteBlog(id)

		return deleteResult.then(res => {
			if (res) {
				return new SuccessModel(deleteResult)
			} else {
				return new ErrorModel(`未找到id = ${id}的博客`)
			}
		})

		if (deleteResult) {
			return new SuccessModel(deleteResult)
		} else {
			return new ErrorModel('删除博客失败')
		}
	}
}

module.exports = handleBlogRouter