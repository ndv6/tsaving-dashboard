import React from 'react';
import NavigationBar from '../components/NavigationBar';
import config from '../config/config.json'

import '../styles/Dashboard.css'; 
import ComponentCard from '../components/Card';
import Axios from 'axios';
import { DASHBOARD_ENDPOINT } from '../constants/ApiEndpoints';
import { Pie } from "ant-design-pro/lib/Charts"
import { Card, Divider } from 'antd';

function getDashboardData(setData, setState){
    Axios({
        method: "GET",
        url: config.apiHost + DASHBOARD_ENDPOINT
    }).then(function(res){
      //Success
      setData(res.data)
      userComponentUI(res.data.data.dashboard_user)
      console.log("success")
    })
    .catch(function(err){
      //Error
      console.log(err, "error");
    })
    .finally(function(){
      setState(false);
    });
}

function userComponentUI(dashboardUserData) {
    var total = 0
    var pieData = []
    if (dashboardUserData ) {
        total = dashboardUserData.active_user + dashboardUserData.inact_user
        pieData = 
        [
            {
                x: "Active User",
                y: dashboardUserData.active_user
            },
            {
                x: "Inactive User",
                y: dashboardUserData.inact_user
            }
        ];
    }
    return <Pie
        hasLegend
        total={[
            <Divider></Divider>,
            <h3>Total Users {total}</h3>
        ]}
        animate={true}
        valueFormat={val => <span dangerouslySetInnerHTML={{ __html: " - " + val + " users" } } />}
        data={pieData}
        height={225}
    />   
}

export default function Dashboard() {
    const [state, setState] = React.useState({
        loading: true
    })
    const [data, setData] = React.useState({})

    React.useEffect(function () {
        console.log("get dashboard data")
        getDashboardData(setData, setState)
    }, [])

    return(
        <div className="dashboard-constraint">
            <NavigationBar></NavigationBar>
            <div className="dashboard-content">
                <div className="dashboard-content-user">
                    <Card 
                    title={<h1>Number of users</h1>}
                    size={"small"}
                    loading={state}>{userComponentUI(state ? null : data.data.dashboard_user)} </Card>
                </div>
            </div>
        </div>
    )
}