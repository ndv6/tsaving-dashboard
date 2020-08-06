import React from 'react';
import { Row, Col, Typography, Divider } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    HomeOutlined,
    PhoneOutlined,
    BankOutlined
} from '@ant-design/icons';
import Tab from '../components/Tab'
import ProfilePlaceholder from '../static/profile_placeholder.svg'
import DebitCard from '../components/DebitCard'
import '../styles/CustomerProfile.css'

const { Title, Text } = Typography;

// TODO : use real data

export default function CustomerProfile() {
    return (
        <div>
            <div className="title-row">
                <Row>
                    {/* TODO : link to home page */}
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
                    {/* TODO : tab type? */}
                    <Tab tabs={[{tabname: "Profile", components: <ProfilePage />}, {tabname: "Profile 2", components: <ProfilePage />}, {tabname: "Profile 3", components: <ProfilePage />}]} size={3} />
                </Col>
            </Row>
        </div>
    );
}

function ProfilePage() {
    return (
        <div className="top-space">
            <Row>
                <Col span={3}></Col>
                <Col span={9}>
                    <ProfileDetail name="Andreas" email="sayaandreas@gmail.com" accNum="77777777777" address="Jakarta" phone="0808080808080" />
                </Col>
                <Col span={9}>
                    <DebitCard name="Andreas" cardNum="0222 0111 0022 9999" validThru="19/20" />
                </Col>
                <Col span={3}></Col>
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