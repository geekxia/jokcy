const router = require('express').Router();
const axios = require('axios');

const baseUrl = 'http://cnodejs.org/api/v1';

router.post('/login', function(req, res, next) {
    console.log('0000000',req.body);
    // 调用cnode的开放接口
    axios.post(`${baseUrl}/accesstoken`, {
        accesstoken: req.body.accessToken
    }).then(resp => {
        if (resp.status === 200) {
            console.log(1);
            // 存储session
            req.session.user = {
                accessToken: req.body.accessToken,
                loginName: resp.data.loginname,
                id: resp.data.id,
                avatarUrl: resp.data.avatar_url
            };
            // 向客户端返回数据
            res.json({
                success: true,
                data: resp.data
            });
        }
    }).catch(err => {
        console.log(2);
        if (err.response) {
            res.json({
                success: false,
                data: err.response.data  // 嵌套层太多，stringify将无法把JSON转化为字符串
            });
        } else {
            next(err);  // 把错误抛给全局的错误处理器去处理
        }
    });
});

module.exports = router;
