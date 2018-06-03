import React from 'react';
import axios from 'axios';

export default class Test extends React.Component {
    _getTopics() {
        axios.get('/api/topics').then(resp => {
            console.log('话题列表', resp);
        }).catch(err => {
            console.log(err);
        });
    }

    _testLogin() {
        axios.post('/api/user/login', {
            accessToken: 'd9346378-924f-435b-a835-9fad64acaba9'
        }).then(resp => {
            console.log('登录', resp);
        }).catch(err => {
            console.log(err);
        });
    }

    _markAll() {
        axios.post('/api/message/mark_all?needAccessToken=true').then(resp=>{
            console.log('MarkAll', resp);
        }).catch(err => {
            console.log(err);
        });
    }
    render() {
        return(
            <div>
                <button onClick={this._getTopics.bind(this)}>Get Topics</button>
                <button onClick={this._testLogin.bind(this)}>Test Login</button>
                <button onClick={this._markAll.bind(this)}>Mark All</button>

            </div>
        )
    }
}
