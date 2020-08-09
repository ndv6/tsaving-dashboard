import React from 'react';
import NavigationBar from '../components/NavigationBar';
import config from '../config/config.json'

import '../styles/Dashboard.css';
import ComponentCard from '../components/Card';
import Axios from 'axios';
import { DASHBOARD_ENDPOINT } from '../constants/ApiEndpoints';
import { FAILED_TO_FETCH_DATA, DASHBOARD_LOG_TRANSACTION, DASHBOARD_LOG_TRANSACTION_NOT_FOUND, DASHBOARD_TOTAL_USER, DASHBOARD_TOTAL_TRANSACTION_AMOUNT, DASHBOARD_TOTAL_TRANSACTION, DASHBOARD_USER_ACQUIRE, DASHBOARD_CASH_FLOW, DASHBOARD_NUM_TRANSACTION_MONTH, DASHBOARD_NUM_TRANSACTION_TODAY, DASHBOARD_NUM_TRANSACTION_YESTERDAY, DASHBOARD_NUM_USER_WEEK, DASHBOARD_NUM_USER_MONTH, DASHBOARD_NUM_USER, DASHBOARD_NUM_USER_TODAY, DASHBOARD_NUM_USER_YESTERDAY, DASHBOARD_NUM_TRANSACTION } from '../constants/StaticText';
import { Pie, Bar } from "ant-design-pro/lib/Charts"
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';
import ComponentChartCard from '../components/ChartCard';
import { Table } from 'antd';

function getDashboardData(setData, setState) {
    var error = false
    Axios({
        headers: {
            "Content-Type": "application/json",
            "Authorization" : window.localStorage.getItem("token"),
        },
        method: "GET",
        url: config.apiHost + DASHBOARD_ENDPOINT
    }).then(function (res) {
        //Success
        setData(res.data)
        console.log("success")
    })
        .catch(function (err) {
            //Error
            console.log(err, "error");
            error = true
        })
        .finally(function () {
            setState({ loading: false, err: error});
        });
}

function userChart(dashboardUserData) {
    var total = 0
    var pieData = []
    if (dashboardUserData) {
        total = dashboardUserData.active_user + dashboardUserData.inact_user
        pieData =
            [
                {
                    x: "Active User",
                    y: dashboardUserData.active_user
                },
                {
                    x: "Inactive User",
                    y: dashboardUserData.inact_user
                }
            ];
    }
    return <Pie
        hasLegend
        total={
            <h3>{DASHBOARD_TOTAL_USER + " " + total}</h3>
        }
        animate={true}
        valueFormat={val => <span dangerouslySetInnerHTML={{ __html: " - " + val + " users" }} />}
        data={pieData}
        height={225}
    />
}

function transactionComponentUI(dashboardTrxData) {
    var dataList = []

    if (!dashboardTrxData.transaction_month != null) {
        dataList.push({ x: 0, y: 0 })
        dataList.push(...dashboardTrxData.transaction_month.map(val => {
            return {
                x: val.week,
                y: val.amount
            }
        }))
    }

    var length = dataList.length
    for (; length < 5; length += 1) {
        dataList.push({ x: length, y: 0 })
    }

    return <Bar
        data={dataList}
        height={250}
        title={"Cash flow per week"}>
    </Bar>
}

function logTransactionComponentUI(logTrx) {
    return <Table
        columns={[
            {
                title: "Description",
                dataIndex: "description",
                key: "description",
            },
            {
                title: "Amount",
                dataIndex: "amount",
                key: "amount",
            },
            {
                title: "Created at",
                dataIndex: "created_at",
                key: "created_at",
            }
        ]}
        dataSource={
            logTrx == null ? [] : logTrx.map((val, idx) => {
                return {
                    key: idx,
                    description: val.description,
                    amount: val.tran_amount,
                    created_at: val.created_at,
                }
            })
        }
        size="middle"
        pagination={false} />
}

