/*
  reducer:一个纯函数，用于状态管理
  根据老的状态产生新的状态，交给store来更新状态
* */
import {LOGIN,LOGIN_SUCCESS,RELOAD_PAGE} from './action-types'
const loginUser={};
function login(state=loginUser,action) {
    switch (action.type) {
        case LOGIN:
            return action.data;
        case LOGIN_SUCCESS:
            // debugger
            setTimeout(()=>{
                window.location.href=action.data.url;
            },action.data.time*1000);
            return action.data;
        case RELOAD_PAGE:
            // debugger
            setTimeout(()=>{
                window.location.href=action.data.url;
            },action.data.time*1000);
            return action.data;
        default:
            return state;
    }
};


/*const nav=combineReducers({homeNav,myNav});
export default nav*/
export default  login ;