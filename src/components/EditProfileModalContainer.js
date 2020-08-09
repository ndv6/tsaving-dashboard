import React from "react";
import { Form, message } from "antd";
import * as Constants from "../constants/Constants";
import Axios from "axios";
import config from "../config/config.json";
import { EDIT_CUSTOMER_DATA, LOGIN } from "../constants/ApiEndpoints";
import EditProfileModal from "./EditProfileModal";
import { useHistory } from "react-router";
import jwt_decode from "jwt-decode";

export default function EditProfileModalContainer(props) {
  const [loading, setLoading] = React.useState(props.loading);
  const [form] = Form.useForm();
  const history = useHistory();

  function onSubmit(formData) {
    setLoading(true);
    const userToken = window.localStorage.getItem(
      Constants.HEADER_CONTENTS.TOKEN
    );
    form.submit();
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
        username: jwt_decode(userToken).username,
      }),
    })
      .then((response) => {
        message.success(response.data.message);
      })
      .catch((err) => {
        message.error(err.response.data.message);
        if (err.response.status === 401) {
          localStorage.removeItem(Constants.HEADER_CONTENTS.TOKEN);
          history.push(LOGIN);
        }
      })
      .finally(setLoading(false));
  }

  return (
    <EditProfileModal
      visible={props.visible}
      initialValues={props.data}
      form={form}
      loading={loading}
      onSubmit={onSubmit}
      onOk={props.onOk}
      onCancel={props.onCancel}
    />
  );
}