export default function Dashboard() {
    const [state, setState] = React.useState({
        loading: true,
        err: false
    })
    const [data, setData] = React.useState({})

    React.useEffect(function () {
        console.log("get dashboard data")
        getDashboardData(setData, setState)
    }, [])

    return (
        <div className="dashboard-constraint">
            <NavigationBar />
            <div className="dashboard-content">
                { state.err ? <h1 className="err-msg">{FAILED_TO_FETCH_DATA}</h1> : [
                <div className="dashboard-content-section">
                    <Zoom clear>
                        <ComponentCard
                            title={<h1>{DASHBOARD_NUM_USER}</h1>}
                            isSmall={true}
                            isLoading={state}
                            hoverable={false}
                            content={
                                <div className="dashboard-content-chart">
                                    <div className="dashboard-content-left">
                                        {userChart(state ? null : data.data.dashboard_user)}
                                    </div>
                                    <div className="dashboard-content-right">
                                        {state.loading ? [] : [
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                                                        content={<p>
                                                            {data.data.dashboard_user.new_user_today > data.data.dashboard_user.new_user_yesterday ?
                                                                <span style={{ color: "green" }}>+</span> : <span style={{ color: "red" }}>-</span>}
                                                            {Math.abs(data.data.dashboard_user.new_user_today - data.data.dashboard_user.new_user_yesterday) / data.data.dashboard_user.new_user_yesterday * 100}% compared to yesterday
                                                    </p>}
                                                    />
                                                </div>,
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                <div className="dashboard-content-section">
                    <Fade right>
                        <ComponentCard
                            title={<h1>{DASHBOARD_NUM_TRANSACTION}</h1>}
                            isSmall={true}
                            isLoading={state}
                            hoverable={false}
                            content={state.loading ? [] : [
                                    <div className="dashboard-content-chart">
                                        <div className="dashboard-content-left">
                                            {state ? <p></p> : transactionComponentUI(data.data.dashboard_transaction)}
                                        </div>
                                        <div className="dashboard-content-right">
                                            {[
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <ComponentChartCard
                                                        className="dashboard-chart-card"
                                                        title={<h3>{DASHBOARD_NUM_TRANSACTION_YESTERDAY}</h3>}
                                                        contentHeight={36}
                                                        total={<h4>{data.data.dashboard_transaction.total_transaction_yesterday + DASHBOARD_CASH_FLOW}</h4>} />
                                                    <ComponentChartCard
                                                        className="dashboard-chart-card"
                                                        title={<h3>{DASHBOARD_NUM_TRANSACTION_TODAY}</h3>}
                                                        contentHeight={36}
                                                        total={<h4>{data.data.dashboard_transaction.total_transaction_today + DASHBOARD_CASH_FLOW}</h4>}
                                                        content={<p>
                                                            {data.data.dashboard_transaction.total_transaction_today > data.data.dashboard_transaction.total_transaction_yesterday ?
                                                                <span style={{ color: "green" }}>+</span> : <span style={{ color: "red" }}>-</span>}
                                                            {Math.abs(data.data.dashboard_transaction.total_transaction_today - data.data.dashboard_transaction.total_transaction_yesterday) / data.data.dashboard_transaction.total_transaction_yesterday * 100}% compared to yesterday
                                                            </p>}
                                                    />
                                                </div>,
                                                <div style={{ display: "flex", width: "100%" }}>
                                                    <ComponentChartCard
                                                        className="dashboard-chart-card"
                                                        title={<h3>{DASHBOARD_NUM_TRANSACTION_MONTH}</h3>}
                                                        contentHeight={36}
                                                        total={<h4>{data.data.dashboard_transaction.total_transaction_month + DASHBOARD_CASH_FLOW}</h4>} />
                                                </div>

                                            ]}
                                        </div>
                                    </div>,
                                    <div>
                                        <h1>{DASHBOARD_TOTAL_TRANSACTION + " " + data.data.dashboard_transaction.total_transaction}</h1>
                                        <h4>{DASHBOARD_TOTAL_TRANSACTION_AMOUNT + " " + data.data.dashboard_transaction.total_transaction_amount}</h4>
                                    </div>
                                ]} />
                    </Fade>
                </div>,
                <div className="dashboard-content-section">
                    {<ComponentCard
                        title={DASHBOARD_LOG_TRANSACTION}
                        loading={state}
                        content={state.loading ? [] : logTransactionComponentUI(data.data.log_transaction_today)} />}
                </div>
            ]}</div>
        </div>
    )
}