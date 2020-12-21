#### 项目目录：

- blogExpress  使用express框架开发的blog系统
- blogKoa2  使用koa2开发的blog系统
- blogOrigin  不使用任何框架开发的blog系统
- Frontend-page  前端页面文件夹

#### 转发：nginx

本系统使用的nginx做的转发，nginx的配置如下：

```javascript
后端端口：4000
前端页面端口：8000
nginx端口：1234
```

#### redis存储登录信息

```javascript
启动redis: redis-server
应用redis配置信息：redis-server  /usr/local/etc/redis.conf
```

#### 启动项目

1、启动redis

```
redis-server
```

2、启动后端服务

```
// 代码中的默认端口为 4000
npm run dev
```

3、启动前端服务，页面跑起来

```
// 使用http-server启动前端页面，并将端口设置为8000
http-server -p 8000
```

4、启动niginx

```
nginx
```

查看nginx配置文件：vim /usr/local/etc/nginx/nginx.conf

```
nginx.config已经配置为：
...
listen       1234;
server_name  localhost;

#charset koi8-r;

#access_log  logs/host.access.log  main;

#location / {
#    root   html;
#    index  index.html index.htm;
#}

location / {
	proxy_pass   http://localhost:8000;
}

location /api/ {
	proxy_pass   http://localhost:4000;
	proxy_set_header Host $host;
}
...
```



如果报错：nginx: [emerg] bind() to 0.0.0.0:1234 failed (48: Address already in use)

说明nginx已经在跑了，sudo nginx -s stop 来停止nginx，然后重新启动就好了

5、然后就可以在页面 

http://localhost:1234   博客主页面

http://localhost:1234/admin.html  管理页面


