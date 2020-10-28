const http = require('http')

module.exports = class LikeExpress {
    constructor() {
        this.router = {
            all: [],
            get: [],
            post: []
        }
    }

    register(path) {
        const info = {}
        if (typeof path === 'string') {
            info.path = path
            info.stack = [].slice.call(arguments, 1)
        } else {
            info.path = '/'
            info.stack = [].slice.call(arguments, 0)
        }

        return info
    }

    match(method, url) {
        let stack = [];
        if (url === '/favicon.ico') {
            return stack;
        }
        // 获取routes
        let curRoutes = [];
        // concat 是数组中的一个方法，如果没有参数，那么会生成一个当前数组的副本并将其赋值给前面的变量，如果有参数会将参数加入到生成的副本的后面然后将其赋值给变量
        // 如果是use，那么就把use中的路径和中间列表复制到curRoutes中
        // 如果方法是get或post那么下面这句话，由于this.routes.all是undefined，所以会将当前curRoutes生成一个副本赋值给curRoutes，其实一点变化都没有
        curRoutes = curRoutes.concat(this.router.all);
        // 如果是get或post，那么就把相应的路径和中间件复制到curRoutes中
        curRoutes = curRoutes.concat(this.router[method]);

        curRoutes.forEach(routeInfo => {
            // url='/api/get-cookie' routeInfo.path='/'
            // url='/api/get-cookie' routeInfo.path='/api'
            // url='api/get-cookie' routeInfo.path='/api/get-cookie'
            if (url.indexOf(routeInfo.path) === 0) {
                // 匹配成功
                stack = stack.concat(routeInfo.stack);
            }
        });
        return stack;
    }

    handle(req, res, stack) {
        const next = () => {
            // 拿到第一个匹配的中间件
            // shift 取得数组的第一项
            const middleware = stack.shift();
            if (middleware) {
                // 执行中间件函数
                middleware(req, res, next);
            }
        };
        // 定义完后立即执行
        next();

    }

    callback() {
        // callback是一个(req, res) => {} 的函数
        return (req, res) => {
            res.json = data => {
                res.setHeader('Content-type', 'application/json')
                res.end(
                    JSON.stringify(data)
                )
            }

            const url = req.url
            const method = req.method.toLowerCase()

            const resultList = this.match(method, url);
            this.handle(req, res, resultList);
        }
    }

    use() {
        const info = this.register.apply(this, arguments)
        this.router.all.push(info)
    }

    get() {
        const info = this.register.apply(this, arguments)
        this.router.get.push(info)
    }

    post() {
        const info = this.register.apply(this, arguments)
        this.router.post.push(info)
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}