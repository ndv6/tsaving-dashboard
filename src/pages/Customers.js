import React, { useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import "../styles/Customers.css";
import EditProfileModalContainer from "../components/EditProfileModalContainer";

import axios from "axios";

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeTwoTone,
  EditOutlined,
  DeleteTwoTone,
  LockTwoTone,
  MailTwoTone,
} from "@ant-design/icons";
import { message } from "antd";

export default function Customers() {
  const [listCust, setListCust] = useState([]);
  const [countData, setCountData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paramDate, setDate] = useState(null);
  const [paramSearch, setSearch] = useState("");
  const [paramPage, setPage] = useState(1);
  const [isModalVisible, setModalVisibility] = useState(false);
  const [customerDataToBeEdited, setDataToEdit] = useState({
    account_num: "",
    cust_name: "",
    cust_email: "",
    cust_phone: "",
    is_verified: false,
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "cust_name",
      key: "cust_name",
    },
    {
      title: "Acc Num",
      dataIndex: "account_num",
      key: "account_num",
    },
    {
      title: "Email",
      dataIndex: "cust_email",
      key: "cust_email",
    },
    {
      title: "Verified",
      dataIndex: "is_verified",
      key: "is_verified",
      render: (text) => {
        if (text === "Verified") {
          return <CheckCircleOutlined className="cus-icon verified" />;
        } else {
          return <CloseCircleOutlined className="cus-icon warn " />;
        }
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "is_deleted",
      key: "is_deleted",
      render: (text) => {
        if (text) {
          return <LockTwoTone twoToneColor="red" className="cus-icon warn" />;
        } else {
          return <CheckCircleOutlined className="cus-icon verified" />;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text) => {
        if (text.is_deleted) {
          return (
            <div className="field-action">
              <EyeTwoTone
                className="cus-icon"
                onClick={() => clickDetailCustomer(text)}
              />

              <EditOutlined
                className="cus-icon-action edit"
                onClick={() => clickEditCustomer(text)}
              />

              <MailTwoTone
                className="cus-icon-action"
                onClick={() => clickMailCustomer(text)}
              />
            </div>
          );
        } else {
          return (
            <div className="field-action">
              <EyeTwoTone
                className="cus-icon"
                onClick={() => clickDetailCustomer(text)}
              />

              <EditOutlined
                className="cus-icon-action edit"
                onClick={() => clickEditCustomer(text)}
              />

              <MailTwoTone
                className="cus-icon-action"
                onClick={() => clickMailCustomer(text)}
              />

              <DeleteTwoTone
                twoToneColor="red"
                className="cus-icon-action"
                onClick={() => clickDeleteCustomer(text)}
              />
            </div>
          );
        }
      },
    },
  ];

  function clickDetailCustomer(rowData) {
    console.log(rowData, "detail here");
  }

  function clickEditCustomer(rowData) {
    setModalVisibility(true);
    setDataToEdit(...rowData, {
      is_verified: rowData._is_verified === "Verified",
    });
  }

  function closeModal() {
    setModalVisibility(false);
  }

  function clickMailCustomer(rowData) {
    console.log(rowData, "sendmail here");
  }

  function clickDeleteCustomer(account_num, history) {
    setLoading(true);
    axios({
      headers: {
        "Content-Type": "application/json",
        Authorization: window.localStorage.getItem("token"),
      },
      method: "POST",
      url: "http://localhost:8000/v2/customers/delete",
      data: {
        account_num: account_num,
      },
    })
      .then((res) => {
        message.info(res.data.message);
        setTimeout(function () {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          localStorage.removeItem("token");
          history.push("/admin/login");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function getCustomerList(
    paramPage = 1,
    paramDate = "",
    paramSearch = "",
    setListCust,
    setCountData,
    setLoading
  ) {
    setLoading(true);
    axios({
      headers: {
        "Content-Type": "application/json",
        Authorization: window.localStorage.getItem("token"),
      },
      method: "POST",
      url: "http://localhost:8000/v2/customers/list/" + paramPage,
      data: {
        filter_date: paramDate,
        filter_search: paramSearch,
      },
    })
      .then((res) => {
        setCountData(res.data.data.total);
        const tableData = (res.data.data.list || []).map((value, index) => {
          let singleRow = {};
          let field_verif = "";
          if (value.is_verified === true) {
            field_verif = "Verified";
          } else {
            field_verif = "Unverified";
          }
          let created = value.created_at.split("T");

          //checkdeleted
          let deletedraw = value.is_deleted.split("T");
          let deletedfix = true;
          if (deletedraw[0] === "1970-01-01") {
            deletedfix = false;
          }
          singleRow["key"] = index;
          singleRow["cust_name"] = value.cust_name;
          singleRow["account_num"] = value.account_num;
          singleRow["cust_email"] = value.cust_email;
          singleRow["is_verified"] = field_verif; //value.is_verified
          singleRow["date"] = created[0];
          singleRow["is_deleted"] = deletedfix;
          //prepare data param for action delete edit / detail just in case if needed u can add more(optional)
          let dataRow = {};
          dataRow["cust_name"] = value.cust_name;
          dataRow["account_num"] = value.account_num;
          dataRow["cust_email"] = value.cust_email;
          dataRow["is_verified"] = field_verif;
          dataRow["cust_phone"] = value.cust_phone;
          dataRow["is_deleted"] = deletedfix;

          singleRow["action"] = dataRow;
          return singleRow;
        });
        setListCust(tableData);
      })
      .catch((err) => {
        console.log(JSON.stringify(err), "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function pageChange(page) {
    setPage(page);
  }
  function filterDate(date) {
    if (date !== null) {
      let day = date.date().toString();
      let month = (date.month() + 1).toString();
      let year = date.year().toString();
      let fixdate = year + "-" + month + "-" + day;
      setDate(fixdate);
    } else {
      setDate("");
    }
  }
  function searchCust(value) {
    setSearch(value);
  }

  React.useEffect(() => {
    getCustomerList(
      paramPage,
      paramDate,
      paramSearch,
      setListCust,
      setCountData,
      setLoading
    );
  }, [setListCust, paramPage, paramDate, paramSearch]);

  return (
    <div className="customers-constraint">
      <NavigationBar></NavigationBar>
      <div className="customers-content">
        <div className="cl-title"> List All Customers </div>
        <div className="filter-search">
          <FilterBar onChange={(date) => filterDate(date)} />
          <SearchBar
            className="search-content"
            onSearch={(value) => searchCust(value)}
          />
        </div>

        <p>Total Data : {countData}</p>
        <div className="cl-table">
          <DataTable
            columns={columns}
            data={listCust}
            pagePosition="bottomRight"
            pageSize={20}
            totalData={countData}
            onPageChange={(page) => pageChange(page)}
            loading={loading}
          />
          <EditProfileModalContainer
            data={customerDataToBeEdited}
            onOk={closeModal}
            onCancel={closeModal}
            loading={loading}
            visible={isModalVisible}
          />
        </div>
      </div>
    </div>
  );
}
