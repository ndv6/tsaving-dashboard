import React from 'react';
import { Input } from 'antd';

import '../styles/SearchBar.css';

const { Search } = Input;

export default function SearchBar(props) {
  const { onSearch, onChange } = props;
  return (
    <div className="wrapper">
      <Search onChange={onChange} onSearch={onSearch} placeholder="Enter Keyword Here. . ." />
    </div>
  );
}