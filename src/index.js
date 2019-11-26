import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux'
import {BrowserRouter,Switch,Route,Redirect} from 'react-router-dom';

import store from './redux/store';

import Main from './views/admin/main'
import Login from './views/admin/login'

ReactDOM.render(<Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path='/main' exact component={Main}/>
                <Route path='/login' exact component={Login}/>

                <Redirect to='/login'/>
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'));

