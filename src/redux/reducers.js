import {combineReducers} from 'redux'

import crumbs from '../component/page_layout/crumb/redux/reducers'
import layoutConfig from '../component/page_layout/layout/redux/reducers'
import nav from '../component/page_layout/nav/redux/reducers'
import userAvatar from '../component/user/redux/reducers'
import doMessage from '../component/common/redux/reducers'

import login from '../views/login/redux/reducers'
import register from '../views/register/redux/reducers'
import userDetail from '../views/details/redux/reducers'
import forgot from '../views/forgot/redux/reducers'
import home from '../views/home/redux/reducers'



/*
  reducer:一个纯函数，用于状态管理
  根据老的状态产生新的状态，交给store来更新状态
* */

export default combineReducers({register,login,userDetail,forgot,crumbs,layoutConfig,nav,userAvatar,home,doMessage})