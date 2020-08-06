import React from 'react';
import { Row, Col, Typography } from 'antd';
import '../styles/DebitCard.css';
import chip from '../static/chip.png';
import master from '../static/master.svg';

const { Title, Text } = Typography;

export default function DebitCard(props) {
    return (
        <div className="card-container">
            <Row>
                <Col>
                    <Title style={{ color: 'white', fontFamily: 'serif' }}>BAIT BANK</Title>
                </Col>
            </Row>
            <Row>
                <Col>
                    <img className="image-logo" alt="chip" src={chip}></img>
                </Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
                <Col>
                    <Title level={2} style={{ color: 'white', fontFamily: 'monospace' }}>{props.cardNum}</Title>
                </Col>
            </Row>
            <Row justify="center">
                <Col>
                    <Text className="valid" style={{ color: 'grey', fontFamily: 'serif', fontSize: 12 }}>VALID THRU</Text>
                    <Text style={{ color: 'white', fontFamily: 'monospace' }}> {props.validThru}</Text>
                </Col>
            </Row>
            <Row justify="space-between" align="middle">
                <Col>
                    <Title level={3} style={{ color: 'white', fontFamily: 'monospace' }}>{props.name}</Title>
                </Col>
                <Col>
                    <img className="image-logo" alt="master-logo" src={master}></img>
                </Col>
            </Row>
        </div>
    );
}