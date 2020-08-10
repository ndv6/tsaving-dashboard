import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

export default function Tab(props) {
  const { size, position, type, tabs } = props;
  return (
    <div>
      <Tabs
        defaultActiveKey="0"
        centered
        size={size}
        tabPosition={position}
        type={type}
      >
        {tabs.map((value, index) => {
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
