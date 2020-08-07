import React from "react";
import { Button, Modal, Form, Input, Switch, Select, message } from "antd";
import * as Constants from "../constants/Constants";
import Axios from "axios";
import apiRequestFormatter from "../utils/apiHelper";
import config from "../config/config.json";
import { format } from "path";
// import EditProfileModal from "./EditProfileModal";

export default function ModalsContainer() {
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();
  const [data, setData] = React.useState({
    accountNum: "",
    name: "",
    email: "",
    phone: "",
    isVerified: false,
    isActive: false,
  });

  function onCancel() {
    setVisible(false);
  }

  function onOk() {
    setVisible(false);
  }

  function showModal() {
    setVisible(true);
  }

  function onSubmit(formData) {
    setLoading(true);
    Axios.post(config.apiHost + "", apiRequestFormatter())
      .catch((err) => {
        message.error(err);
      })
      .then((response) => {
        message.success(response.data.status);
      })
      .finally(setLoading(false));
  }

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const phonePrefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        {Constants.PHONE_NUMBER_PREFIX.map((prefix, _) => {
          return (
            <Select.Option value={prefix.value}>{prefix.label}</Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );

  const fieldsList = ["acc_num", "cust_email", "cust_phone", "is_verified"];

  return (
    <>
      <Button type={Constants.PRIMARY} onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title={Constants.EDIT_PROFILE_MODAL}
        centered
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel}>
            {Constants.BACK}
          </Button>,
          <Button
            key="submit"
            type={Constants.PRIMARY}
            loading={loading}
            onClick={() => {
              form.validateFields().then((values) => onSubmit(values));
            }}
          >
            {Constants.SUBMIT}
          </Button>,
        ]}
      >
        <Form {...layout} name="control-ref" onFinish={onOk}>
          <Form.Item label="Account Number">
            <span className="ant-form-text">{data.accountNum}</span>
          </Form.Item>
          <Form.Item label="Customer Name">
            <span className="ant-form-text">{data.name}</span>
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            initialValue={data.phone}
            rules={[
              //   {
              //     type: "number",
              //     message: "Phone Number can only contain numbers!",
              //   },
              {
                required: true,
                message: "Phone Number is required!",
              },
            ]}
          >
            <Input addonBefore={phonePrefixSelector} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            initialValue={data.email}
            rules={[
              {
                type: "email",
                message: "Please enter a valid E-mail!",
              },
              {
                required: true,
                message: "E-mail is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="isVerified"
            label="Verified"
            rules={[
              {
                required: true,
                message: "User's verification status cannot be empty!",
              },
            ]}
          >
            <Switch checked={data.isVerified} />
          </Form.Item>
        </Form>
      </Modal>
      {/* <EditProfileModal
        visible={visible}
        handleOk={onOk}
        handleCancel={onCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </EditProfileModal> */}
    </>
  );
}
