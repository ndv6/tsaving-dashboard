import React from "react";
import { Button, Modal, Form, Input, Switch } from "antd";
import * as Constants from "../constants/Constants";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const EditProfileModal = (props) => {
  return (
    <Modal
      title={Constants.EDIT_PROFILE_MODAL}
      centered
      visible={props.visible}
      onOk={props.onOk}
      onCancel={props.onCancel}
      footer={[
        <Button key={Constants.BUTTON_BACK} onClick={props.onCancel}>
          {Constants.BACK}
        </Button>,
        <Button
          key={Constants.BUTTON_SUBMIT}
          type={Constants.PRIMARY}
          loading={props.loading}
          onClick={() => {
            props.form.validateFields().then((values) => {
              props.onSubmit(values);
            });
          }}
        >
          {Constants.SUBMIT}
        </Button>,
      ]}
    >
      <Form
        {...layout}
        form={props.form}
        name="control-ref"
        onFinish={props.onOk}
        initialValues={props.initialValues}
      >
        <Form.Item label="Account Number" name="account_num">
          <span className="ant-form-text">
            {props.initialValues.account_num}
          </span>
        </Form.Item>
        <Form.Item label="Customer Name" name="cust_name">
          <span className="ant-form-text">{props.initialValues.cust_name}</span>
        </Form.Item>
        <Form.Item
          name="cust_phone"
          label="Phone Number"
          initialValue={props.initialValues.phone}
          rules={[
            {
              required: true,
              message: "Phone Number is required!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="cust_email"
          label="Email"
          initialValue={props.initialValues.email}
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
        <Form.Item name="is_verified" label="Verified">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
