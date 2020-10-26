var express = require('express');
var router = express.Router();

const {
	getBlogList,
	getBlogDetail,
	addBlog,
	updateBlog,
	deleteBlog
} = require('../controller/blog.js')

const {SuccessModel, ErrorModel} = require('../model/resModel.js')
const loginCheck = require('../middleware/loginCheck')

/* GET home page. */
router.get('/list', (req, res, next) => {
	let {keyword, author} = req.query

	// 管理员页面
	if (req.query.isadmin) {
        if (!req.session.username) {
            res.json(
                new ErrorModel('尚未登录')
            )
        }

        // 管理员强制查询自己的博客
        author = req.session.username
	}


	const result = getBlogList(author, keyword)

	return result.then(listData => {
		res.json(new SuccessModel(listData))
	})
})

router.get('/detail', (req, res, next) => {
    const id = req.query.id || ''
    const result = getBlogDetail(id)
    return result.then(blogData => {
        res.json(
        	new SuccessModel(blogData)
		)
    })
})

router.post('/add', loginCheck, (req, res, next) => {
    const author = req.session.username
    const reqBlogData = req.body
    const addBlogData = {
        ...reqBlogData,
        createtime: new Date().getTime(),
        author: author
    }

    const result = addBlog(addBlogData)

    return result.then(insertResult => {
        res.json(
            new SuccessModel(insertResult)
        )
    })
})

router.post('/update', loginCheck, (req, res, next) => {
    const {id, content, title} = req.body
    const blogData = {
        title,
        content
    }
    const updateBlogResult = updateBlog(id, blogData)
    return updateBlogResult.then(value => {
        if (value) {
            res.json(
                new SuccessModel({
                    blogId: id
				})
            )
        } else {
            res.json(
                new ErrorModel(`未找到id = ${id}的博客`)
            )
        }
    })
})

router.post('/delete', loginCheck, (req, res, next) => {
    const id = req.body.id || ''
    const deleteResult = deleteBlog(id)

    return deleteResult.then(value => {
        if (value) {
            res.json(
                new SuccessModel(deleteResult)
            )
        } else {
            res.json(
                new ErrorModel(`未找到id = ${id}的博客`)
            )
        }
    })
})

module.exports = router;
