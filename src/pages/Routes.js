import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PageNotFound from "./PageNotFound";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
    </Router>
  );
}
