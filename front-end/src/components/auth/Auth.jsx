import './Auth.css';
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom';
import LogIn from './login/LogIn';
import SignUp from './signup/SignUp';
import ForgotPsw from './forgotPsw/ForgotPsw';

const Auth = () => {
    let { path } = useRouteMatch();

    return (
        <Router>
            <main className='auth-main'>
                <Switch>
                    <Route component={SignUp} path={`${path}/signup`} />
                    <Route component={ForgotPsw} path={`${path}/forgot-password`} />
                    <Route component={LogIn} path={`${path}/login`} />
                </Switch>
            </main>
        </Router>
    );
}

export default Auth;