const path = require('path');
// 服务端打包，不需要html-webpack-plugin
module.exports = {
    target: 'node',
    // 打包的入口
    entry: path.join(__dirname, '../client/render.js'),
    // 打包的结果，hash用于浏览器缓存
    output: {
        filename: 'render.js',
        path: path.join(__dirname, '../dist'),
        // 静态资源引用时的路径，它会自动添加到静态资源URL中，很重要，CDN时也会用到
        publicPath: '/public/',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: [path.join(__dirname, '/node_modules')]
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                exclude: [path.join(__dirname, '/node_modules')]
            }
        ]
    }
}
