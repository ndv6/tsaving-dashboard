import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import ActivityLog from "./ActivityLog"

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/log">
          <ActivityLog />
        </Route>
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
    </Router>
  );
}
