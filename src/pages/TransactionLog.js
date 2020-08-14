import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import DownloadButton from '../components/DownloadButton';
import { message } from 'antd';
import FormatLogDescription from '../utils/Helper';
import config from '../config/config.json';
import '../styles/TransactionLog.css';

import axios from 'axios';

const columns = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no',
  },
  {
    title: 'Account Number',
    dataIndex: 'account_num',
    key: 'account_num',
  },
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
    title: 'Amount',
    dataIndex: 'tran_amount',
    key: 'tran_amount',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Date',
    dataIndex: 'created_at',
    key: 'created_at',
  },
];

function getTransactionLog(
  token,
  paramPage = 1,
  paramDate = '',
  paramSearch = '',
  setListTL,
  setCountData,
  setLoading,
  history,
) {
  setLoading(true);
  let fixDate = '';
  if (paramDate != null) {
    let dateFormat = paramDate.split('-');
    fixDate =
      dateFormat[0] +
      '-' +
      ('0' + dateFormat[1]).slice(-2) +
      '-' +
      ('0' + dateFormat[2]).slice(-2);
  }
  let url = '';
  if (paramDate == null && paramSearch === '') {
    url = config.apiHost + '/v2/transactions/list/' + paramPage;
  } else if (paramDate != null && paramSearch === '') {
    url =
      config.apiHost + '/v2/transactions/list/d/' + fixDate + '/' + paramPage;
  } else if (paramDate == null && paramSearch !== '') {
    url =
      config.apiHost +
      '/v2/transactions/list/a/' +
      paramSearch +
      '/' +
      paramPage;
  } else if (paramDate != null && paramSearch !== '') {
    url =
      config.apiHost +
      '/v2/transactions/list/' +
      paramSearch +
      '/' +
      fixDate +
      '/' +
      paramPage;
  }
  axios({
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    method: 'GET',
    url: url,
  })
    .then((res) => {
      const tableData = (res.data.data.list || []).map((value, index) => {
        let singleRow = {};
        const formatter = new Intl.NumberFormat('id', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 2,
        });
        singleRow['key'] = index;
        singleRow['no'] = (paramPage - 1) * 20 + (index + 1);
        singleRow['account_num'] = value.account_num;
        singleRow['from_account'] = value.from_account;
        singleRow['dest_account'] = value.dest_account;
        singleRow['tran_amount'] = formatter.format(value.tran_amount);
        singleRow['description'] = FormatLogDescription(value.description);
        singleRow['created_at'] = new Date(value.created_at).toUTCString();
        return singleRow;
      });
      setCountData(res.data.data.count);
      setListTL(tableData);
    })
    .catch((err) => {
      if (err.response === undefined) {
        message.error('Network Error please try again later', 2);
      } else if (err.response.status === 401) {
        localStorage.removeItem('token');
        history.push('/admin/login');
      } else {
        message.error('Failed to Get Data, please try again later', 2);
      }
    })
    .finally(() => {
      setLoading(false);
    });
}

export default function TransactionLog() {
  const [listTL, setListTL] = useState([]);
  const [countData, setCountData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paramDate, setDate] = useState(null);
  const [paramSearch, setSearch] = useState('');
  const [paramPage, setPage] = useState(1);
  const history = useHistory();
  const token = window.localStorage.getItem('token');

  if (!window.localStorage.getItem('token')) {
    history.push('/admin/login');
  }

  function pageChange(page) {
    setPage(page);
  }
  function filterDate(date) {
    setPage(1);
    if (date !== null) {
      let day = date.date().toString();
      let month = (date.month() + 1).toString();
      let year = date.year().toString();
      let fixdate = year + '-' + month + '-' + day;
      setDate(fixdate);
    } else {
      setDate(null);
    }
  }
  function searchTL(value) {
    setPage(1);
    setSearch(value);
  }
  function onChangeSearch(keyword) {
    setPage(1);
    setSearch(keyword);
  }
  

  useEffect(() => {
    getTransactionLog(
      token,
      paramPage,
      paramDate,
      paramSearch,
      setListTL,
      setCountData,
      setLoading,
      history,
    );
  }, [token, setListTL, paramPage, paramDate, paramSearch, history]);

  return (
    <div className="transaction-log-constraint">
      <NavigationBar></NavigationBar>
      <div className="transaction-log-content">
        <div className="tl-title">Transaction List :</div>
        <div className="filter-search">
          <FilterBar onChange={(date) => filterDate(date)} />
          <SearchBar
            className="search-content"
            onChange={(event) => onChangeSearch(event.target.value)}
            onSearch={(value) => searchTL(value)}
          />
        </div>
        <p>Total Data : {countData}</p>
        <DownloadButton
          token={token}
          page={paramPage}
          date={paramDate}
          search={paramSearch}
        />

        <div className="table-tl-list">
          <DataTable
            current={paramPage}
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
