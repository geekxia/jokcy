const axios = require('axios');
const path = require('path');
const webpack = require('webpack');  // 引入webpack
const MemoryFs = require('memory-fs');
const proxy = require('http-proxy-middleware');
const ReactDOMServer = require('react-dom/server');


// 开发环境下，html模板和boundle结果没有写在硬盘上
const getTemplate = () => {
    return new Promise((resolve, reject) => {
        // 读取devServer服务中的打包结果
        axios.get('http://localhost:8888/public/index.html').then(res => {
            resolve(res.data);
        }).catch(reject);
    })
}

const serverConfig = require('../../build/webpack.config.server');
const serverCompiler = webpack(serverConfig);
const mfs = new MemoryFs;
serverCompiler.outputFileSystem = mfs;
let serverBundle;
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

})

module.exports = function (app) {
    app.use('/public', proxy({
        target: 'http://localhost:8888'
    }));
    app.get('*', function(req, res) {
        getTemplate().then(template => {
            const content = ReactDOMServer.renderToString(serverBundle);
            res.send(template.replace('<!-- app -->', content));
        })
    })
}
