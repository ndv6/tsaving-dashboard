import React from 'react';
import NavigationBar from '../components/NavigationBar';

import '../styles/ActivityLog.css'; 


export default function ActivityLog() {
    return(
        <div className="activity-log-constraint">
            <div className="activity-log-navbar">
                <NavigationBar></NavigationBar>
            </div>
            <div className="activity-log-content">
            ActivityLog Content
            </div>
        </div>
    )
}