import React, {useState} from 'react';
import DataTable from '../components/DataTable'
import "../styles/ActivityLog.css"
import axios from 'axios';
import NavigationBar from "../components/NavigationBar"
import FilterBar from "../components/FilterBar"
import { Input } from 'antd';

const { Search } = Input;

function getActivityLog(token, setList,pageNumber,setTotaldata,date,username){
    //catch untuk nge throw error. kalau success bakal ke then.
    let url ="";
    let modifDate = "";
    if(date != null){
       let dateFormat = date.split("-");
       modifDate = dateFormat[0] + "-" + ('0'+dateFormat[1]).slice(-2) +"-" + ('0'+dateFormat[2]).slice(-2);
    }
    
    if(date == null && username == null){
      url = "http://localhost:8000/v2/log/"+pageNumber
    }else if(date != null && username == null){
      url = "http://localhost:8000/v2/log/d/"+modifDate+"/"+pageNumber;
    }else if(date == null && username != null){
      url = "http://localhost:8000/v2/log/u/"+username+"/"+pageNumber;
    }else if(date != null && username != null){
      url = "http://localhost:8000/v2/log/"+username+"/"+modifDate +"/" + pageNumber;
    }

    axios({
      headers:{
        'Content-Type': "application/json",
        "Authorization" : token,
      },
      method : "GET",
      url : url,
      
    }).then((res) => {
      //success
      const tableData = (res.data.data.list || []).map((value, index) => {
        let singleRow = {};

        singleRow["key"] = index;
        singleRow["no"] = ((pageNumber-1)*20) + (index + 1) ;
        singleRow["username"] = value.username;
        singleRow["acc_num"] = value.acc_num;
        singleRow["action_time"] = new Date(value.action_time).toUTCString()
        singleRow["action"] = value.action;
        return singleRow
      })
      setList(tableData)
      setTotaldata(res.data.data.count)
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
  const [totalData,setTotaldata] = useState(0);
  const [date,setDate] = useState(null);
  const [search,setSearch] = useState(null);
  const token = window.localStorage.getItem("token")

    const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',

    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Account Number',
      dataIndex: 'acc_num',
      key: 'acc_num',
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
      key: 'action',
      render : (text) => {
        if(text.toUpperCase() == "EDIT"){
          return (<div className = "edit-label">{text}</div>)
        }else if(text.toUpperCase() == "DELETE"){
          return  (<div className = "delete-label">{text}</div>)
        }else if(text.toUpperCase() == "RESEND"){
          return  (<div className = "resend-label">{text}</div>)
        }
        return
      }
    },

  ];


  function dateChange(date){
    if (date != null) {
      let day = date.date().toString();
      let month = (date.month() + 1).toString();
      let year = date.year().toString();
      let fixdate = year + "-" + month + "-" + day;
      setDate(fixdate);
    }
    else{
        setDate(null);
    }
  }

  function onChange(pageNumber) {
    console.log(pageNumber)
    setPage(pageNumber)
  }

  React.useEffect(() => {
    getActivityLog(token, setList,page,setTotaldata,date,search)
  },[setList,date,page,search])

    return(
        <div className = "activity-log-constraint">
           <NavigationBar/>
           <div className = "activity-log-content">
              <h1>Activity Log</h1>
              <div className = "activity-log-filterbar">
                <span className = "filter-text"></span> 
                <FilterBar onChange = {(date) => dateChange(date)}/> &ensp;
                <Search
                  placeholder="username"
                  onSearch={value => setSearch(value)}
                  style={{ width: 200 }}/>
              </div>
              <div className = "table">
                  <DataTable 
                    current={page}
                    columns={columns} 
                    data={list} 
                    pagePosition="bottomRight" 
                    pageSize={20} 
                    totalData={totalData} 
                    onPageChange={(page) => onChange(page)}/>
                </div>
            </div>
        </div>   
    )
}
