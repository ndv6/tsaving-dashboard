import React, { useState } from 'react';
import { DatePicker, Space } from 'antd';
import moment from 'moment';

export default function FilterBar(props) {
  const { onChange } = props;
  const [startDate, setStartDate] = useState(moment());
  const [dataFilter, setDataFilter] = useState([]);
  const [list] = useState([]);

  function onChangeDate(date) {
    setStartDate(date);
    const newData = list.filter((item) =>
      moment(item.created_at.substring(0, 10)).isSame(date, 'date'),
    );
    setDataFilter(newData);
  }

  return (
    <div>
      <Space direction="vertical" size={12}>
        <DatePicker onChange={onChange} />
      </Space>
    </div>
  );
}
