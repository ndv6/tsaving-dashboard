import React from 'react';
import NavigationBar from '../components/NavigationBar';

import '../styles/TransactionLog.css'; 


export default function TransactionLog() {
    return(
        <div className="transaction-log-constraint">
            <NavigationBar></NavigationBar>
            <div className="transaction-log-content">
                TransactionLog Content
            </div>
        </div>
    )
}