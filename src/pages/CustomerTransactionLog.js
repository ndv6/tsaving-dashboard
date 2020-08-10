import React from 'react';
import DataTable from '../components/DataTable';
import '../styles/CustomerTransactionLog.css';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import FormatLogDescription from '../utils/Helper';
import { message } from 'antd';
import config from '../config/config.json';
import { Loader, Reloader } from './CustomerProfile';

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

function GetTransaction(
  token,
  accNum,
  page,
  day,
  month,
  year,
  search,
  setList,
  setCountData,
  setLoading,
  setStatus,
) {
  let url = '';
  if (day == null && month == null && year == null && search === '') {
    url = config.apiHost + '/v2/transactions/' + accNum + '/' + page;
  } else if (search !== '' && day == null && month == null && year == null) {
    url =
      config.apiHost + '/v2/transactions/' + accNum + '/' + search + '/' + page;
  } else if (search !== '' && day !== null && month !== null && year !== null) {
    url =
      config.apiHost +
      '/v2/transactions/' +
      accNum +
      '/' +
      day +
      '-' +
      month +
      '-' +
      year +
      '/' +
      search +
      '/' +
      page;
  } else if (search === '' && day !== null && month !== null && year !== null) {
    url =
      config.apiHost +
      '/v2/transactions/' +
      accNum +
      '/' +
      day +
      '-' +
      month +
      '-' +
      year +
      '/' +
      page;
  }

  setLoading(true);
  axios({
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    method: 'GET',
    url,
  })
    .then((res) => {
      const tableList = (res.data.data.list || []).map((value, index) => {
        const singleData = {};
        const formatter = new Intl.NumberFormat('id', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 2,
        });

        singleData.key = index;
        singleData.from_account = value.from_account;
        singleData.dest_account = value.dest_account;
        singleData.description = FormatLogDescription(value.description);
        singleData.tran_amount = formatter.format(value.tran_amount);
        singleData.created_at = new Date(value.created_at).toUTCString();
        return singleData;
      });

      setCountData(res.data.data.count);
      setList(tableList);
    })
    .catch((err) => {
      if (!err.status) {
        setStatus(0);
      } else if (err.response.status === 401) {
        setStatus(401);
      } else if (err.response.status === 400) {
        setStatus(400);
      } else if (err.response.status === 404) {
        setStatus(404);
      }
    })
    .finally(() => {
      setLoading(false);
    });
}

export default function CustomerTransactionLog(props) {
  const [list, setList] = React.useState(null);
  const [countData, setCountData] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [date, setDate] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [reload, setReload] = React.useState(false);
  const token = window.localStorage.getItem('token');

  React.useEffect(() => {
    GetTransaction(
      token,
      props.accNum,
      page,
      null,
      null,
      null,
      search,
      setList,
      setCountData,
      setLoading,
      setStatus,
    );
  }, [setList, setLoading, setStatus]);

  function pageChange(page) {
    setPage(page);
    if (date === null) {
      GetTransaction(
        token,
        props.accNum,
        page,
        null,
        null,
        null,
        search,
        setList,
        setCountData,
        setLoading,
        setStatus,
      );
    } else {
      GetTransaction(
        token,
        props.accNum,
        page,
        date.date().toString(),
        (date.month() + 1).toString(),
        date.year().toString(),
        search,
        setList,
        setCountData,
        setLoading,
        setStatus,
      );
    }
  }

  if (!window.localStorage.getItem('token')) {
    return <Redirect to="/admin/login" />;
  }

  function filterDate(date) {
    setPage(1);
    if (date !== null) {
      const day = date.date().toString();
      const month = (date.month() + 1).toString();
      const year = date.year().toString();
      setDate(date);
      GetTransaction(
        token,
        props.accNum,
        page,
        day,
        month,
        year,
        search,
        setList,
        setCountData,
        setLoading,
        setStatus,
      );
    } else {
      setDate(null);
      GetTransaction(
        token,
        props.accNum,
        page,
        null,
        null,
        null,
        search,
        setList,
        setCountData,
        setLoading,
        setStatus,
      );
    }
  }

  function filterSearch(keyword) {
    setPage(1);
    if (keyword !== '') {
      setSearch(keyword);
      if (date === null) {
        GetTransaction(
          token,
          props.accNum,
          page,
          null,
          null,
          null,
          keyword,
          setList,
          setCountData,
          setLoading,
          setStatus,
        );
      } else {
        GetTransaction(
          token,
          props.accNum,
          page,
          date.date().toString(),
          (date.month() + 1).toString(),
          date.year().toString(),
          keyword,
          setList,
          setCountData,
          setLoading,
          setStatus,
        );
      }
    } else {
      setSearch('');
      if (date === null) {
        GetTransaction(
          token,
          props.accNum,
          page,
          null,
          null,
          null,
          keyword,
          setList,
          setCountData,
          setLoading,
          setStatus,
        );
      } else {
        GetTransaction(
          token,
          props.accNum,
          page,
          date.date().toString(),
          (date.month() + 1).toString(),
          date.year().toString(),
          keyword,
          setList,
          setCountData,
          setLoading,
          setStatus,
        );
      }
    }
  }

  if (status === 401) {
    message.error('Your session is over, please login again', 1.5);
    window.localStorage.removeItem('token');
    return <Redirect to="/admin/login" />;
  }

  if (status === 400) {
    message.error('Failed to fetch data, please reload', 1.5, setReload(true));
  }

  if (status === 404) {
    return <Redirect to="/notfound" />;
  }

  if (status === 0) {
    return (
      <Reloader
        reload={() =>
          GetTransaction(
            token,
            props.accNum,
            page,
            null,
            null,
            null,
            search,
            setList,
            setCountData,
            setLoading,
            setStatus,
          )
        }
      />
    );
  }

  if (reload) {
    return (
      <Reloader
        reload={() =>
          GetTransaction(
            token,
            props.accNum,
            page,
            null,
            null,
            null,
            search,
            setList,
            setCountData,
            setLoading,
            setStatus,
          )
        }
      />
    );
  }

  return (
    <div className="customerTransaction">
      <div style={{ marginBottom: '6vh' }}>
        <h1>Transaction History</h1>
      </div>
      <div style={{ marginBottom: '5vh' }}>
        <div className="filter-search">
          <FilterBar onChange={(date) => filterDate(date)} />
          <SearchBar
            onSearch={(value) => filterSearch(value)}
            className="search-content"
          />
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
          loading={loading}
        />
      </div>
    </div>
  );
}
