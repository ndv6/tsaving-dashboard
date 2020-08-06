import { Card } from "antd"
import React from 'react';

export default function ComponentCard(props) {
    return (
        <Card 
        className={props.className}
        title={props.title} 
        size={props.isSmall ? "small" : "default"} 
        loading={props.isLoading}
        bordered={props.isBordered}
        cover={props.cover}
        extra={props.extra}
        headStyle={props.headStyle}
        bodyStyle={props.bodyStyle}>
        </Card>
    )
}
