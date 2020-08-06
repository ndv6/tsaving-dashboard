import React from 'react';
import { Table } from 'antd';

export default function DataTable(props) {
  return (
    <div>
      <Table
        columns={props.columns}
        dataSource={props.data}
        size="middle"
        // loading={props.loading}
        // onChange={props.onChange}s
        pagination={{ position: [props.pagePosition] }}
        // scroll={{ x: props.x, y: props.y }}
      />
    </div>
  );
}
