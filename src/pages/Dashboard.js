import React from 'react';
import NavigationBar from '../components/NavigationBar';
import config from '../config/config.json'

import '../styles/Dashboard.css'; 
import ComponentCard from '../components/Card';
import Axios from 'axios';
import { DASHBOARD_ENDPOINT } from '../constants/ApiEndpoints';

function getDashboardData(setList, setLoading){
    Axios({
        headers: {
            "Content-Type": "null",
            "Accept": "application/json",
            "Access-Control-Allow-Origin" : "*"
        },
        method: "GET",
        url: "http://localhost:8000/v2/dashboard"
    }).then(function(res){
      //Success
      setList(res.data)
      console.log(res.data,'success');
    })
    .catch(function(err){
      //Error
      console.log(err,'error');
    })
    .finally(function(){
      setLoading(false);
    });
  }

export default function Dashboard() {
    const [state, setState] = React.useState({
        loading: true
    })
    const [data, setData] = React.useState({})

    React.useEffect(function () {
        getDashboardData(setData, setState)
        console.log(data)
    }, [])

    return(
        <div className="dashboard-constraint">
            <NavigationBar></NavigationBar>
            <div className="dashboard-content">
                <div className="dashboard-content-user">
                    <ComponentCard 
                    className={"card-dashboard-act-user"} 
                    title={"Users"} 
                    isSmall={false} 
                    isLoading={state.loading} 
                    isBordered={true}
                    hover_effect={true}
                    cover={""}
                    extra={""}/>
                </div>
            </div>
        </div>
    )
}