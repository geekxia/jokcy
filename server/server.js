const express = require('express');
const ReactSSR = require('react-dom/server');  // 用于服务端渲染的API
// require默认引入的是整个模块exports出来的内容，所以要用.default
const path = require('path');
const fs = require('fs');
const favicon = require('serve-favicon');  // 制作网站小图标
const bodyParser = require('body-parser'); // 转换POST请求的body数据
const session = require('express-session'); // 存储session

/**
*   基础变量
*/
const app = express();
const isDev = process.env.NODE_ENV === 'development';

/**
*   中间件
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    maxAge: 10 * 60 * 1000,
    name: 'tid',
    resave: false,
    saveUninitialized: false,
    secret: 'react node class'
}));

app.use(favicon(path.join(__dirname, '../favicon.ico')));

app.use('/api/user', require('./util/login')); // 登录接口
app.use('/api', require('./util/proxy'));      // 接口代理



/**
*   服务端渲染
*/
if (isDev) {
    // 开发环境时，没有dist目录
    // const devStatic = require('./util/devStatic');
    // devStatic(app);
    console.log('这是开发环境');
    app.get('*', function(req, res) {
        res.send('hello development');
    })
} else {
    app.use('/public', express.static(path.join(__dirname, '../dist')));
    let template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');
    const serverScript = require('../dist/render.js').default; // 引入用于服务端渲染的脚本
    app.get('*', function(req, res) {
        const renderScript = ReactSSR.renderToString(serverScript);
        // 对所有请求，都进行服务端渲染
        template = template.replace('<!-- app -->', renderScript);
        res.send(template);
    });
}


/**
*   端口监听
*/
app.listen(8899, function() {
    console.log('server is listening on 8899');
});
