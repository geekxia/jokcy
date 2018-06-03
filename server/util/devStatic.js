const axios = require('axios');
const path = require('path');
const webpack = require('webpack');  // 引入webpack
const MemoryFs = require('memory-fs');
const proxy = require('http-proxy-middleware');
const ReactDOMServer = require('react-dom/server');
const asyncBootstrap = require('react-async-bootstrapper').default;  // 用于解决React组件异步请求数据的问题
const ejs = require('ejs');
const serialize = require('serialize-javascript');

// 开发环境下，html模板和boundle结果没有写在硬盘上
const getTemplate = () => {
    return new Promise((resolve, reject) => {
        // 读取devServer服务中的打包结果
        axios.get('http://localhost:8888/public/server.ejs').then(res => {
            resolve(res.data);
        }).catch(reject);
    })
}

const serverConfig = require('../../build/webpack.config.server');
const serverCompiler = webpack(serverConfig);
const mfs = new MemoryFs;
serverCompiler.outputFileSystem = mfs;
let serverBundle, createStoreMap;
serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(warn => console.warn(warn));

    const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename);
    const bundle = mfs.readFileSync(bundlePath);
    const m = new Module();
    m._compile(bundle, 'render.js');
    serverBundle = m.exports.default;
    createStoreMap = m.exports.createStoreMap;
});

const getStoreState = (stores) => {
    return Object.keys(stores).reduce((result, storeName) => {
        result[storeName] = stores[storeName].toJson();
        return result;
    }, {});
}

module.exports = function (app) {
    app.use('/public', proxy({
        target: 'http://localhost:8888'
    }));
    app.get('*', function(req, res) {
        getTemplate().then(template => {
            const routerContext = {};
            const stores = createStoreMap();
            const app = serverBundle(stores, routerContext, req.url);

            asyncBootstrap(app).then(() => {
                // 服务端路由跳转
                if (routerContext.url) {
                    res.status(302).setHeader('Location', routerContext.url);
                    res.end();
                    return;
                }
                const state = getStoreState(stores);
                // console.log(stores.appState);
                const content = ReactDOMServer.renderToString(app);
                // res.send(template.replace('<!-- app -->', content));
                const html = ejs.render(template, {
                    appString: content,
                    initialState: serialize(state)
                });
                res.send(html);
            });
        })
    })
}
