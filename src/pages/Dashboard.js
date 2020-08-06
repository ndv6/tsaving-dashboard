import React from 'react';
import NavigationBar from '../components/NavigationBar';

import '../styles/Dashboard.css'; 


export default function Dashboard() {
    return(
        <div className="dashboard-constraint">
            <div className="dashboard-navbar">
                <NavigationBar></NavigationBar>
            </div>
            <div className="dashboard-content">
                Dashboard Content
            </div>
        </div>
    )
}