import React from 'react'
import DataTable from '../components/DataTable'
import '../styles/CustomerTransactionLog.css'
import FilterBar from '../components/FilterBar'
import SearchBar from '../components/SearchBar'
import { Row, Col } from 'antd';
import axios from 'axios'
import { useHistory } from 'react-router-dom'

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

function GetTransaction(accNum, page, day, month, year, search, setList, setCountData, setLoading) {
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
      "Authorization" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJhZG1pbiIsImV4cGlyZWQiOiIyMDIwLTA4LTA3VDE5OjU4OjEwLjgxMzgwMyswNzowMCJ9.aHdQS5-sXPzCpqPoprE2UvyBY19cNS_H1X8D3djazFY",
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

  React.useEffect(() => {
    GetTransaction(props.accNum, page, null, null, null, search, setList, setCountData, setLoading)
  }, [setList, setLoading])

  function pageChange(page) {
    setPage(page)
    if (date === null) {
      GetTransaction(props.accNum, page, null, null, null, search, setList, setCountData, setLoading)
    } else {
      GetTransaction(props.accNum, page, date.date().toString(), (date.month() + 1).toString(), date.year().toString(), search, setList, setCountData, setLoading)
    }
  }

  function filterDate(date) {
    if (date !== null) {
      let day = date.date().toString()
      let month = (date.month() + 1).toString()
      let year = date.year().toString()
      setDate(date)
      GetTransaction(props.accNum, page, day, month, year, search, setList, setCountData, setLoading)
    }
  }

  function filterSearch(keyword) {
    if (keyword !== "") {
      setSearch(keyword)
      if (date === null) {
        GetTransaction(props.accNum, page, null, null, null, keyword, setList, setCountData, setLoading)
      } else {
        GetTransaction(props.accNum, page, date.date().toString(), (date.month() + 1).toString(), date.year().toString(), keyword, setList, setCountData, setLoading)
      }
    }
  }

  return (
    <div className="customerTransaction">
      <div style={{ marginBottom : '6vh'}}>
        <h1>Transaction History</h1>
      </div>
      <div style={{ marginBottom : '5vh'}}>
        <Row>
          <Col span={6}>
            <FilterBar onChange={(date) => filterDate(date)}/>
          </Col>
          <Col span={18}>
            <SearchBar onSearch={(value) => filterSearch(value)}/>
          </Col>
        </Row>
      </div>
      <div>
        <p>Total Data : {countData}</p>
      </div>
      <div className="dataTable">
        <DataTable 
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