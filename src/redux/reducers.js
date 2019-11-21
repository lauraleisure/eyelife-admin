import {combineReducers} from 'redux'


import main from '../views/admin/redux/reducers'



/*
  reducer:一个纯函数，用于状态管理
  根据老的状态产生新的状态，交给store来更新状态
* */

export default combineReducers({main})