import { Card } from "antd"
import React from 'react';

export default function ComponentCard(props) {
    return ( !props.cover ? <Card 
        className={props.className}
        title={props.title} 
        size={props.isSmall ? "small" : "default"} 
        loading={props.isLoading}
        bordered={props.isBordered}
        bodyStyle={props.bodyStyle}
        hoverable={props.hoverable}
        headStyle={props.headStyle}>
            {props.content}
    </Card> : 
        <Card 
            className={props.className}
            title={props.title} 
            size={props.isSmall ? "small" : "default"} 
            loading={props.isLoading}
            bordered={props.isBordered}
            cover={props.cover}
            bodyStyle={props.bodyStyle}
            headStyle={props.headStyle}
            hoverable={props.hoverable}>
                {props.content}
        </Card>
    )
}
