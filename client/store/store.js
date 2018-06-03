import AppStateClass from './AppState';

export const AppState = AppStateClass;

export default {
    AppState,
}

// 用于服务端渲染
export const createStoreMap = () => {
    return {
        appState: new AppState(),
    }
}
