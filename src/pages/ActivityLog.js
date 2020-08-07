import React, {useState} from 'react';
import DataTable from '../components/DataTable'
import "../styles/ActivityLog.css"
import axios from 'axios';
import NavigationBar from "../components/NavigationBar"
import FilterBar from "../components/FilterBar"


function getActivityLog(setList){
    //catch untuk nge throw error. kalau success bakal ke then.
    console.log("tes")
    axios({
      method : "GET",
      url : "http://localhost:8000/v2/log/1",
      headers:{
        authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImV4cGlyZWQiOiIyMDIwLTA4LTA3VDE1OjM2OjAzLjQ4NTAxNiswNzowMCJ9.UvM_vkPr9tib--hC1BP3zAWiamqArl_wTHw0_b-fL1Q'
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
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_logadmin',
      key: 'name',
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
      key: 'address',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'address',
    },
    // {
    //   title: '',
    //   key: 'aksi',
    //   render: (text, record) => (
    //     <Space size="middle">
    //       <a><i className = "fa fa-eye"></i></a>
    //       <a><i className = "fa fa-pencil-square-o"></i></a>
    //       <a><i className = "fa fa-trash"></i></a>
    //       <a><i className = "fa fa-envelope-o"></i></a>
    //     </Space>
    //   ),
    // },
  ];

  const dataTable = [
    {
      key: '1',
      name: 'test',
      age: '2',
      address: 'tesssss'
    },
    {
      key: '2',
      name: 'test',
      age: '2',
      address: 'tesssss'
    },

  ]


    const [list,setList] = useState([]);

    React.useEffect(() => {
      getActivityLog(setList)
    },[])

    return(
        <div className = "activity-log-constraint">
           <NavigationBar></NavigationBar>
           <div className = "activity-log-content">
              <h1>Activity Log</h1>
              <FilterBar></FilterBar>
              <div className = "table">
              <DataTable 
                  columns={columns}
                  data={list}
                  size="middle"
                  pagePosition = {"bottomRight"}
                  x = "10px"
                />
              </div>
                
           </div>
        </div>
       
                 
    )
}
