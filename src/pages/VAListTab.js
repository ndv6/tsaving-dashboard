import React, { useState, useEffect } from 'react';
import { Row, Col, DatePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';
import DataTable from '../components/DataTable';
import { Loader, Reloader, reqBuilder } from './CustomerProfile';
import '../styles/CustomerProfile.css';

const columns = [
  {
    title: 'VA Number',
    dataIndex: 'num',
    key: 'num',
  },
  {
    title: 'Label',
    dataIndex: 'label',
    key: 'label',
  },
  {
    title: 'Color',
    dataIndex: 'color',
    key: 'color',
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
  },
];

export default function VAList({ custId }) {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [reload, setReload] = useState(false);

  function onDatePickerChange(date) {
    const newData = data.filter((item) =>
      moment(item.created_at.substring(0, 10)).isSame(date, 'date'),
    );
    setFiltered(newData);
  }

  function onChange(page) {
    setPage(page);
  }

  useEffect(() => {
    if (fetching) {
      axios(reqBuilder('get', `http://localhost:8000/v2/va/${custId}/${page}`))
        .then((response) => {
          if (response.data.status === 'SUCCESS') {
            setData(response.data.data.data);
            setFiltered(response.data.data.data);
          }
        })
        .catch(() => {
          setReload(true);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [fetching, custId, page]);

  useEffect(() => {
    const source = filtered.map((item) => {
      return {
        key: item.va_num,
        num: item.va_num,
        label: item.va_label,
        color: item.va_color,
        balance: item.va_balance,
      };
    });
    setDataTable(source);
  }, [filtered]);

  if (fetching) {
    return <Loader />;
  }

  if (!fetching && reload) {
    return <Reloader reload={() => setFetching(true)} />;
  }

  return (
    <div className="top-space">
      <Row>
        <Col span={2} />
        <Col span={20}>
          <p>Filter by date</p>
          <DatePicker onChange={onDatePickerChange} />
          <br />
          <br />
          <br />
        </Col>
        <Col span={2} />
      </Row>
      <Row>
        <Col span={2} />
        <Col span={20}>
          <DataTable
            columns={columns}
            data={dataTable}
            pagePosition="bottomRight"
          />
        </Col>
        <Col span={2} />
      </Row>
    </div>
  );
}
