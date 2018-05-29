import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/App.js';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import appState from './store/appState';

// AppContainer包裹，代码热更新
const root = document.getElementById('root');
const render = Component => {
    ReactDOM.hydrate(
        <AppContainer>
            <Provider appState={appState}>
                <BrowserRouter>
                    <Component />
                </BrowserRouter>
            </Provider>
        </AppContainer>,
        root
    )
}

render(App);

if (module.hot) {
    console.log('有代码更新');
    module.hot.accept('./views/App.js', () => {
        const NewApp = require('./views/App.js').default;
        render(NewApp);
    })
}
