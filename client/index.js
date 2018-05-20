import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import { AppContainer } from 'react-hot-loader';

// AppContainer包裹，代码热更新
const root = document.getElementById('root');
const render = Component => {
    ReactDOM.hydrate(
        <AppContainer>
            <Component />
        </AppContainer>,
        root
    )
}

render(App);

if (module.hot) {
    console.log('有代码更新');
    module.hot.accept('./App.js', () => {
        const NewApp = require('./App.js').default;
        render(NewApp);
    })
}
