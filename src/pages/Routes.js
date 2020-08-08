import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Customers from "./Customers";
import TransactionLog from "./TransactionLog";
import ActivityLog from "./ActivityLog";
import PageNotFound from "./PageNotFound";
import CustomerTransactionLog from "./CustomerTransactionLog";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/admin">
          <CustomerTransactionLog />
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
