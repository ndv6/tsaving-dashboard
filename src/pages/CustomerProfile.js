import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Row, Col, Typography, Spin, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import Tab from "../components/Tab";
import NavigationBar from "../components/NavigationBar";
import ProfilePlaceholder from "../static/profile_placeholder.svg";
import VAListTab from "./VAListTab";
import ProfileTab from "./ProfileTab";
import CustomerTransactionLog from "./CustomerTransactionLog";
import "../styles/CustomerProfile.css";

const { Title, Text } = Typography;

const DEFAULT_PROFILE = {
  isLoading: true,
  isError: false,
  name: "",
  email: "",
  accNum: "",
  address: "",
  phone: "",
};

export function reqBuilder(method, url) {
  const token = window.localStorage.getItem("token");
  return {
    method,
    url,
    headers: { Authorization: token },
  };
}

export default function CustomerProfile() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    axios(reqBuilder("get", `http://localhost:8000/v2/customers/${id}`))
      .then(function (response) {
        console.log(response);
        if (response.data.status === "SUCCESS") {
          setProfileData({
            isError: false,
            isLoading: false,
            name: response.data.data.cust_name,
            email: response.data.data.cust_email,
            accNum: response.data.data.account_num,
            address: response.data.data.cust_address,
            phone: response.data.data.cust_phone,
          });
        }
      })
      .catch(function (error) {
        setProfileData({
          ...DEFAULT_PROFILE,
          isLoading: false,
          isError: true,
        });
      });
  }, [id]);

  return (
    <div className="customer-profile-constraint">
      <NavigationBar></NavigationBar>
      <div className="customer-profile-content">
        <div>
          <Row justify="center" align="middle">
            <Col flex={1}>
              <div className="blue-bg bg-height" />
              <div className="bg-height" />
            </Col>
            <div className="picture-container">
              <img
                className="picture"
                alt="Profile Placeholder"
                src={ProfilePlaceholder}
              ></img>
              <Title level={3}>{profileData.name}</Title>
            </div>
          </Row>
          <Row>
            <Col flex={1}>
              <Tab
                tabs={[
                  {
                    tabname: "Profile",
                    components: (
                      <ProfileTab custId={id} profileData={profileData} />
                    ),
                  },
                  {
                    tabname: "Virtual Accounts",
                    components: <VAListTab custId={1} />,
                  },
                  {
                    tabname: "Transaction History",
                    components: <CustomerTransactionLog accNum={profileData.accNum} />,
                  },
                ]}
                size={3}
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export function Loader() {
  return (
    <div className="top-space">
      <Row justify="center">
        <Col>
          <Spin size="large" />
        </Col>
      </Row>
    </div>
  );
}

export function Reloader({ reload }) {
  return (
    <div className="top-space">
      <Row gutter={[0, 16]} justify="center">
        <Col>
          <Text>Network error</Text>
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          <Button
            onClick={() => reload()}
            shape="circle"
            icon={<ReloadOutlined />}
          />
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          <Text>Retry</Text>
        </Col>
      </Row>
    </div>
  );
}
