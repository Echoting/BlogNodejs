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
	const {keyword, author} = req.query
	const result = getBlogList(author, keyword)

	return result.then(listData => {
		res.json(new SuccessModel(listData))
	})
});

module.exports = router;
