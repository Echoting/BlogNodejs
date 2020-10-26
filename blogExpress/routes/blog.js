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

/* GET home page. */
router.get('/list', function(req, res, next) {
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
});

module.exports = router;
