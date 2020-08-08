import React from 'react'
import DataTable from '../components/DataTable'
import '../styles/CustomerTransactionLog.css'
import FilterBar from '../components/FilterBar'
import SearchBar from '../components/SearchBar'
import { Row, Col } from 'antd';
import axios from 'axios'
import { Redirect } from "react-router-dom";

const columns = [
  {
    title: 'From',
    dataIndex: 'from_account',
    key: 'from_account',
  },
  {
    title: 'To',
    dataIndex: 'dest_account',
    key: 'dest_account',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Amount',
    dataIndex: 'tran_amount',
    key: 'tran_amount',
  },
  {
    title: 'Date',
    dataIndex: 'created_at',
    key: 'created_at',
  },
];

function GetTransaction(token, accNum, page, day, month, year, search, setList, setCountData, setLoading) {
  accNum = 2007236310
  let url = ""
  if ((day == null) && (month == null) && (year == null) && (search === "")) {
    url = 'http://localhost:8000/v2/transactions/' + accNum + "/" + page
  } else if ((search !== "") && (day == null) && (month == null) && (year == null)) {
    url  = 'http://localhost:8000/v2/transactions/' + accNum + "/" + search + "/" + page
  } else if ((search !== "") && (day !== null) && (month !== null) && (year !== null)) {
    url  = 'http://localhost:8000/v2/transactions/' + accNum + "/" + day + "-" + month + "-" + year + "/" + search + "/" + page
  } else if ((search === "") && (day !== null) && (month !== null) && (year !== null)) {
    url  = 'http://localhost:8000/v2/transactions/' + accNum + "/" + day + "-" + month + "-" + year + "/" + page
  }

  setLoading(true)
  axios({
    headers: {
      'Content-Type': "application/json",
      "Authorization" : token,
    },
    method: 'GET',
    url: url,
  })
    .then((res) => {
      const tableList = (res.data.data.list || []).map((value, index) => {
        let singleData = {}
        const formatter = new Intl.NumberFormat('id', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 2
        })

        singleData['key'] = index
        singleData['from_account'] = value.from_account
        singleData['dest_account'] = value.dest_account
        singleData['description'] = value.description
        singleData['tran_amount'] = formatter.format(value.tran_amount)
        singleData['created_at'] = new Date(value.created_at).toUTCString()
        return singleData
      })

      setCountData(res.data.data.count)
      setList(tableList);
    })
    .catch((err) => {
      console.log(JSON.stringify(err), 'error');
    })
    .finally(() => {
      setLoading(false);
    });
}

export default function CustomerTransactionLog(props) {
  const [list, setList] = React.useState(null)
  const [countData, setCountData] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [date, setDate] = React.useState(null)
  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const token = window.localStorage.getItem("token")

  React.useEffect(() => {
    GetTransaction(token, props.accNum, page, null, null, null, search, setList, setCountData, setLoading)
  }, [setList, setLoading])

  function pageChange(page) {
    setPage(page)
    if (date === null) {
      GetTransaction(token, props.accNum, page, null, null, null, search, setList, setCountData, setLoading)
    } else {
      GetTransaction(token, props.accNum, page, date.date().toString(), (date.month() + 1).toString(), date.year().toString(), search, setList, setCountData, setLoading)
    }
  }

  if (!window.localStorage.getItem("token")) {
    return <Redirect to="/admin/login" />;
  }

  function filterDate(date) {
    setPage(1)
    if (date !== null) {
      let day = date.date().toString()
      let month = (date.month() + 1).toString()
      let year = date.year().toString()
      setDate(date)
      GetTransaction(token, props.accNum, page, day, month, year, search, setList, setCountData, setLoading)
    } else {
      setDate(null)
      GetTransaction(token, props.accNum, page, null, null, null, search, setList, setCountData, setLoading)
    }
  }

  function filterSearch(keyword) {
    setPage(1)
    if (keyword !== "") {
      setSearch(keyword)
      if (date === null) {
        GetTransaction(token, props.accNum, page, null, null, null, keyword, setList, setCountData, setLoading)
      } else {
        GetTransaction(token, props.accNum, page, date.date().toString(), (date.month() + 1).toString(), date.year().toString(), keyword, setList, setCountData, setLoading)
      }
    } else {
      setSearch("")
      if (date === null) {
        GetTransaction(token, props.accNum, page, null, null, null, keyword, setList, setCountData, setLoading)
      } else {
        GetTransaction(token, props.accNum, page, date.date().toString(), (date.month() + 1).toString(), date.year().toString(), keyword, setList, setCountData, setLoading)
      }
    }
  }

  return (
    <div className="customerTransaction">
      <div style={{ marginBottom : '6vh'}}>
        <h1>Transaction History</h1>
      </div>
      <div style={{ marginBottom : '5vh'}}>
        <div className = "filter-search">
          <FilterBar onChange={(date) => filterDate(date)}/>
          <SearchBar onSearch={(value) => filterSearch(value)} className="search-content"/>
        </div>
      </div>
      <div>
        <p>Total Data : {countData}</p>
      </div>
      <div className="dataTable">
        <DataTable 
          current={page}
          columns={columns} 
          data={list} 
          pagePosition="bottomRight" 
          pageSize={20} 
          totalData={countData} 
          onPageChange={(page) => pageChange(page)}
          loading={loading}/>
      </div>
    </div>
  )
}