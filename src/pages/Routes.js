import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import TransactionLog from "./TransactionLog";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="*">
          <PageNotFound />
        </Route>
        <Route path="/admin/transactionlog">
          <TransactionLog />
        </Route>
      </Switch>
    </Router>
  );
}
