import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Col, Row, Container, Form, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { signUp, failedAuth } from "../actions/UserActions";
import { validateForm } from "../helpers";
import SubmitButton from "./SubmitButton";

const SignUp = ({ signUp, user, failedAuth, error }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  let history = useHistory();
  let allErrors = "",
    usernameErrors = "",
    passwordErrors = "";

  //set class  names to properly dispaly errors
  if (errors?.all) {
    allErrors = "is-invalid";
  } else if (errors?.username) {
    usernameErrors = "is-invalid";
  } else if (errors?.password) {
    passwordErrors = "is-invalid";
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(
      validateForm(username, password, passwordConfirmation, failedAuth)
    );
    debugger;
    if (errors?.none) signUp(username, password, passwordConfirmation);
  };

  useEffect(() => {
    if (user.id) {
      history.push("/profile");
    }
  });

  return (
    <section>
      <Container className="min-vh-100">
        <Row className="min-vh-100">
          <Col
            id="login"
            md={{ span: 6, offset: 0 }}
            style={{ marginTop: "40px" }}
          >
            {" "}
            <Card>
              <Card.Img
                src={process.env.PUBLIC_URL + "images/citadel-crop.jpg"}
                alt="Nevada Sajama"
              />
            </Card>{" "}
          </Col>
          <Col md={{ span: 4, offset: 1 }} style={{ marginTop: "40px" }}>
            <Card>
              <Card.Body>
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      className={`${allErrors} ${usernameErrors}`}
                      type="text"
                      name="username"
                      placeholder="UserName"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {usernameErrors ? (
                      <div className="invalid-feedback">{error}</div>
                    ) : null}
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label className="form-label">Password</Form.Label>
                    <Form.Control
                      className={`${allErrors} ${passwordErrors}`}
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
                      className={`${allErrors} ${passwordErrors}`}
                      type="password"
                      name="password_confirmation"
                      placeholder="Confirm Password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />
                    {allErrors || passwordErrors ? (
                      <div className="invalid-feedback">{error}</div>
                    ) : null}
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
    error: state.UserReducer.error,
  };
};

export default connect(mapStateToProps, { signUp, failedAuth })(SignUp);
