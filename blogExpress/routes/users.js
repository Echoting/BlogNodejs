var express = require('express');
var router = express.Router();

const {SuccessModel, ErrorModel} = require('../model/resModel.js')

const {
	login
} = require('../controller/user.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
	const {username, password} = req.body;
	const result = login(username, password)
		// const {userid} = req.cookie
		
	return result.then(data => {
		if (data && data.username) {
			// 操作cookie
			req.session.username = data.username
			req.session.realname = data.realname
			// req.session = {
			// 	username: data.username,
			// 	realname: data.realname
			// }
			
			res.json(new SuccessModel())

			return
		}
		res.json(new ErrorModel('尚未登录'))
	})
});

// router.get('/login-test', function(req, res, next) {
// 	console.log(123, req.session)
// 	if (req.session.username) {
// 		res.json({
// 			status: 0,
// 			message: 'success',
// 			username: req.session.username,
// 			realname: req.session.realname
// 		})
// 	}

// 	res.json({
// 			status: -1,
// 			message: 'fail'
// 		})
// })

module.exports = router;
