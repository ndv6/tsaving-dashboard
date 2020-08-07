import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

export default function Tab(props) {
  return (
    <div>
      <Tabs
        defaultActiveKey="0"
        centered
        size={props.size}
        tabPosition={props.position}
        type={props.type}
      >
        {props.tabs.map((value, index) => {
          return (
            <TabPane tab={value.tabname} key={index}>
              {value.components}
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}