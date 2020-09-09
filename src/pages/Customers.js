import React, { useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import "../styles/Customers.css";
import EditProfileModalContainer from "../components/EditProfileModalContainer";
import { notification } from "antd";
import { InfoCircleTwoTone } from "@ant-design/icons";
import { Popconfirm, message, Table } from "antd";
import * as Constants from "../constants/Constants";
import config from "../config/config.json";

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
import { useHistory } from "react-router";

export default function Customers() {
  const history = useHistory();
  const [listCust, setListCust] = useState([]);
  const [countData, setCountData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paramDate, setDate] = useState(null);
  const [paramSearch, setSearch] = useState("");
  const [paramPage, setPage] = useState(1);
  const [isModalVisible, setModalVisibility] = useState(false);
  const [isDeleted, setCustomerDeleted] = useState(false);
  const [accnum,setAccNum] = useState(0);
  const [customerDataToBeEdited, setDataToEdit] = useState({
    account_num: "",
    cust_name: "",
    cust_email: "",
    cust_phone: "",
    is_verified: false,
  });
  const token = window.localStorage.getItem("token");

  function clickDetailCustomer(rowData) {
    history.push("/admin/customer/" + rowData.cust_id);
  }

  async function clickMailCustomer(rowData, setLoading) {
    setLoading(true);
    let customerToken = await getTokenCustomer(rowData.cust_email).catch(err => {
      message.error("Error getting customer token")
    });

    let hasil = await insertLog(rowData.account_num,"RESEND");

    if(hasil){
      axios({
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        url: config.apiHostEmail +  "/sendMail",
        data: {
          email: rowData.cust_email,
          token: customerToken,
        },
      }).then((res) => {
          let args = {
            message: "Resend Email",
            description: "Email has been sent to the customer.",
            duration: 2,
            icon: <InfoCircleTwoTone style={{ color: "#108ee9" }} />,
          };
          notification.open(args);
        }).catch((err) => {
          if (!err.status) {
            let args = {
              message: "Resend Email",
              description: "Network Error.",
              duration: 2,
              icon: <InfoCircleTwoTone twoToneColor="red" />,
            };
            notification.error(args);
          } else if (err.response.status === 429) {
            let args = {
              message: "Resend Email",
              description:
                "Too many request. Please wait for 10 seconds before sending another email.",
              duration: 2,
              icon: <InfoCircleTwoTone twoToneColor="red" />,
            };
            notification.error(args);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }else{
      setLoading(false);
      let args = {
        message: "Failed to Insert Log",
        description: "Network Error.",
        duration: 2,
        icon: <InfoCircleTwoTone twoToneColor="red" />,
      };
      notification.error(args);
    }
  }

  function getTokenCustomer(customerEmail) {
    return new Promise(function (resolve, reject) {
      axios({
        headers: {
          "Content-Type": "application/json",
          Authorization: window.localStorage.getItem("token"),
        },
        method: "POST",
        url: config.apiHost+"/v2/get-token",
        data: {
          email: customerEmail,
        },
      })
        .then((res) => {
          resolve(res.data.data.token);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

function insertLog(account_num, action){
  return new Promise(function (resolve, reject) {
        axios({
            method : "POST",
            url : config.apiHost+"/v2/log/insert",
            data :{
                acc_num : account_num,
                action : action,
            },
            headers:{
              "Authorization": window.localStorage.getItem("token")
            }
          }).then((res) => {
            resolve(true)
          }).catch((err) => {
            reject(err);
          })
        })
}

  function clickDeleteCustomer(account_num, history, setDelete) {
    setDelete(true);
    axios({
      headers: {
        "Content-Type": "application/json",
        Authorization: window.localStorage.getItem("token"),
      },
      method: "POST",
      url: config.apiHost+"/v2/customers/delete",
      data: {
        account_num: account_num,
      },
    })
      .then((res) => {
        message.info(res.data.message);
        // setTimeout(function () {
          
        // }, 1500);
      })
      .catch((err) => {
        if(err.response === undefined){
            message.error("Network Error please try again later", 2);
          }
          else if (err.response.status === 401) {
            localStorage.removeItem("token");
            history.push("/admin/login");
          }
          else{
              message.error("Failed to Get Data, please try again later", 2);
          }
      })
      .finally(() => {
        setDelete(false);
      });
  }

  function getCustomerList(
    token,
    paramPage = 1,
    paramDate = "",
    paramSearch = "",
    setListCust,
    setCountData,
    setLoading
  ) {
    setLoading(true);
    setListCust([]);
    axios({
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      method: "POST",
      url: config.apiHost+"/v2/customers/list/" + paramPage,
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
          dataRow["cust_id"] = value.cust_id;
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
        setListCust([]);
        if (err.response === undefined) {
          message.error("Network Error please try again later", 2);
        } else if (err.response.status === 401) {
          localStorage.removeItem("token");
          history.push("/admin/login");
        } else {
          message.error("Failed to Get Data, please try again later", 2);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function clickEditCustomer(rowData) {
    /* rowData keeps user verification status as string, e.g "Verified", "Unverified"
        while EditCustomerData API processes user's verification status as boolean
          and the form displays the data using <Switch/> component that only allows boolean value.
       So here, if verification status is saved as a string, 
        we 'convert' it to boolean by checking if the string indicated user's status is "Verified".
       If the user clicked edit icon on that row, which means this function already ran in that row
        and the data is already 'converted' to boolean, we will not change it.
    */
    rowData = Object.assign(rowData, {
      is_verified:
        rowData.is_verified instanceof String ||
        typeof rowData.is_verified == "string"
          ? rowData.is_verified === Constants.VERIFIED
          : rowData.is_verified,
    });
    setDataToEdit(rowData);
    setModalVisibility(true);
    setAccNum(rowData.account_num)
  }

  function closeModal() {
    setModalVisibility(false);
  }

  function pageChange(page) {
    setPage(page);
  }

  function filterDate(date) {
    setPage(1);
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
    setPage(1);
    setSearch(value);
  }

  //checking status for error handling

  React.useEffect(() => {
    getCustomerList(
      token,
      paramPage,
      paramDate,
      paramSearch,
      setListCust,
      setCountData,
      setLoading
    );
    console.log("use effect triggered", isModalVisible)
  }, [token, setListCust, paramPage, paramDate, paramSearch, setModalVisibility, isModalVisible]);

  var isDisabled = true
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
      render: (text,record) => {
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
                twoToneColor={text.is_verified === "Verified" && "lightgrey"}
                onClick={() => text.is_verified === "Unverified" ? clickMailCustomer(text, setLoading) : sendAlert()}
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
                twoToneColor={text.is_verified === "Verified" && "lightgrey"}
                onClick={() => text.is_verified === "Unverified" ? clickMailCustomer(text, setLoading) : sendAlert()}
              />

              <Popconfirm
                placement="top"
                title="Are you sure?"
                onConfirm={() =>
                  clickDeleteCustomer(record.account_num, history, setCustomerDeleted)
                }
                okText="Yes"
                cancelText="No"
              >
                <DeleteTwoTone twoToneColor="red" className="cus-icon-action" />
              </Popconfirm>
            </div>
          );
        }
      },
    },
  ];

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
            onChange = {(event) => searchCust(event.target.value)}
          />
        </div>

        <p>Total Data : {countData}</p>
        <div className="cl-table">
          {/* <DataTable
            current={: paramPage}
            columns={columns}
            data={listCust}
            pagePosition="bottomRight"
            pageSize={20}
            totalData={countData}
            onPageChange={(page) => pageChange(page)}
            loading={loading}
          /> */}
          <Table
            columns={columns}
            dataSource={listCust}
            size="middle"
            loading={loading}
            onChange={() => {}}
            pagination={{
              current: paramPage,
              showSizeChanger: false,
              position: "bottomRight",
              pageSize: 20,
              total: countData,
              onChange: pageChange,
            }}
            // scroll={{ x, y }}
          />
          <EditProfileModalContainer
            setData={setDataToEdit}
            data={customerDataToBeEdited}
            onOk={closeModal}
            onCancel={closeModal}
            loading={loading}
            visible={isModalVisible}
            setLoading={setLoading}
            history={history}
          />
        </div>
      </div>
    </div>
  );
}

function sendAlert () {
  message.info("User is already verified", 1)
}
