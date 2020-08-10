import React, { useEffect } from "react";
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
  const { visible, loading, onOk, onCancel, form, initialValues } = props;
  return (
    <Modal
      title={Constants.EDIT_PROFILE_MODAL}
      centered
      closable={false}
      maskClosable={false}
      visible={visible}
      confirmLoading={loading}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Popconfirm
          title={Constants.QUIT_MODAL_CONFIRM}
          key={Constants.BUTTON_BACK}
          icon={<QuestionCircleOutlined style={{ color: Constants.RED }} />}
          onConfirm={() => {
            props.onCancel();
          }}
        >
          <Button>{Constants.BACK}</Button>
        </Popconfirm>,
        <Button
          key={Constants.BUTTON_SUBMIT}
          type={Constants.PRIMARY}
          loading={loading}
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
        {...{ layout }}
        form={form}
        name="control-ref"
        onFinish={onOk}
        initialValues={initialValues}
      >
        <Form.Item
          label={Constants.FORM_LABELS.ACCOUNT_NUM}
          name={Constants.FORM_FIELDS.ACCOUNT_NUM}
        >
          <span className="ant-form-text">{initialValues.account_num}</span>
        </Form.Item>
        <Form.Item
          label={Constants.FORM_LABELS.NAME}
          name={Constants.FORM_FIELDS.NAME}
        >
          <span className="ant-form-text">{initialValues.cust_name}</span>
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
              type: 'email',
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
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
