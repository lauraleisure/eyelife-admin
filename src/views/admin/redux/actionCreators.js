import {LOGIN_SUCCESS,RELOAD_PAGE} from './action-types'

import http from '../../../utils/http';

/*同步刷新页面*/
export const loginSuccess=(user)=>({type:LOGIN_SUCCESS,data:user});
export const reloadPage=(msg)=>({type:RELOAD_PAGE,data:msg});



/*异步：从后台获取数据*/
export const  doLogin=(user)=>{
    console.log('登陆方法....');
    /*   debugger*/
    return dispatch=>{
        // const result = await new http({
        const result = await new http({
            url: '/api/admin/login',
            params: {
                username:user.username,
                password:user.password,
            }
        });
        dispatch(loginSuccess(result));
        //模拟发送ajax请求异步获取数据
       /* axios.get('http://yapi.demo.qunar.com/mock/38353/app')
            .then((res) =>{
                const data = res.data;
                dispatch(loginSuccess(data));
                dispatch(action);
            })
            .catch(() =>{alert('err')})*/


       /* setTimeout(()=>{
            const init ={
                username:user.username,
                password:user.password,
                url:'/home',
                time:0.01,
            };
            //分发一个异步的action
            //根据登陆权限的判断，跳转到不同首页
            dispatch(loginSuccess(init));
        },1000)*/
    }
};
