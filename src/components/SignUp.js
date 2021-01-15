import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, Container, Form, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { signUp } from "../actions/UserActions";
import SubmitButton from "./SubmitButton";

const SignUp = ({ signUp, user, fetching }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp(username, password);
  };

  useEffect(() => {
    if (user.id) {
      history.push("/profile");
    }
  });

  return (
    <section>
      <Container className="min-vh-100">
        <Row className="align-items-center min-vh-100">
          <Col md={{ span: 3, offset: 5 }}>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      className="input"
                      type="text"
                      name="username"
                      placeholder="UserName"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label className="form-label">Password</Form.Label>
                    <Form.Control
                      className="input"
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPasswordConfirmation">
                    <Form.Label className="form-label">
                      Confirm Passowrd
                    </Form.Label>
                    <Form.Control
                      className="input"
                      type="password"
                      name="password_confirmation"
                      placeholder="Confirm Password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />
                  </Form.Group>
                  <SubmitButton btnTxt={"Create Account"} />
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
  };
};

export default connect(mapStateToProps, { signUp })(SignUp);
