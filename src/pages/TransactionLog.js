import React, {useState} from 'react';

import DataTable from '../components/DataTable'
import '../styles/TransactionLog.css'

export default function TransactionLog() {
    const [collapse, setCollapse] = useState(false);
 
    function onToogle(){
        setCollapse(!collapse);
    };
    //prepare column

    const columns = [
        {
            title: 'Acc Number',
            dataIndex: 'accnum'
        },
        {
            title: 'From',
            dataIndex: 'from'
        },
        {
            title: 'To',
            dataIndex: 'to'
        },
        {
            title: 'Desc',
            dataIndex: 'from'
        },
        {
            title: 'Amount',
            dataIndex: 'amount'
        },
        {
            title: 'Date',
            dataIndex: 'date'
        }

    ];
    const dataSource = [
        {   
            key: '1',
            accnum : "8220912312",
            from : "main acc",
            to : "882727282",
            from: "asdsad",
            amount: "87.000",
            date: "19-10-2020 08:00"
            
        },
        // {
        //     key: '2',
        //     accnum : "8220912312",
        //     from : "va acc"
        // },
        // {
        //     key: '3',
        //     accnum : "8220912312",
        //     from : "va acc"
        // },
        // {
        //     key: '4',
        //     accnum : "8220912312",
        //     from : "va acc"
        // },
        // {
        //     key: '5',
        //     accnum : "8220912312",
        //     from : "va acc"
        // },
        
    ]
    
    
    // const loading = "<div>Loading ... </div>";


    return (    
        <div className="content-table-tl">
            <div className="tl-title">Transaction List :</div>
            <button>filter</button>
            <div className="table-tl-list">
                <DataTable columns={columns} data={dataSource} pagePosition="bottomRight"/>
            </div>   
        </div>
    );
  }
