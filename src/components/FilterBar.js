import React, { useState } from "react";
import { DatePicker, Space } from "antd";
import moment from "moment";

export default function FilterBar(props) {
  const [startDate, setStartDate] = useState(moment());
  const [dataFilter, setDataFilter] = useState([]);

  function onChange(date) {
    setStartDate(date);
    const newData = list.filter((item) =>
      moment(item.created_at.substring(0, 10)).isSame(date, "date")
    );
    setDataFilter(newData);
  }

  const [list] = useState([]);

  return (
    <div>
      <Space direction="vertical" size={12}>
        <DatePicker onChange={props.onChange} />
      </Space>
    </div>
  );
}
