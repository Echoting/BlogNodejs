const redis = require('redis')
const {REDIS_CONF} = require('../config/db.js')

const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', err => {
	console.error(err)
})

function redisSet(key, value) {
	if (typeof value === 'object') {
		value = JSON.stringify(value)
	}
	redisClient.set(key, value, redis.print)
}

function redisGet(key) {
	const promise = new Promise((resolve, reject) => {
		redisClient.get(key, (err, value) => {
			if (err) {
				console.error(err)
				return
			}

			try {
				resolve(JSON.parse(value))
			} catch (ex) {
				resolve(value)
			}

			// 退出
			// redisClient.quit()
		})
	})

	return promise
}

module.exports = {
	redisGet,
	redisSet
}