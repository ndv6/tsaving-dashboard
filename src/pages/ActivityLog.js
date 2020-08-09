import React, {useState} from 'react';
import DataTable from '../components/DataTable'
import "../styles/ActivityLog.css"
import axios from 'axios';
import NavigationBar from "../components/NavigationBar"
import FilterBar from "../components/FilterBar"
import { Pagination,Space } from 'antd';


function filter(value){
  console.log(value)
}

function getActivityLog(setList,pageNumber){
    //catch untuk nge throw error. kalau success bakal ke then.
    
    console.log("tes")
    axios({
      method : "GET",
      url : "http://localhost:8000/v2/log/"+pageNumber+"",
      headers:{
        authorization: window.localStorage.getItem("token")
      }
    }).then((res) => {
      //success
      console.log(res.data)
      console.log(res.data.status,"data table")
      setList(res.data.data)
      console.log(res.data.data, 'success')
    }).catch((err) => {
      //failed
      console.log(err,'error')
    }).finally(() => {
      console.log("finally")
      // setLoading(false);
    })
  }



export default function ActivityLog(){
  const [list,setList] = useState([]);
  const [page,setPage] = useState(1);
  const [date,setDate] = useState("");

  const columns = [
    {
      title: 'No',
      key: 'name',
      render : (text, record, index) => index+page,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'age',
    },
    {
      title: 'Account Number',
      dataIndex: 'acc_num',
      key: 'address',
    },
    {
      title: 'Time',
      dataIndex: 'action_time',
      key: 'action_time',
      render :(text) => text
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'address',
    },

  ];


    function onChange(pageNumber) {
      console.log('Page: ', pageNumber);
      getActivityLog(setList,pageNumber)
      var index = (pageNumber - 1) * 20 + 1;
      setPage(index)
    }

    React.useEffect(() => {
      getActivityLog(setList,1)
    },[])

    return(
        <div className = "activity-log-constraint">
           <NavigationBar></NavigationBar>
           <div className = "activity-log-content">
              <h1>Activity Log</h1>
              <div className = "activity-log-filterbar">
                <span className = "filter-text">Filter by date : &ensp;</span> <FilterBar></FilterBar>
              </div>
              <div className = "table">

                  <DataTable 
                    columns={columns} 
                    data={list} 
                    pagePosition="bottomRight" 
                    pageSize={20} 
                    totalData={100} 
                    onPageChange={(page) => onChange(page)}
                    />

                  
                </div>
                
                
           </div>
        </div>
       
                 
    )
}
