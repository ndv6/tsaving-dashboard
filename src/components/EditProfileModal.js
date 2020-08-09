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
        <Form.Item
          label="Account Number"
          name={Constants.FORM_FIELDS.ACCOUNT_NUM}
        >
          <span className="ant-form-text">
            {props.initialValues.account_num}
          </span>
        </Form.Item>
        <Form.Item label="Customer Name" name={Constants.FORM_FIELDS.NAME}>
          <span className="ant-form-text">{props.initialValues.cust_name}</span>
        </Form.Item>
        <Form.Item
          name={Constants.FORM_FIELDS.PHONE_NUMBER}
          label="Phone Number"
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
          name={Constants.FORM_FIELDS.EMAIL}
          label="Email"
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
        <Form.Item name={Constants.FORM_FIELDS.IS_VERIFIED} label="Verified">
          <Switch defaultChecked={props.initialValues.is_verified} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
