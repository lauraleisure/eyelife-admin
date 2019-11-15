import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

import reducers from './reducers';
/*
redux最核心的管理对象
创建store对象，可以同reducer函数交互；
如果不使用action creator, store的创建可以在react组建中，或页面渲染方法调用的地方;
第二个参数：添加状态调试工具：composeWithDevTools(applyMiddleware(thunk))或window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
*/
const store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;