import React from "react";
import Axios from "axios";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";

function getDownloadButton(setList) {
  Axios({
    method: "GET",
    url: "http://localhost:8000/v2/transactions",
  })
    .then((res) => {
      setList(res.data.data);
    })
    .catch((err) => {})
    .finally(() => {});
}

export default function DownloadButton() {
  const { size } = "large";

  React.useEffect(() => {
    getDownloadButton(setList);
  }, []);

  const [list, setList] = React.useState([]);

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
