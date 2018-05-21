const axios = require('axios');
const path = require('path');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');
const proxy = require('http-proxy-middleware');

const serverConfig = require('../../build/webpack.config.server');
const getTemplate = () => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:8888/public/')
    })
}

module.exports = function (app) {
    app.get('*', function(req, res) {

    })
}
