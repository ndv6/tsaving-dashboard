import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Typography, Divider, Spin, Button } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    HomeOutlined,
    PhoneOutlined,
    BankOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import Tab from '../components/Tab'
import ProfilePlaceholder from '../static/profile_placeholder.svg'
import DebitCard from '../components/DebitCard'
import VAList from '../pages/VAList'
import '../styles/CustomerProfile.css'

const { Title, Text } = Typography;

const DEFAULT_PROFILE = {
    name: "",
    email: "",
    accNum: "",
    address: "",
    phone: ""
}

const DEFAULT_CARD = {
    cardNum: "",
    validThru: "",
    name: ""
}

export default function CustomerProfile() {
    return (
        <div>
            <div className="title-row">
                <Row>
                    <Title level={3}>Tsaving</Title>
                </Row>
            </div>
            <Row justify="center" align="middle">
                <Col flex={1}>
                    <div className="blue-bg bg-height" />
                    <div className="bg-height" />
                </Col>
                <div className="picture-container">
                    <img className="picture" alt="Profile Placeholder" src={ProfilePlaceholder}></img>
                    <Title level={3}>Andreas</Title>
                </div>
            </Row>
            <Row>
                <Col flex={1}>
                    <Tab tabs={[{ tabname: "Profile", components: <ProfileTab /> }, { tabname: "Virtual Account List", components: <VAList custId={1} /> }, { tabname: "Profile 3", components: <ProfileTab /> }]} size={3} />
                </Col>
            </Row>
        </div>
    );
}

function ProfileTab() {
    const [profileData, setProfileData] = useState(DEFAULT_PROFILE);
    const [cardData, setCardData] = useState(DEFAULT_CARD);
    const [fetching, setFetching] = useState(true);
    const [reload, setReload] = useState(false)

    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://localhost:8000/v2/customers/cards/2008071802',
            headers: { Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZHMiLCJleHBpcmVkIjoiMjAyMC0wOC0wN1QxNjo1NDowMS42MzMwNzIrMDc6MDAifQ.BrwjhRlGVPuFFAdJpAimppKKt2VksVQ0PJCI4DXoCnk" }
        })
            .then(function (response) {
                if (response.data.status === "SUCCESS") {
                    let validYear = response.data.data.expired.substring(2, 4);
                    let validMonth = response.data.data.expired.substring(5, 7);
                    setCardData({
                        cardNum: response.data.data.card_num,
                        validThru: `${validMonth}/${validYear}`,
                        name: ""
                    })
                }
            })
            .catch(function (error) {
                setReload(true)
            })
            .finally(function () {
                setFetching(false)
            });

        axios({
            method: 'get',
            url: 'http://localhost:8000/v2/customers/1',
            headers: { Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZHMiLCJleHBpcmVkIjoiMjAyMC0wOC0wN1QxNjo1NDowMS42MzMwNzIrMDc6MDAifQ.BrwjhRlGVPuFFAdJpAimppKKt2VksVQ0PJCI4DXoCnk" }
        })
            .then(function (response) {
                if (response.data.status === "SUCCESS") {
                    setProfileData({
                        name: response.data.data.cust_name,
                        email: response.data.data.cust_email,
                        accNum: response.data.data.account_num,
                        address: response.data.data.cust_address,
                        phone: response.data.data.cust_phone
                    })
                }
            })
            .catch(function (error) {
                setReload(true)
            })
            .finally(function () {
                setFetching(false)
            });
    }, [fetching]);

    if (fetching) {
        return <Loader />
    }

    if (!fetching && reload) {
        return <Reloader reload={() => setFetching(true)} />
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
    )
}

function ProfileDetail(props) {
    const generalInfo = [
        { label: "Name", value: props.name, icon: <UserOutlined /> },
        { label: "Account Number", value: props.accNum, icon: <BankOutlined /> },
        { label: "Address", value: props.address, icon: <HomeOutlined /> },
    ]
    const contactInfo = [
        { label: "Email", value: props.email, icon: <MailOutlined /> },
        { label: "Phone", value: props.phone, icon: <PhoneOutlined /> },
    ]
    function ItemRow(props) {
        return (
            <Row gutter={[8, 8]}>
                <Col span={1}>{props.icon}</Col>
                <Col span={8}>
                    <Text>{props.label}</Text>
                </Col>
                <Col span={1}><Text>:</Text></Col>
                <Col span={14}><Text strong>{props.value}</Text></Col>
            </Row>
        )
    }
    return (
        <Row>
            <Col flex={1}>
                <div className="top-space">
                    <Row>
                        <Col><Title level={4}>General Information</Title></Col>
                    </Row>
                </div>
                {generalInfo.map(item => {
                    return <ItemRow {...item} />
                })}
                <Divider />
                <div className="top-space">
                    <Row>
                        <Col><Title level={4}>Contact Information</Title></Col>
                    </Row>
                </div>
                {contactInfo.map(item => {
                    return <ItemRow {...item} />
                })}
            </Col>
        </Row >
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
    )
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
                    <Button onClick={() => reload()} shape="circle" icon={<ReloadOutlined />} />
                </Col>
            </Row>
            <Row justify="center">
                <Col>
                    <Text>Retry</Text>
                </Col>
            </Row>
        </div>
    )
}