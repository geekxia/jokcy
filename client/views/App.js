import React from 'react';
import Routes from '../config/router';
import { Link } from 'react-router-dom';

export default class App extends React.Component {
    render() {
        return(
            <div>
                <div>
                    <Link to='/'>列表页</Link><br/>
                    <Link to='/detail'>话题详情</Link>
                </div><br/><br/>
                <Routes />
            </div>
        )
    }
}
