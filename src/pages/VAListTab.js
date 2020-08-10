import React, { useState, useEffect } from 'react';
import { Row, Col, Select } from 'antd';
import axios from 'axios';
import DataTable from '../components/DataTable';
import { Loader, Reloader, reqBuilder, logOut } from './CustomerProfile';
import config from '../config/config.json';
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

const { Option } = Select;

export default function VAList({ custId }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [reload, setReload] = useState(false);
  const [color, setColor] = useState('');

  function onChange(page) {
    setFetching(true);
    setPage(page);
  }

  function onColorChange(value) {
    setFetching(true);
    setColor(value);
  }

  function ColorFilter() {
    return (
      <Select
        defaultValue={color}
        style={{ width: 140 }}
        onChange={(value) => onColorChange(value)}
      >
        <Option value="">Select Color</Option>
        <Option value="Blue">Blue</Option>
        <Option value="Red">Red</Option>
        <Option value="Purple">Purple</Option>
        <Option value="Yellow">Yellow</Option>
        <Option value="Green">Green</Option>
        <Option value="Orange">Orange</Option>
      </Select>
    );
  }

  useEffect(() => {
    if (fetching) {
      let url = '';
      if (color === '') {
        url = `${config.apiHost}/v2/va/${custId}/${page}`;
      } else {
        url = `${config.apiHost}/v2/va/${custId}/${color}/${page}`;
      }
      axios(reqBuilder('get', url))
        .then(function (response) {
          if (response.data.status === 'SUCCESS') {
            formatData(response.data.data.data);
            setTotal(response.data.data.total);
          }
        })
        .catch(function (err) {
          if (err.response.status === 401) {
            logOut();
          } else {
            setReload(true);
          }
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [fetching, custId, page, color]);

  function formatData(source) {
    const formatter = new Intl.NumberFormat('id', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
    });
    const dataTable =
      source &&
      source.map((item) => {
        return {
          key: item.va_num,
          num: item.va_num,
          label: item.va_label,
          color: item.va_color,
          balance: formatter.format(item.va_balance),
        };
      });
    setData(dataTable);
  }

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
          <p>Filter by color</p>
          <ColorFilter />
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
            onPageChange={onChange}
            pageSize={20}
            columns={columns}
            data={data}
            pagePosition="bottomRight"
            current={page}
            totalData={total}
          />
        </Col>
        <Col span={2} />
      </Row>
    </div>
  );
}
