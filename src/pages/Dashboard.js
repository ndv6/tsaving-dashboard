import React from 'react';
import NavigationBar from '../components/NavigationBar';
import config from '../config/config.json';

import '../styles/Dashboard.css';
import ComponentCard from '../components/Card';
import Axios from 'axios';
import { DASHBOARD_ENDPOINT } from '../constants/ApiEndpoints';
import {
    FETCH_DATA_FAILED,
    NETWORK_ERROR,
    DASHBOARD_CASH_FLOW_AMOUNT,
    DASHBOARD_CASH_FLOW_TODAY,
    DASHBOARD_CASH_FLOW_YESTERDAY,
    DASHBOARD_CASH_FLOW_WEEK,
    DASHBOARD_CASH_FLOW_TITLE,
    DASHBOARD_CASH_FLOW_MONTH,
    LOGGED_OUT_MESSAGE,
    FAILED_TO_FETCH_DATA,
    DASHBOARD_TOTAL_USER,
    DASHBOARD_TOTAL_TRANSACTION,
    DASHBOARD_USER_ACQUIRE,
    DASHBOARD_CASH_FLOW,
    DASHBOARD_NUM_USER_WEEK,
    DASHBOARD_NUM_USER_MONTH,
    DASHBOARD_NUM_USER,
    DASHBOARD_NUM_USER_TODAY,
    DASHBOARD_NUM_USER_YESTERDAY,
    DASHBOARD_NUM_TRANSACTION,
    DEPOSIT,
    DASHBOARD_CASH_FLOW_DEPOSIT,
    DASHBOARD_CASH_FLOW_VA,
    DASHBOARD_CASH_FLOW_MAIN,
    VIRTUAL_ACCOUNT,
    MAIN_ACCOUNT
} from '../constants/StaticText';
import { Pie, Bar } from 'ant-design-pro/lib/Charts';
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';
import ComponentChartCard from '../components/ChartCard';
import { useHistory } from "react-router-dom";
import { message } from 'antd';

function getDashboardData(history, setData, setState) {
  var error = false;
  Axios({
    headers: {
      'Content-Type': 'application/json',
      Authorization: window.localStorage.getItem('token'),
    },
    method: 'GET',
    url: config.apiHost + DASHBOARD_ENDPOINT,
  })
    .then(function (res) {
      setData(res.data);
    })
        .catch(function (err) {
            error = true
            if (err.response === undefined) {
                message.error(NETWORK_ERROR, 2);
            } else if (err.response.status === 401) {
                message.error(LOGGED_OUT_MESSAGE, 2)
                window.localStorage.removeItem("token");
                history.push("/admin/login");
            } else {
                message.error(FETCH_DATA_FAILED, 2)
            }
        })
        .finally(function () {
            setState({ loading: false, err: error });
        });
}

function userChart(dashboardUserData) {
  var total = 0;
  var pieData = [];
  if (dashboardUserData) {
    total = dashboardUserData.active_user + dashboardUserData.inact_user;
    pieData = [
      {
        x: 'Active User',
        y: dashboardUserData.active_user,
      },
      {
        x: 'Inactive User',
        y: dashboardUserData.inact_user,
      },
    ];
  }
  return (
    <Pie
      hasLegend
      total={<h3>{DASHBOARD_TOTAL_USER + ' ' + total}</h3>}
      animate={true}
      valueFormat={(val) => (
        <span dangerouslySetInnerHTML={{ __html: ' - ' + val + ' users' }} />
      )}
      data={pieData}
      height={225}
    />
  );
}

function transactionChart(trxData) {
  var total = 0;
  var pieData = [];
  if (trxData) {
    total = trxData.total_transaction;
    pieData = [
      {
        x: MAIN_ACCOUNT,
        y: trxData.total_transaction_main,
      },
      {
        x: VIRTUAL_ACCOUNT,
        y: trxData.total_transaction_va,
      },
      {
        x: DEPOSIT,
        y: trxData.total_transaction_deposit,
      },
    ];
  }
  return (
    <Pie
      hasLegend
      total={<h3>{DASHBOARD_TOTAL_TRANSACTION + ' ' + total}</h3>}
      animate={true}
      valueFormat={(val) => (
        <span
          dangerouslySetInnerHTML={{ __html: ' - ' + val + ' transaction(s)' }}
        />
      )}
      data={pieData}
      height={225}
    />
  );
}

