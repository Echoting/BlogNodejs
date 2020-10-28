const express = require('express')

const app = new express()

app.use((req, res, next) => {
    console.log('请求开始...', req.url, req.method)
    next()
})

app.use((req, res, next) => {
    console.log('处理cookie')
    // 假装在处理cookie
    req.cookie = {
        userId: '123'
    }
    next()
})

app.use('/api', (req, res, next) => {
    // 假装在处理cookie
    console.log('处理api路由')
    next()
})

app.get('/api', (req, res, next) => {
    // 假装在处理cookie
    console.log('处理 get api路由')
    next()
})

// 模拟登录校验
function loginCheck(req, res, next) {
    setTimeout(() => {
        console.log(222, '模拟登录成功')
        next()
    })
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
    // 假装在处理cookie
    console.log('处理 get /api/get-cookie 路由')
    res.json({
        errno: 0,
        data: req.cookie
    })
})

app.listen(8000, () => {
    console.log('server is running on port 8000')
})