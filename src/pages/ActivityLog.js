import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import '../styles/ActivityLog.css';
import axios from 'axios';
import NavigationBar from '../components/NavigationBar';
import FilterBar from '../components/FilterBar';
import config from '../config/config.json';
import { Input, message } from 'antd';
import { useHistory } from 'react-router-dom';

const { Search } = Input;

function getActivityLog(
  token,
  setList,
  pageNumber,
  setTotaldata,
  date,
  search,
  history,
) {
  //catch untuk nge throw error. kalau success bakal ke then.
  let url = '';
  let modifDate = '';
  if (date != null) {
    let dateFormat = date.split('-');
    modifDate =
      dateFormat[0] +
      '-' +
      ('0' + dateFormat[1]).slice(-2) +
      '-' +
      ('0' + dateFormat[2]).slice(-2);
  }

  if (date == null && search == '') {
    url = config.apiHost + '/v2/log/' + pageNumber;
  } else if (date != null && search == '') {
    url = config.apiHost + '/v2/log/d/' + modifDate + '/' + pageNumber;
  } else if (date == null && search != '') {
    url = config.apiHost + '/v2/log/u/' + search + '/' + pageNumber;
  } else if (date != null && search != '') {
    url =
      config.apiHost + '/v2/log/' + search + '/' + modifDate + '/' + pageNumber;
  }

  if (date == null && search == null) {
    url = config.apiHost + '/v2/log/' + pageNumber;
  } else if (date != null && search == null) {
    url = config.apiHost + '/v2/log/d/' + modifDate + '/' + pageNumber;
  } else if (date == null && search != null) {
    url = config.apiHost + '/v2/log/u/' + search + '/' + pageNumber;
  } else if (date != null && search != null) {
    url =
      config.apiHost + '/v2/log/' + search + '/' + modifDate + '/' + pageNumber;
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
      //success
      const tableData = (res.data.data.list || []).map((value, index) => {
        let singleRow = {};

        singleRow['key'] = index;
        singleRow['no'] = (pageNumber - 1) * 20 + (index + 1);
        singleRow['username'] = value.username;
        singleRow['acc_num'] = value.acc_num;
        singleRow['action_time'] = new Date(value.action_time).toUTCString();
        singleRow['action'] = value.action;
        return singleRow;
      });
      setList(tableData);
      setTotaldata(res.data.data.count);
    })
    .catch((err) => {
      //failed
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
      // setLoading(false);
    });
}

export default function ActivityLog() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalData, setTotaldata] = useState(0);
  const [date, setDate] = useState(null);
  const [search, setSearch] = useState('');
  const token = window.localStorage.getItem('token');
  const history = useHistory();

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
      render: (text) => text,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text) => {
        if (text.toUpperCase() == 'EDIT') {
          return <div className="edit-label">{text}</div>;
        } else if (text.toUpperCase() == 'DELETE') {
          return <div className="delete-label">{text}</div>;
        } else if (text.toUpperCase() == 'RESEND') {
          return <div className="resend-label">{text}</div>;
        }
        return;
      },
    },
  ];

  function dateChange(date) {
    if (date != null) {
      let day = date.date().toString();
      let month = (date.month() + 1).toString();
      let year = date.year().toString();
      let fixdate = year + '-' + month + '-' + day;
      setDate(fixdate);
    } else {
      setDate(null);
    }
  }

  function onChange(pageNumber) {
    setPage(pageNumber);
  }

  React.useEffect(() => {
    getActivityLog(token, setList, page, setTotaldata, date, search, history);
  }, [setList, date, page, search]);

  return (
    <div className="activity-log-constraint">
      <NavigationBar />
      <div className="activity-log-content">
        <h1>Activity Log</h1>
        <div className="activity-log-filterbar">
          <FilterBar onChange={(date) => dateChange(date)} /> &ensp;
          <Search
            placeholder="search"
            onSearch={(value) => setSearch(value)}
            style={{ width: 200 }}
          />
        </div>
        <p>Total Data : {totalData}</p>
        <div className="table">
          <DataTable
            current={page}
            columns={columns}
            data={list}
            pagePosition="bottomRight"
            pageSize={20}
            totalData={totalData}
            onPageChange={(page) => onChange(page)}
          />
        </div>
      </div>
    </div>
  );
}
