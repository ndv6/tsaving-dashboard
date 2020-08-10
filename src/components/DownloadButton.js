import React from 'react';
import axios from "axios";
import { Button } from "antd";
import { CSVLink } from "react-csv";
import { DownloadOutlined } from "@ant-design/icons";
import FormatLogDescription from '../utils/Helper';
import { Loader } from "../pages/CustomerProfile";

function getDownloadButton(token, paramPage='', paramDate='', paramSearch, setList, setStatus) {
    setStatus(true)
    let url = "";
    let fixDate = "";
    if(paramDate != null){
        let dateFormat = paramDate.split("-");
        fixDate = dateFormat[0] + "-" + ('0'+dateFormat[1]).slice(-2) +"-" + ('0'+dateFormat[2]).slice(-2);
    }
    if(paramDate == null && paramSearch === ""){
        url = `http://localhost:8000/v2/transactions/list/${paramPage}`
    }
    else if(paramDate != null && paramSearch === ""){
        url = "http://localhost:8000/v2/transactions/list/d/"+ fixDate +"/" + paramPage;
    }
    else if(paramDate == null && paramSearch !== ""){
        url = "http://localhost:8000/v2/transactions/list/a/"+ paramSearch +"/" + paramPage;
    }
    else if(paramDate != null && paramSearch !== ""){
        url = "http://localhost:8000/v2/transactions/list/"+ paramSearch +"/" + fixDate + "/" + paramPage;
    }
    
    axios({
        headers: {
            'Content-Type': "application/json",
            "Authorization" : token,
        },
        method: "GET",
        url: url
    }).then((res) => {
        const tableData = (res.data.data.list || []).map((value, index) => {
            let singleRow = {};
            singleRow["No"] = index+1;
            singleRow["account_num"] = value.account_num;
            singleRow["from_account"] = value.from_account;
            singleRow["dest_account"] = value.dest_account;
            singleRow["tran_amount"] = FormatLogDescription(value.description);
            singleRow["date"] = new Date(value.created_at).toUTCString();
            return singleRow
        })
        setList(tableData)
        // setList(res.data.data.list)

    }).catch((err) => {

    }).finally(() => {
        setStatus(false);
    })
    .catch(() => {})
    .finally(() => {});
}


export default function DownloadButton(props) {
    const [list, setList] = React.useState([]);
    const [status, setStatus] = React.useState(false);
    
    
    const { size } = 'large';

    React.useEffect(() => {
        getDownloadButton(props.token, props.page, props.date, props.search , setList, setStatus)
    },[props.token, props.page, props.date, props.search]);

    if(status){
        return <Loader />;
    }

    return (
        <div>
            <Button type="primary" shape="round" icon={<DownloadOutlined />} size={size}>
                <CSVLink data={list} 
                style={{ textDecoration: "none", color: "white" }} >
                    &nbsp;Download
                </CSVLink>
            </Button>
        </div >
    )

}


