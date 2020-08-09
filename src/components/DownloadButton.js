import React from "react";
import axios from "axios";
import { Button } from "antd";
import { CSVLink } from "react-csv";
import { DownloadOutlined } from "@ant-design/icons";

function getDownloadButton(setList) {
  axios({
    method: "GET",
    url: "http://localhost:8000/v2/transactions",
  })
    .then((res) => {
      setList(res.data.data);
    })
    .catch(() => {})
    .finally(() => {});
}

export default function DownloadButton() {
  const [list, setList] = React.useState([]);
  const { size } = "large";

  React.useEffect(() => {
    getDownloadButton(setList);
  }, []);

  return (
    <div>
      <Button
        type="primary"
        shape="round"
        icon={<DownloadOutlined />}
        size={size}
      >
        <CSVLink data={list} style={{ textDecoration: "none", color: "white" }}>
          &nbsp;Download
        </CSVLink>
      </Button>
    </div>
  );
}
