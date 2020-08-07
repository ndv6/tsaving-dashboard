import React from 'react';
import { Input } from 'antd';

import '../styles/SearchBar.css'

const { Search } = Input;

export default function SearchBar(props) {
    return (
        <div className="wrapper">
        <Search className="searchbar-style" onSearch={props.onSearch} placeholder="Enter Keyword Here. . ." enterButton />
        </div>
    );
}