import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar'

import axios from 'axios'

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
        key: 'is_verified'
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



export default function Customers() {
    function getCustomerList(setListCust,paramDate='',paramSearch=''){
        //catch untuk nge throw error. kalau success bakal ke then.
        console.log("tes")
        axios({
            headers: {
            'Content-Type': "application/json",
            "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJkYXZpZCIsImV4cGlyZWQiOiIyMDIwLTA4LTA3VDE3OjM2OjUwLjk3NTI0MyswNzowMCJ9.Wm1RjZbPyYoYwGfgZJF4Jz35zQeQZ6SYYyaMUAeZMdo",
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
            res.data.data.list.map((value, index) => {
                let singleRow = {}
                const formatter = new Intl.NumberFormat('id', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 2
                })
                singleRow['key'] = index
                singleRow['cust_name'] = value.cust_name
                singleRow['account_num'] = value.account_num
                singleRow['cust_email'] = value.cust_email
                singleRow['is_verified'] = value.is_verified
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
                <FilterBar />
                <SearchBar 
                    onSearch={(value) => searchCust(value)} />


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