import React from "react";
import { Table } from "antd";

export default function DataTable(props) {
  return (
    <div>
      <Table
        columns={props.columns}
        dataSource={props.data}
        size="middle"
        loading={props.loading}
        onChange={props.onChange}
        pagination={{
          current: props.current,
          showSizeChanger: false,
          position: props.pagePosition,
          pageSize: props.pageSize,
          total: props.totalData,
          onChange: props.onPageChange,
        }}
        scroll={{ x: props.x, y: props.y }}
      />
    </div>
  );
}
