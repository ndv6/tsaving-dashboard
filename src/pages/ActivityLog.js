import React from "react";
import NavigationBar from "../components/NavigationBar";

import "../styles/ActivityLog.css";

export default function ActivityLog() {
  return (
    <div className="activity-log-constraint">
      <NavigationBar />
      <div className="activity-log-content">ActivityLog Content</div>
    </div>
  );
}
