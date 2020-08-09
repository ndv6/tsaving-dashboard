import React from "react";
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

export function reqBuilder(method, url) {
  const token = window.localStorage.getItem("token");
  return {
    method,
    url,
    headers: { Authorization: token },
  };
}

export default function CustomerProfile() {
  return (
    <div className="customers-constraint">
      <NavigationBar></NavigationBar>
      <div className="customers-content">
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
              <Title level={3}>Andreas</Title>
            </div>
          </Row>
          <Row>
            <Col flex={1}>
              <Tab
                tabs={[
                  { tabname: "Profile", components: <ProfileTab /> },
                  {
                    tabname: "Virtual Accounts",
                    components: <VAListTab custId={1} />,
                  },
                  {
                    tabname: "Transaction History",
                    components: <CustomerTransactionLog />,
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
