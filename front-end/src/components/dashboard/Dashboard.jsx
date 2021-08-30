import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SideBar from './sideBar/SideBar';
import Nav from './nav/Nav';
import Main from './main/Main';

const Dashboard = () => {
    
    return (
        <Router>
            <Nav />
            <SideBar />
            <Main />
        </Router>
    );
}

export default Dashboard;