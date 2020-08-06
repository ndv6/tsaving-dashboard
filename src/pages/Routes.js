import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import TransactionLog from "./TransactionLog"

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/admin/transaction-log">
          <TransactionLog />
        </Route>
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
    </Router>
  );
}
