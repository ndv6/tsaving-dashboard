import React from "react";
import { Button, Modal, Form, Input, Switch, Popconfirm } from "antd";
import * as Constants from "../constants/Constants";
import { QuestionCircleOutlined } from "@ant-design/icons";

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
      closable={false}
      maskClosable={false}
      visible={props.visible}
      confirmLoading={props.loading}
      onOk={props.onOk}
      onCancel={props.onCancel}
      footer={[
        <Popconfirm
          title={Constants.QUIT_MODAL_CONFIRM}
          icon={<QuestionCircleOutlined style={{ color: Constants.RED }} />}
          onConfirm={() => {
            props.onCancel();
          }}
        >
          <Button key={Constants.BUTTON_BACK}>{Constants.BACK}</Button>
        </Popconfirm>,
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
          label={Constants.FORM_LABELS.ACCOUNT_NUM}
          name={Constants.FORM_FIELDS.ACCOUNT_NUM}
        >
          <span className="ant-form-text">
            {props.initialValues.account_num}
          </span>
        </Form.Item>
        <Form.Item
          label={Constants.FORM_LABELS.NAME}
          name={Constants.FORM_FIELDS.NAME}
        >
          <span className="ant-form-text">{props.initialValues.cust_name}</span>
        </Form.Item>
        <Form.Item
          name={Constants.FORM_FIELDS.PHONE_NUMBER}
          label={Constants.FORM_LABELS.PHONE_NUMBER}
          rules={[
            {
              required: true,
              message: Constants.PHONE_NUMBER_REQUIRED,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={Constants.FORM_FIELDS.EMAIL}
          label={Constants.FORM_LABELS.EMAIL}
          rules={[
            {
              type: "email",
              message: Constants.INVALID_EMAIL,
            },
            {
              required: true,
              message: Constants.EMAIL_IS_REQUIRED,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={Constants.FORM_FIELDS.IS_VERIFIED}
          label={Constants.FORM_LABELS.IS_VERIFIED}
        >
          <Switch defaultChecked={props.initialValues.is_verified} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
