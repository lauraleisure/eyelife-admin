import React,{Component} from 'react'
import  Q from 'q';
import PropTypes from 'prop-types'
import {connect} from "react-redux";
import {NavLink} from 'react-router-dom'

import { message, Button } from 'antd';

class Login extends Component{
    state={
        loading:true,
        username:'',
        password:'',
    }
    static propTypes={
        isValid:PropTypes.bool,
    }

    componentDidMount(){
        var that=this;
        /*Q.all([

        ]).then(()=>{
            return that.setState({loading:false});
        });*/
    }
    doLogin(){

    }

    changeVal(evt){
        var obj={};
        obj[evt.target.id]=evt.target.value;
        this.setState(obj);
    }
    render(){
       return(<div>

       </div>)

    }
}

export default connect(state=>({username:state.login.username,password:state.login.password}),
    {})(Login)
