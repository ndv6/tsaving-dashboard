import React from 'react';
import { Input } from 'antd';

import '../styles/SearchBar.css'

const { Search } = Input;

export default function SearchBar(props) {
    return (
        <div className="wrapper">
        <Search onSearch={props.onSearch} placeholder="Enter Keyword Here. . ."/>
        </div>
    );
}