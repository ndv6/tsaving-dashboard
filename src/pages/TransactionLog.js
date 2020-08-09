import React, {useState} from 'react';
import { useHistory } from "react-router-dom";

import NavigationBar from '../components/NavigationBar';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';

import '../styles/TransactionLog.css';

import axios from 'axios';

const columns = [
    {
        title: 'Acc Number',
        dataIndex: 'account_num',
        key : 'account_num'
    },
    {
        title: 'From',
        dataIndex: 'from_account',
        key : 'from_account'
    },
    {
        title: 'To',
        dataIndex: 'dest_account',
        key : 'dest_account'
    },
    {
        title: 'Amount',
        dataIndex: 'tran_amount',
        key : 'tran_amount'
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key : 'description'
    },
    {
        title: 'Date',
        dataIndex: 'created_at',
        key: 'created_at'
    }
];


function getTransactionLog(paramPage=1, paramDate='', paramSearch='', setListTL, setCountData, setLoading, history){
    setLoading(true);
    axios({
        headers: {
            'Content-Type': "application/json",
            "Authorization" : window.localStorage.getItem("token"),
        },
        method : "GET",
        url : "http://localhost:8000/v2/transactions/list/" + paramPage
    }).then((res) => {
        const tableData = (res.data.data.list || []).map((value, index) => {
            let singleRow = {};
            const formatter = new Intl.NumberFormat('id', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 2
            });

            singleRow['key'] = index;
            singleRow['account_num'] = value.account_num;
            singleRow['from_account'] = value.from_account;
            singleRow['dest_account'] = value.dest_account;
            singleRow['tran_amount'] =  formatter.format(value.tran_amount);
            singleRow['description'] = value.description;
            singleRow['created_at'] = new Date(value.created_at).toUTCString();
            return singleRow;
        })
        setCountData(res.data.data.count);
        setListTL(tableData);
    }).catch((err) => {
        if (err.response.status === 401) {
            localStorage.removeItem("token");
            history.push("/admin/login")
        }
    }).finally(() => {
        setLoading(false);
    })
}

export default function TransactionLog() {
    const [listTL,setListTL] = useState([]);
    const [countData, setCountData] = useState(0);
    const [loading, setLoading] = useState(false);
    const [paramDate, setDate] = useState(null);
    const [paramSearch, setSearch] = useState("");
    const [paramPage, setPage] = useState(1);
    const history = useHistory();

    function pageChange(page){
        setPage(page);
    }
    function filterDate(date) {
        if (date !== null) {
          let day = date.date().toString();
          let month = (date.month() + 1).toString();
          let year = date.year().toString();
          let fixdate = year + "-" + month + "-" + day;
          setDate(fixdate);
        }
        else{
            setDate("");
        }
    }
    function searchTL(value){
        setSearch(value);
    }

    React.useEffect(() => {
        getTransactionLog(paramPage, paramDate, paramSearch,setListTL, setCountData, setLoading, history )
      },[setListTL, paramPage, paramDate, paramSearch, history]);

    return ( 
        <div className="transaction-log-constraint">
            <NavigationBar></NavigationBar>
            <div className="transaction-log-content">
                <div className="tl-title">Transaction List :</div>
                <div className = "filter-search">
                    <FilterBar  onChange={(date) => filterDate(date)} />
                    <SearchBar 
                    className="search-content"
                    onSearch={(value) => searchTL(value)} />

                </div>


                <div className="table-tl-list">
                    <DataTable 
                    columns={columns} 
                    data={listTL} 
                    pagePosition="bottomRight" 
                    pageSize={20} 
                    totalData={countData} 
                    onPageChange={(page) => pageChange(page)}
                    loading={loading}
                    />
                </div>  
            </div>
        </div>

        
    );
  }
