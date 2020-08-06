import React from 'react';
import NavigationBar from '../components/NavigationBar';

import '../styles/TransactionLog.css'; 


export default function TransactionLog() {
    return(
        <div className="transaction-log-constraint">
            <div className="transaction-log-navbar">
                <NavigationBar></NavigationBar>
            </div>
            <div className="transaction-log-content">
            TransactionLog Content
            </div>
        </div>
    )
}