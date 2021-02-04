import React from "react";
import { Link } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";
import dragon from "../images/dragon.png";

const PageNotFound = () => {
  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 4 }}>
          <h1 className="error-title">Here be Dragons</h1>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 6, offset: 4 }}>
          <h4 className="error-title">404: Page Not Found </h4>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 6, offset: 4 }}>
          <img id="page-nf" src={dragon} alt="dragon"></img>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 6, offset: 4 }}>
          <Link to="/">
            <Button variant="outline-success" type="button" id="go-home-btn">
              GO BACK TO SAFETY
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default PageNotFound;
