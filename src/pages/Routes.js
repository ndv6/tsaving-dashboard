import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Customers from "./Customers";
import TransactionLog from "./TransactionLog";
import ActivityLog from "./ActivityLog";
import PageNotFound from "./PageNotFound";
import CustomerTransactionLog from "./CustomerTransactionLog";
import Tabs from '../components/Tab'

const tabs = [
  {
    tabname: 'Profile',
    components: <PageNotFound />,
    key: '1',
  },
  {
    tabname: 'Va List',
    components: <PageNotFound />,
    key: '2',
  },
  {
    tabname: 'Transaction History',
    components: <CustomerTransactionLog />,
    key: '3',
  },
];


export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/admin">
          <Tabs size="medium" tabs={tabs}/>
        </Route>
        <Route exact path="/admin/login">
          <Login />
        </Route>
        <Route exact path="/admin/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/admin/customer-list">
          <Customers />
        </Route>
        <Route exact path="/admin/transaction-list">
          <TransactionLog />
        </Route>
        <Route exact path="/admin/activity-log">
          <ActivityLog />
        </Route>
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
    </Router>
  );
}
