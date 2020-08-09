import React from "react";
import { Form, message } from "antd";
import * as Constants from "../constants/Constants";
import Axios from "axios";
import config from "../config/config.json";
import { EDIT_CUSTOMER_DATA } from "../constants/ApiEndpoints";
import EditProfileModal from "./EditProfileModal";

export default function EditProfileModalContainer(props) {
  const [loading, setLoading] = React.useState(props.loading);
  const [form] = Form.useForm();

  function onSubmit(formData) {
    setLoading(true);
    form.submit();
    Axios({
      headers: {
        [Constants.HEADER_TYPE.CONTENT_TYPE]: Constants.HEADER_CONTENTS.JSON,
        Authorization: window.localStorage.getItem(
          Constants.HEADER_CONTENTS.TOKEN
        ),
      },
      method: Constants.METHODS.PUT,
      url: config.apiHost + EDIT_CUSTOMER_DATA,
      data: formData,
    })
      .then((response) => {
        message.success(response);
      })
      .catch((err) => {
        message.error(err.message);
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
