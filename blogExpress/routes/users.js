var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
	const {username, password} = req.body;
	res.json({
		status: 'ok',
		data: {
			username,
			password
		}
	})
});

module.exports = router;
