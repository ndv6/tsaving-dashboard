import React from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Button } from "antd";
import "../styles/PageNotFound.css";
import Err from "../static/404.png";
import Logo from "../static/tsaving.png";
import Msg from "../static/message.png";
import Phone from "../static/phone.png";
import Fb from "../static/fb.png";

export default function PageNotFound() {
  const history = useHistory();
  function backHome() {
    history.push("/admin/login");
  }
  return (
    <div className="body">
      <div className="header">
        <Row>
          <Col span={24}>
            <h1>Oops !!</h1>
          </Col>
        </Row>
      </div>
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
              We Can't Seem to find <br />
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
            <br />
            Email
            <p>Customerservice@tsaving.com</p>
          </div>
        </Col>
        <Col span={8}>
          <div className="footer-icon">
            <img src={Fb} alt="" />
            <br />
            Facebook
            <p>Fanpage Tsaving Menjawab</p>
          </div>
        </Col>
        <Col span={8}>
          <div className="footer-icon">
            <img src={Phone} alt="" />
            <br />
            Phone
            <p>(022) 12345</p>
          </div>
        </Col>
      </Row>
    </div>
  );
}
