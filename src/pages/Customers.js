import React from 'react';
import NavigationBar from '../components/NavigationBar';

import '../styles/Customers.css'; 


export default function Customers() {
    return(
        <div className="customers-constraint">
            <div className="customers-navbar">
                <NavigationBar></NavigationBar>
            </div>
            <div className="customers-content">
                Customers Content
            </div>
        </div>
    )
}