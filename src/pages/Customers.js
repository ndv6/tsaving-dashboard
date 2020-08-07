import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar'

import axios from 'axios'

import { Tag } from 'antd'

import {
    HomeOutlined,
    SettingFilled,
    SmileOutlined,
    SyncOutlined,
    LoadingOutlined,
  } from '@ant-design/icons';
  
import '../styles/Customers.css'; 



function searchCust(value){
    console.log(value);
}
const columns = [
    {
        title: 'Name',
        dataIndex: 'cust_name',
        key: 'cust_name'
    },
    {
        title: 'Acc Num',
        dataIndex: 'account_num',
        key: 'account_num'
    },
    {
        title: 'Email',
        dataIndex: 'cust_email',
        key: 'cust_email'
    },
    {
        title: 'Status',
        dataIndex: 'is_verified',
        key: 'is_verified',
        render: (text) => {

            if (text == 'Verified'){
                return <div onClick={test} className = "verified"> <HomeOutlined /> {text}</div>
            }
            else{
                return <div className = "not-verified">{text}</div>
            }
            
        }
    },
    {
        title: 'Amount',
        dataIndex: 'channel',
        key: 'channel'
    },
    {
        title: '',
        dataIndex: 'IsDeleted',
        key: 'IsDeleted'
    }

];
const dataSource = [
    {   
        key: '1',
        account_num : "8220912312",
        from_account : "main acc",
        dest_account : "882727282",
        tran_amount: "asdsad",
        description: "87.000",
        created_at: "19-10-2020 08:00"
    },        
];
function test(){
    console.log('asd');
}


export default function Customers() {
    function getCustomerList(setListCust,paramDate='',paramSearch=''){
        //catch untuk nge throw error. kalau success bakal ke then.
        axios({
            headers: {
            'Content-Type': "application/json",
            "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJkYXZpZCIsImV4cGlyZWQiOiIyMDIwLTA4LTA3VDE5OjQyOjQ0LjM5Mjc2NSswNzowMCJ9.n_cYlxYUyBA8JYEAPLaHPd-xXyixcDX9WDsAC5qRCWc",
            },
          method : "POST",
          url : "http://localhost:8000/v2/customers/list/1",
          data: {
            filter_date: paramDate,
            filter_search: paramSearch
          }
        }).then((res) => {
            //success
            let tableData = []
            console.log(res.data.data.list)
            res.data.data.list.map((value, index) => {
                let singleRow = {}
                const formatter = new Intl.NumberFormat('id', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 2
                })
                let field_verif = "";
                if(value.is_verified == true){
                    field_verif = "Verified";
                }
                else{field_verif = "Unverified"}
                // console()
                singleRow['key'] = index
                singleRow['cust_name'] = value.cust_name
                singleRow['account_num'] = value.account_num
                singleRow['cust_email'] = value.cust_email
                singleRow['is_verified'] =  field_verif //value.is_verified
                singleRow['channel'] = value.channel
                singleRow['IsDeleted'] = value.IsDeleted
                tableData.push(singleRow)
            })
            setListCust(tableData)
        }).catch((err) => {
          //failed
          console.log(err,'error')
        }).finally(() => {
          console.log("finally")
          // setLoading(false);
        })
    }
    function pageChange(page){
        console.log(page)
    }
    React.useEffect(() => {
        getCustomerList(setListCust)
      },[])

    const [listCust,setListCust] = useState([]);
    return(
        <div className="customers-constraint">
            <NavigationBar></NavigationBar>
            <div className="customers-content">
                <div className="cl-title"> List All Customers :</div>
                <div className = "filter-search">
                    <FilterBar />
                    <SearchBar 
                    className="search-content"
                    style ={{width:"500px"}}
                    onSearch={(value) => searchCust(value)} />

                </div>
                

                <div className="cl-table">
                    <DataTable 
                    columns={columns} 
                    data={listCust} 
                    size="middle"
                    onPageChange={(page) =>  pageChange(page)}
                    pagePosition="bottomRight"/>
                </div>
                
            </div>
        </div>
    )
}