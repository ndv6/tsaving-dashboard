import React from 'react';
import NavigationBar from '../components/NavigationBar';

import '../styles/Customers.css'; 


export default function Customers() {
    return(
        <div className="customers-constraint">
            <NavigationBar></NavigationBar>
            <div className="customers-content">
                Customers Content
            </div>
        </div>
    )
}