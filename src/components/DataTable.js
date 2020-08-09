import React from "react";
import { Table } from "antd";

export default function DataTable(props) {
  const {
    columns,
    data,
    loading,
    onChange,
    current,
    pagePosition,
    pageSize,
    totalData,
    onPageChange,
    x,
    y,
  } = props;
  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        size="middle"
        loading={loading}
        onChange={onChange}
        pagination={{
          current,
          showSizeChanger: false,
          position: pagePosition,
          pageSize,
          total: totalData,
          onChange: onPageChange,
        }}
        scroll={{ x, y }}
      />
    </div>
  );
}
