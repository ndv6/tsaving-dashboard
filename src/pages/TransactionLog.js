import React, {useState} from 'react';

import NavigationBar from '../components/NavigationBar'
import DataTable from '../components/DataTable'
import '../styles/TransactionLog.css'

import axios from 'axios';
import { Table } from 'antd';

function getTransactionLog(setListTL){
    //catch untuk nge throw error. kalau success bakal ke then.
    console.log("tes")
    axios({
      method : "GET",
      url : "http://localhost:8000/admin/transactions"
    }).then((res) => {
      //success
      console.log(res.data)
    //   console.log(res.data.status,"data table")
    setListTL(res.data.data)
    }).catch((err) => {
      //failed
      console.log(err,'error')
    }).finally(() => {
      console.log("finally")
      // setLoading(false);
    })
  }
export default function TransactionLog() {
    const [listTL,setListTL] = useState([]);
    const [countData, setCountData] = useState(0);
    const [loading, setLoading] = useState(false);
    const [paramDate, setDate] = useState(null);
    const [paramSearch, setSearch] = useState("");
    const [paramPage, setPage] = useState(1);

    //prepare column
    const columns = [
        {
            title: 'id',
            dataIndex: 'tl_id',
            key: 'id'
        },
        {
            title: 'Acc Number',
            dataIndex: 'account_num',
            key: 'accnum'
        },
        {
            title: 'From',
            dataIndex: 'from_account',
            key: 'from'
        },
        {
            title: 'To',
            dataIndex: 'dest_account',
            key: 'to'
        },
        {
            title: 'Desc',
            dataIndex: 'tran_amount',
            key: 'desc'
        },
        {
            title: 'Amount',
            dataIndex: 'description',
            key: 'amount'
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'date'
        }

    ];

    React.useEffect(() => {
        getTransactionLog(setListTL)
        console.log(listTL);
      },[setListTL])

    return ( 
        // <div className="content-table-tl">
        //     <div className="tl-title">Transaction List :</div>
        //     <button>filter</button>
        //     <div className="table-tl-list">
        //         <DataTable 
        //         columns={columns} 
        //         data={listTL} 
        //         size="middle"
        //         pagePosition="bottomRight"/>
        //     </div>   
        // </div>   
        
        <div className="transaction-log-constraint">
            <NavigationBar></NavigationBar>
            <div className="transaction-log-content">
                <div className="tl-title">Transaction List :</div>
                <button>filter</button>
                <div className="table-tl-list">
                    <Table 
                    columns={columns} 
                    data={listTL} 
                    size="middle"
                    pagePosition="bottomRight"/>
                </div>  
            </div>
        </div>

        
    );
  }
