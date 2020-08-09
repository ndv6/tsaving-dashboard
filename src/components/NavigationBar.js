import React, { useContext } from "react";
import { NavLink, useHistory, Redirect } from "react-router-dom";
import {
  BarChartOutlined,
  TeamOutlined,
  TransactionOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { AppContext } from "../context/AppContext";
import logo from "../static/ic_tsaving.png";
import "../styles/NavigationBar.css";

export default function NavigationBar() {
  const context = useContext(AppContext);

  const history = useHistory();

  function doLogout() {
    window.localStorage.removeItem("token");
    history.push("/admin/login");
  }
  if (!window.localStorage.getItem("token")) {
    return <Redirect to="/admin/login" />;
  }
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="tsaving-logo" />
      </div>
      <div className="navbar-admin">Hello {context.store.username}!</div>
      <div className="navbar-menu">
        <ul>
          <li>
            <NavLink
              exact
              activeClassName="navbar-list-active"
              className="navbar-list"
              to="/admin/dashboard"
            >
              <span className="navbar-icon">
                <BarChartOutlined />
              </span>
              <span className="navbar-item">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              activeClassName="navbar-list-active"
              className="navbar-list"
              to="/admin/customer-list"
            >
              <span className="navbar-icon">
                <TeamOutlined />
              </span>
              <span className="navbar-item">Customer List</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              activeClassName="navbar-list-active"
              className="navbar-list"
              to="/admin/transaction-list"
            >
              <span className="navbar-icon">
                <TransactionOutlined />
              </span>
              <span className="navbar-item">Transaction List</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              activeClassName="navbar-list-active"
              className="navbar-list"
              to="/admin/activity-log"
            >
              <span className="navbar-icon">
                <FileTextOutlined />
              </span>
              <span className="navbar-item">Activity Log</span>
            </NavLink>
          </li>
          <li>
            <div className="navbar-list" onClick={doLogout}>
              <span className="navbar-icon">
                <LogoutOutlined />
              </span>
              <span className="navbar-item">Logout</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
