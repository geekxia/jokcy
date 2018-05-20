const path = require('path');
const HTMLPlugin = require('html-webpack-plugin'); // 用于把boundle结果插入到HTML模板中去
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';

let config = {
    // 打包的入口
    entry: {
        app: path.join(__dirname, '../client/index.js')
    },
    // 打包的结果，hash用于浏览器缓存
    output: {
        filename: '[name].[hash].js',
        path: path.join(__dirname, '../dist'),
        // 静态资源引用时的路径，它会自动添加到静态资源URL中，很重要，CDN时也会用到
        // publicPath: '',
        publicPath: '/public/'
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
    },
    plugins: [
        new HTMLPlugin({
            template: path.join(__dirname, '../client/template.html')
        })
    ]
}

if (isDev) {
    config.devServer = {
        host: '0.0.0.0',
        port: '8888',
        contentBase: path.join(__dirname, '../dist'),
        hot: true,
        overlay: {
            errors: true
        },
        publicPath: '/public/',
        historyApiFallback: {
            index: '/public/index.html'
        }
    };

    config.entry = {
        app: [
            'react-hot-loader/patch',
            path.join(__dirname, '../client/index.js')
        ]
    };

    config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = config;
