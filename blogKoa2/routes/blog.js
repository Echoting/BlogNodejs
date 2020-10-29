const router = require('koa-router')()

const {
    getBlogList,
    getBlogDetail,
    addBlog,
    updateBlog,
    deleteBlog
} = require('../controller/blog.js')

const {SuccessModel, ErrorModel} = require('../model/resModel.js')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

router.get('/list', async (ctx, next) => {
    let {keyword, author} = ctx.query

    // 管理员页面
    if (ctx.request.query.isadmin) {
        if (!(ctx.session && ctx.session.username)) {
            ctx.body = new ErrorModel('尚未登录')
        }

        // 管理员强制查询自己的博客
        author = ctx.session ?  ctx.session.username : ''
    }


    const listData = await getBlogList(author, keyword)
    return ctx.body = new SuccessModel(listData)
})

router.get('/detail', async (ctx, next) => {
    const id = ctx.query.id || ''
    const blogData = await getBlogDetail(id)

    return ctx.body = new SuccessModel(blogData)
})

router.post('/add', loginCheck, async (ctx, next) => {
    const author = ctx.session.username
    const reqBlogData = ctx.request.body
    const addBlogData = {
        ...reqBlogData,
        createtime: new Date().getTime(),
        author: author
    }

    const insertResult = await addBlog(addBlogData)

    return ctx.body = new SuccessModel(insertResult)
})

router.post('/update', loginCheck, async (ctx, next) => {
    const {id, content, title} = ctx.request.body
    const blogData = {
        title,
        content
    }
    const updateBlogResult = await updateBlog(id, blogData)

    return ctx.body = updateBlogResult
        ? new SuccessModel({
            blogId: id
        })
        : new ErrorModel(`未找到id = ${id}的博客`)
})

router.post('/delete', loginCheck, async (ctx, next) => {
    const id = ctx.request.body.id || ''
    const deleteResult = await deleteBlog(id)
    return ctx.body = deleteResult
        ? new SuccessModel()
        : new ErrorModel(`未找到id = ${id}的博客`)
})



module.exports = router