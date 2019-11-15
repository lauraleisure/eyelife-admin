import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux'
import {BrowserRouter,Switch,Route,Redirect} from 'react-router-dom';

import store from './redux/store';
import Login from "./views/login/login";
import Register from "./views/register/register";
import UserDetail from './views/details/user-detail'
import Forget from "./views/forgot/forgot";
import Agreement from "./views/agreements/agreement";
import Home from "./views/home/home";

ReactDOM.render(<Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path='/register' exact component={Register}/>
                <Route path='/login' exact component={Login}/>
                <Route path='/forget' exact component={Forget}/>
                <Route path='/my' exact component={UserDetail}/>
                <Route path='/agreement' exact component={Agreement}/>
                <Route path='/home' exact component={Home}/>
                <Redirect to='/login'/>
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'));

