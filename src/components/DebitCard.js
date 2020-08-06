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
                    <div className="title">
                        <Title>BAIT BANK</Title>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <img className="image-logo" alt="chip" src={chip}></img>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="title">
                        <Title level={2} >{props.cardNum}</Title>
                    </div>
                </Col>
            </Row>
            <Row justify="center">
                <Col>
                    <Text className="validLabel" >VALID THRU</Text>
                    <Text className="validThru"> {props.validThru}</Text>
                </Col>
            </Row>
            <Row justify="space-between" align="middle">
                <Col>
                    <div className="title">
                        <Title level={3} >{props.name}</Title>
                    </div>
                </Col>
                <Col>
                    <img className="image-logo" alt="master-logo" src={master}></img>
                </Col>
            </Row>
        </div>
    );
}