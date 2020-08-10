import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Typography, Divider } from "antd";
import {
  UserOutlined,
  MailOutlined,
  HomeOutlined,
  PhoneOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { Loader, Reloader, reqBuilder, logOut } from "./CustomerProfile";
import DebitCard from "../components/DebitCard";
import "../styles/CustomerProfile.css";

const { Title, Text } = Typography;

const DEFAULT_CARD = {
  cardNum: "",
  validThru: "",
  name: "",
};

export default function ProfileTab({ profileData }) {
  const [cardData, setCardData] = useState(DEFAULT_CARD);
  const [fetching, setFetching] = useState(true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (!profileData.isLoading) {
      axios(
        reqBuilder(
          "get",
          `http://localhost:8000/v2/customers/cards/${profileData.accNum}`
        )
      )
        .then(function (response) {
          if (response.data.status === "SUCCESS") {
            let validYear = response.data.data.expired.substring(2, 4);
            let validMonth = response.data.data.expired.substring(5, 7);
            setCardData({
              cardNum: response.data.data.card_num,
              validThru: `${validMonth}/${validYear}`,
              name: "",
            });
            setReload(false);
          }
        })
        .catch(function (error) {
          if (error.response.status === 401) {
            logOut();
          } else {
            setReload(true);
          }
        })
        .finally(function () {
          setFetching(false);
        });
    }
  }, [profileData.accNum, profileData.isLoading]);

  if (fetching || profileData.isLoading) {
    return <Loader />;
  }

  if (
    (!fetching && reload) ||
    (!profileData.isLoading && profileData.isError)
  ) {
    return <Reloader reload={() => setFetching(true)} />;
  }

  return (
    <div className="top-space">
      <Row>
        <Col span={3}></Col>
        <Col span={9}>
          <ProfileDetail {...profileData} />
        </Col>
        <Col span={9}>
          <DebitCard {...cardData} />
        </Col>
        <Col span={4}></Col>
      </Row>
    </div>
  );
}

function ProfileDetail(props) {
  const generalInfo = [
    { label: "Name", value: props.name, icon: <UserOutlined /> },
    { label: "Account Number", value: props.accNum, icon: <BankOutlined /> },
    { label: "Address", value: props.address, icon: <HomeOutlined /> },
  ];
  const contactInfo = [
    { label: "Email", value: props.email, icon: <MailOutlined /> },
    { label: "Phone", value: props.phone, icon: <PhoneOutlined /> },
  ];
  function ItemRow(props) {
    return (
      <Row gutter={[8, 8]}>
        <Col span={1}>{props.icon}</Col>
        <Col span={8}>
          <Text>{props.label}</Text>
        </Col>
        <Col span={1}>
          <Text>:</Text>
        </Col>
        <Col span={14}>
          <Text strong>{props.value}</Text>
        </Col>
      </Row>
    );
  }
  return (
    <Row>
      <Col flex={1}>
        <div className="top-space">
          <Row>
            <Col>
              <Title level={4}>General Information</Title>
            </Col>
          </Row>
        </div>
        {generalInfo.map((item) => {
          return <ItemRow {...item} />;
        })}
        <Divider />
        <div className="top-space">
          <Row>
            <Col>
              <Title level={4}>Contact Information</Title>
            </Col>
          </Row>
        </div>
        {contactInfo.map((item) => {
          return <ItemRow {...item} />;
        })}
      </Col>
    </Row>
  );
}
