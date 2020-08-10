import React, { useEffect } from "react";
import { Form, message } from "antd";
import * as Constants from "../constants/Constants";
import Axios from "axios";
import config from "../config/config.json";
import { EDIT_CUSTOMER_DATA, LOGIN } from "../constants/ApiEndpoints";
import EditProfileModal from "./EditProfileModal";

export default function EditProfileModalContainer(props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.visible && form) {
      form.resetFields();
    }
  }, [form, props.visible]);

  function onSubmit(formData) {
    const userToken = window.localStorage.getItem(
      Constants.HEADER_CONTENTS.TOKEN
    );
    form.submit();

    if (
      formData[Constants.FORM_FIELDS.EMAIL] !==
        props.data[Constants.FORM_FIELDS.EMAIL] ||
      formData[Constants.FORM_FIELDS.PHONE_NUMBER] !==
        props.data[Constants.FORM_FIELDS.PHONE_NUMBER] ||
      formData[Constants.FORM_FIELDS.IS_VERIFIED] !==
        props.data[Constants.FORM_FIELDS.IS_VERIFIED]
    ) {
      props.setLoading(true);

      Axios({
        headers: {
          [Constants.HEADER_TYPE.CONTENT_TYPE]: Constants.HEADER_CONTENTS.JSON,
          Authorization: userToken,
        },
        method: Constants.METHODS.PUT,
        url: config.apiHost + EDIT_CUSTOMER_DATA,
        data: Object.assign(formData, {
          is_email_changed:
            props.data.cust_email !==
            form.getFieldValue(Constants.FORM_FIELDS.EMAIL),
          username: JSON.parse(window.localStorage.getItem("STORES")).username,
        }),
      })
        .then((response) => {
          message.success(response.data.message);
        })
        .catch((err) => {
          message.error(err.response.data.message);
          if (err.response.status === 401) {
            localStorage.removeItem(Constants.HEADER_CONTENTS.TOKEN);
            props.history.push(LOGIN);
          }
        })
        .finally(() => {
          props.setLoading(false);
          props.setData(formData);
        });
    } else {
      message.error(Constants.NO_CHANGES_SUBMITTED);
    }
  }

  return (
    <EditProfileModal
      visible={props.visible}
      initialValues={props.data}
      form={form}
      loading={props.loading}
      onSubmit={onSubmit}
      onOk={props.onOk}
      onCancel={props.onCancel}
    />
  );
}
