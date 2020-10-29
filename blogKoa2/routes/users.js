const router = require('koa-router')()
const {
    login
} = require('../controller/user.js')
const {SuccessModel, ErrorModel} = require('../model/resModel.js')

router.prefix('/api/user')

router.post('/login', async (ctx, next) => {
    const {username, password} = ctx.request.body;
    const data = await login(username, password)

    if (data && data.username) {
        // 操作cookie
        ctx.session = {
            ...ctx.session,
            username: data.username,
            realname: data.realname
        }

        ctx.body = new SuccessModel()
        return
    }

    return ctx.body = new ErrorModel('尚未登录')
})

module.exports = router
