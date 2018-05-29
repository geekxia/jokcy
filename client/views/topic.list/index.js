import React from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { AppState } from '../../store/appState';

@inject('appState') @observer
export default class TopicList extends React.Component {
    constructor() {
        super();
    }
    _changeName(e) {
        this.props.appState.changeName(e.target.value);
    }
    render() {
        return (
            <div>
                <h3>话题列表</h3>
                <div><input type="text" onChange={this._changeName.bind(this)}/></div>
                <div>{this.props.appState.msg}</div>
            </div>

        )
    }
}

TopicList.propTypes = {
    appState: PropTypes.instanceOf(AppState).isRequired,
}
