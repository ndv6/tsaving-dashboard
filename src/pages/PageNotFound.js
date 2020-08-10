import React from "react";
import { useHistory } from "react-router-dom";
import { Row, Col } from "antd";
import "../styles/PageNotFound.css";
import Err from "../static/404.png";
import Logo from "../static/tsaving.png";
import Msg from "../static/message.png";
import Phone from "../static/phone.png";
import Fb from "../static/fb.png";

import { Button } from "antd";

export default function PageNotFound() {
  const history = useHistory();
  function backHome() {
    history.push("/admin/login");
  }
  return (
    <div className="body">
      <Row>
        <Col span={24}>
          <div className="header">
            <h1>Oops !!</h1>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <div className="ErrorLogo">
            <img src={Err} alt="" />
          </div>
        </Col>
        <Col span={12}>
          <div className="logo">
            <img src={Logo} alt="" />
          </div>
          <div className="message">
            <p>
              We Can't Seem to find <br></br>
              the Page You're Looking For{" "}
            </p>
          </div>
          <Button type="danger" htmlType="submit" onClick={backHome}>
            Back Home
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <div className="footer-icon">
            <img src={Msg} alt="" />
            <br></br>
            Email
            <p>Customerservice@tsaving.com</p>
          </div>
        </Col>
        <Col span={8}>
          <div className="footer-icon">
            <img src={Fb} alt="" />
            <br></br>
            Facebook
            <p>Fanpage Tsaving Menjawab</p>
          </div>
        </Col>
        <Col span={8}>
          <div className="footer-icon">
            <img src={Phone} alt="" />
            <br></br>
            Phone
            <p>(022) 12345</p>
          </div>
        </Col>
      </Row>
    </div>
  );
}
