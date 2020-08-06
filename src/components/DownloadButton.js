import React, {useState} from "react";
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons'
import { CSVLink } from "react-csv";
import axios from "axios";


function getDownloadButton(setList) {
    axios({
        method: "GET",
        url: "http://localhost:8000/admin/transactions"
    }).then((res) => {
        //success
        setList(res.data.data)
        console.log(res.data.data, 'success')

    }).catch((err) => {
        //failed
        console.log(err, 'error')
    }).finally(() => {
    })
}

export default function DownloadButton() {
    const { size } = 'large';

    React.useEffect(() => {
        getDownloadButton(setList);
    }, [])

    const [list, setList] = useState([]);

    return (
        <div>
            <Button type="primary" shape="round" icon={<DownloadOutlined />} size={size}>
                <CSVLink data={list} style={{ textDecoration: "none", color: "white" }} >
                    &nbsp;Download
                </CSVLink>
            </Button>
        </div >
    )

}

