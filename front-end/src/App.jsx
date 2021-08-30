import './App.css';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import LandingPage from './components/landingPage/LandingPage';
import Auth from './components/auth/Auth';
import Main from './components/main/Main';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  const session = useSelector(state=> state.getSession);

  useEffect(() => { // prevent editing of localstrage
    window.addEventListener('storage', (e) => {
      if (e.key === 'userType') {
        localStorage.setItem('userType', e.oldValue);
      } else if (e.key ===  'token') {
        localStorage.setItem('token', e.oldValue);
      } else if (e.key === 'fname') {
        localStorage.setItem('fname', e.oldValue);
      } else if (e.key === 'lname') {
        localStorage.setItem('lname', e.oldValue);
      }
    }, false)
  }, []);

  if (session) {
    if (session.includes('member')) { // member panel
      return(
        <Router>
          <Switch>
            <Route component={Main} path='/' />
          </Switch>
        </Router>
      );
    } else if (session.includes('admin')) { // admin panel
      return(
        <Router>
          <Switch>
            <Route component={Dashboard} path='/' />
          </Switch>
        </Router>
      );
    }
  }

  return ( // default panel
    <Router>
      <Switch>
        <Route component={Auth} path='/i' />
        <Route component={LandingPage} path='/' />
      </Switch>
    </Router>
  );
}

export default App;