import { ChartCard } from 'ant-design-pro/lib/Charts';
import React from 'react';

export default function ComponentChartCard(props) {
  return (
    <ChartCard
      className={props.className}
      title={props.title}
      contentHeight={props.contentHeight}
      total={props.total}
    >
      {props.content}
    </ChartCard>
  );
}
