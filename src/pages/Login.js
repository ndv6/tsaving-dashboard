import React, { useContext } from "react";
import axios from "axios";
import { useHistory, Redirect } from "react-router-dom";
import { Form, Input, Button, Checkbox, message } from "antd";
import logo from "../static/ic_tsaving.png";
import "../styles/Login.css";
import config from "../config/config.json";
import { AppContext } from "../context/AppContext";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export default function Login() {
  const history = useHistory();
  const appConfig = useContext(AppContext);
  const fetchLogin = (values) => {
    setLoading(true);
    axios
      .post(config.apiHost + "/v2/login", {
        username: values.username,
        password: values.password,
      })
      .then(function (res) {
        window.localStorage.setItem("token", res.data.data.token);
        history.push("/admin/dashboard");
        appConfig.action.changeUser({ username: res.data.data.username });
      })
      .catch((err) => {
        message.error("Username and password doesn't match");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [loading, setLoading] = React.useState(false);

  if (window.localStorage.getItem("token")) {
    return <Redirect to="/admin/dashboard" />;
  }

  return (
    <div className="login-form">
      <div className="login-logo">
        <img src={logo} alt="tsaving-logo" />
      </div>
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={fetchLogin}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
            loading={loading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