function transactionComponentUI(dashboardTrxData) {
  var dataList = [];

  if (dashboardTrxData) {
    dataList.push({ x: 0, y: 0 });
    dataList.push(
      ...dashboardTrxData.map((val) => {
        return {
          x: val.week,
          y: val.amount,
        };
      }),
    );
  }

  var length = dataList.length;
  for (; length < 5; length += 1) {
    dataList.push({ x: length, y: 0 });
  }

  return <Bar data={dataList} height={250} title={'Cash flow per week'}></Bar>;
}

export default function Dashboard() {
    const formatter = new Intl.NumberFormat("id", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
    });
    const history = useHistory();
    const [state, setState] = React.useState({
        loading: true,
        err: false
    })
    const [data, setData] = React.useState({})

    React.useEffect(function () {
        getDashboardData(history, setData, setState)
    }, [])

    return (
        <div className="dashboard-constraint">
            <NavigationBar />
            <div className="dashboard-content">
                {state.err ? <h1 className="err-msg">{FAILED_TO_FETCH_DATA}</h1> : [
                    <div className="dashboard-content-section" onClick={() => { history.push("/admin/customer-list") }}>
                        <Zoom clear>
                            <ComponentCard
                                title={<h1>{DASHBOARD_NUM_USER}</h1>}
                                isSmall={true}
                                isLoading={state.loading}
                                hoverable={true}
                                content={
                                    <div className="dashboard-content-chart">
                                        <div className="dashboard-content-left">
                                            {userChart(state.loading ? null : state.err ? null : data.data.dashboard_user)}
                                        </div>
                                        <div className="dashboard-content-right">
                                            {state.loading ? [] : [
                                                <div className="dashboard-content-chart-card">
                                                    <ComponentChartCard
                                                        className="dashboard-chart-card"
                                                        title={<h3>{DASHBOARD_NUM_USER_YESTERDAY}</h3>}
                                                        contentHeight={36}
                                                        total={<h4>{data.data.dashboard_user.new_user_yesterday + DASHBOARD_USER_ACQUIRE}</h4>} />
                                                    <ComponentChartCard
                                                        className="dashboard-chart-card"
                                                        title={<h3>{DASHBOARD_NUM_USER_TODAY}</h3>}
                                                        contentHeight={36}
                                                        total={<h4>{data.data.dashboard_user.new_user_today + DASHBOARD_USER_ACQUIRE}</h4>}
                                                        content={data.data.dashboard_user.new_user_yesterday <= 0 ? "" : <p>
                                                            {data.data.dashboard_user.new_user_today > data.data.dashboard_user.new_user_yesterday ?
                                                                <span style={{ color: "green" }}>+</span> : <span style={{ color: "red" }}>-</span>}
                                                            {Math.abs(data.data.dashboard_user.new_user_today - data.data.dashboard_user.new_user_yesterday) / data.data.dashboard_user.new_user_yesterday * 100 + "% compared to yesterday"}
                                                        </p>}
                                                    />
                                                </div>,
                                                <div className="dashboard-content-chart-card">
                                                    <ComponentChartCard
                                                        className="dashboard-chart-card"
                                                        title={<h3>{DASHBOARD_NUM_USER_MONTH}</h3>}
                                                        contentHeight={36}
                                                        total={<h4>{data.data.dashboard_user.new_user_this_month + DASHBOARD_USER_ACQUIRE}</h4>} />
                                                    <ComponentChartCard
                                                        className="dashboard-chart-card"
                                                        title={<h3>{DASHBOARD_NUM_USER_WEEK}</h3>}
                                                        contentHeight={36}
                                                        total={<h4>{data.data.dashboard_user.new_user_this_week + DASHBOARD_USER_ACQUIRE}</h4>} />
                                                </div>
                                            ]}
                                        </div>
                                    </div>} />
                        </Zoom>
                    </div>,
                    <div className="dashboard-content-section" onClick={() => { history.push("/admin/transaction-list") }}>
                        <Fade right>
                            <ComponentCard
                                title={<h1>{DASHBOARD_NUM_TRANSACTION}</h1>}
                                isSmall={true}
                                isLoading={state.loading}
                                hoverable={true}
                                content={state.loading ? [] : transactionChart(state.err ? null : data.data.dashboard_transaction)} />
                        </Fade>
                    </div>,
                    <div className="dashboard-content-section">
                        <Fade up>
                            <ComponentCard
                                title={<h1>{DASHBOARD_CASH_FLOW_TITLE}</h1>}
                                isSmall={true}
                                isLoading={state.loading}
                                hoverable={false}
                                content={state.loading ? [] : [
                                    <div className="dashboard-content-chart">
                                        <div className="dashboard-content-left">
                                            {transactionComponentUI(data.data.dashboard_amount.transaction_month)}
                                        </div>
                                        <div className="dashboard-content-right">
                                            {[
                                                <div className="dashboard-content-chart-card">
                                                    <ComponentChartCard
                                                        className="dashboard-chart-card"
                                                        title={<h3>{DASHBOARD_CASH_FLOW_YESTERDAY}</h3>}
                                                        contentHeight={36}
                                                        total={<h4>{formatter.format(data.data.dashboard_amount.total_transaction_yesterday) + DASHBOARD_CASH_FLOW}</h4>} />
                                                    <ComponentChartCard
                                                        className="dashboard-chart-card"
                                                        title={<h3>{DASHBOARD_CASH_FLOW_TODAY}</h3>}
                                                        contentHeight={36}
                                                        total={<h4>{formatter.format(data.data.dashboard_amount.total_transaction_today) + DASHBOARD_CASH_FLOW}</h4>}
                                                        content={data.data.dashboard_amount.total_transaction_yesterday <= 0 ? "" : <p>
                                                            {data.data.dashboard_amount.total_transaction_today > data.data.dashboard_amount.total_transaction_yesterday ?
                                                                <span style={{ color: "green" }}>+</span> : <span style={{ color: "red" }}>-</span>}
                                                            {Math.abs(data.data.dashboard_amount.total_transaction_today - data.data.dashboard_amount.total_transaction_yesterday) / data.data.dashboard_amount.total_transaction_yesterday * 100}% compared to yesterday
                                                            </p>}
                                                    />
                                                </div>,
                                                <div className="dashboard-content-chart-card">
                                                    <ComponentChartCard
                                                        className="dashboard-chart-card"
                                                        title={<h3>{DASHBOARD_CASH_FLOW_MONTH}</h3>}
                                                        contentHeight={36}
                                                        total={<h4>{formatter.format(data.data.dashboard_amount.total_transaction_month) + DASHBOARD_CASH_FLOW}</h4>} />
                                                    <ComponentChartCard
                                                        className="dashboard-chart-card"
                                                        title={<h3>{DASHBOARD_CASH_FLOW_WEEK}</h3>}
                                                        contentHeight={36}
                                                        total={<h4>{formatter.format(data.data.dashboard_amount.total_transaction_week) + DASHBOARD_CASH_FLOW}</h4>} />
                                                </div>
                                            ]}
                                        </div>
                                    </div>,
                                    <div className="dashboard-card-footer">
                                        <h1>{DASHBOARD_CASH_FLOW_AMOUNT + " " + formatter.format(data.data.dashboard_amount.total_transaction_amount)}</h1>
                                        <div style={{ display: "flex", width: "100%" }}>
                                            <ComponentChartCard
                                                className="dashboard-chart-card"
                                                title={<h3>{DASHBOARD_CASH_FLOW_MAIN}</h3>}
                                                contentHeight={36}
                                                total={<h4>{formatter.format(data.data.dashboard_amount.total_transaction_amount_main) + DASHBOARD_CASH_FLOW}</h4>} />
                                            <ComponentChartCard
                                                className="dashboard-chart-card"
                                                title={<h3>{DASHBOARD_CASH_FLOW_VA}</h3>}
                                                contentHeight={36}
                                                total={<h4>{formatter.format(data.data.dashboard_amount.total_transaction_amount_va) + DASHBOARD_CASH_FLOW}</h4>} />
                                            <ComponentChartCard
                                                className="dashboard-chart-card"
                                                title={<h3>{DASHBOARD_CASH_FLOW_DEPOSIT}</h3>}
                                                contentHeight={36}
                                                total={<h4>{formatter.format(data.data.dashboard_amount.total_transaction_amount_deposit) + DASHBOARD_CASH_FLOW}</h4>} />
                                        </div>
                                    </div>
                                ]} />
                        </Fade>
                    </div>,
                ]}</div>
        </div>
    )
}
