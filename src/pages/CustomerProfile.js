import React, { useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Typography, Spin, Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import Tab from '../components/Tab';
import NavigationBar from '../components/NavigationBar';
import ProfilePlaceholder from '../static/profile_placeholder.svg';
import VAListTab from './VAListTab';
import ProfileTab from './ProfileTab';
import CustomerTransactionLog from './CustomerTransactionLog';
import '../styles/CustomerProfile.css';
import config from '../config/config.json';
import { LOGGED_OUT_MESSAGE } from '../constants/StaticText';

const { Title, Text } = Typography;

const DEFAULT_PROFILE = {
  isLoading: true,
  isError: false,
  name: '',
  email: '',
  accNum: '',
  address: '',
  phone: '',
};

function getToken() {
  return window.localStorage.getItem('token');
}

export function reqBuilder(method, url) {
  const token = getToken();
  return {
    method,
    url,
    headers: { Authorization: token },
  };
}

export function logOut() {
  message.error(LOGGED_OUT_MESSAGE, 2);
  window.localStorage.removeItem('token');
  return <Redirect to="/admin/login" />;
}

export default function CustomerProfile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    if (!getToken()) {
      return <Redirect to="/admin/login" />;
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await reqProfile(id);
      setProfileData(result);
    };
    fetchData();
    setLoading(false);
  }, [id]);

  function reqProfile(id) {
    return new Promise(function (resolve, reject) {
      axios(reqBuilder('get', `${config.apiHost}/v2/customers/${id}`))
        .then(function (response) {
          if (response.data.status === 'SUCCESS') {
            resolve({
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
          if (error.response.status === 401) {
            logOut();
          }
          reject({
            ...DEFAULT_PROFILE,
            isLoading: false,
            isError: true,
          });
        });
    });
  }

  return (
    <div className="customer-profile-constraint">
      <NavigationBar />
      <div className="customer-profile-content">
        {loading ? (
          <Loader />
        ) : (
          <div>
            <Row justify="center" align="middle" style={{ position: 'sticky' }}>
              <Col flex={1}>
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
                      tabname: 'Profile',
                      components: (
                        <ProfileTab custId={id} profileData={profileData} />
                      ),
                    },
                    {
                      tabname: 'Virtual Accounts',
                      components: <VAListTab custId={id} />,
                    },
                    {
                      tabname: 'Transaction History',
                      components: (
                        <CustomerTransactionLog accNum={profileData.accNum} />
                      ),
                    },
                  ]}
                  size={3}
                />
              </Col>
            </Row>
          </div>
        )}
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
