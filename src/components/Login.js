import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Col, Row, Container, Form, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { signIn } from "../actions/UserActions";
import SubmitButton from "./SubmitButton";

const Login = ({ signIn, user, fetching, error }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(username, password);
  };

  useEffect(() => {
    if (user.id) {
      history.push("/profile");
    }
  });

  const inputClass = error ? "is-invalid" : "";
  return (
    <section>
      <Container className="min-vh-100">
        <Row className="align-items-center min-vh-100">
          <Col md={{ span: 3, offset: 5 }}>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicUsername">
                    <Form.Label className="form-label">Username</Form.Label>
                    <Form.Control
                      className={inputClass}
                      type="text"
                      name="username"
                      placeholder="UserName"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      className={inputClass}
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="invalid-feedback">{error}</div>
                  </Form.Group>

                  <SubmitButton fetching={fetching} btnTxt={"Log In"} />
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.UserReducer.user,
    fetching: state.UserReducer.fetching,
    error: state.UserReducer.error,
  };
};

export default connect(mapStateToProps, { signIn })(Login);
