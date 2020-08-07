import React from "react";
import Modal from "antd/lib/modal/Modal";

export default function EditProfileModal(visible, onOk, onCancel) {
  return (
    <Modal
      title="Edit Profile"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
    ></Modal>
  );
}
