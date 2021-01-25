import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, Container, Form, Card } from "react-bootstrap";
import { connect } from "react-redux";
import {
  signedIn,
  editUser,
  failedAuth,
  handleLogOut,
} from "../actions/UserActions";
import SubmitButton from "./SubmitButton";
import DeleteAlert from "../components/DeleteAlert";

const EditProfile = ({ user, editUser, failedAuth, error, handleLogOut }) => {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [show, setShow] = useState(false);
  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === passwordConfirmation) {
      const id = user.id;
      editUser(id, username, password);
    } else {
      failedAuth("Passords must match!");
    }
  };

  const deleteClicked = () => {
    setShow(true);
  };

  const handleDelete = () => {
    const id = user.id;
    const token = localStorage.getItem("jwt");
    fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `bearer ${token}`,
      },
    }).then(() => {
      localStorage.clear();
      handleLogOut();
      history.push("/");
    });
  };

  // if useState got set before redux state was loaded in set the suer naem to auto fill the form
  useEffect(() => {
    if (!user.id && !localStorage.getItem("userId")) {
      history.push("/login");
    } else if (user.id && !username) {
      setUsername(user.username);
    }
  });
  const inputClass = error ? "is-invalid" : "";
  return (
    <section>
      <Container className="min-vh-100">
        <DeleteAlert
          show={show}
          item={"profile"}
          deleteAction={handleDelete}
          closeAction={setShow}
        />
        <Row className=" min-vh-100">
          <Col
            id="login"
            md={{ span: 6, offset: 0 }}
            style={{ marginTop: "40px" }}
          >
            {" "}
            <Card>
              <Card.Img
                src={process.env.PUBLIC_URL + "images/grand-canyon.jpg"}
                alt="Grand Canyon"
              />
            </Card>{" "}
          </Col>
          <Col md={{ span: 4, offset: 1 }} style={{ marginTop: "40px" }}>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
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
                    <Form.Label className="form-label">New Password</Form.Label>
                    <Form.Control
                      className={inputClass}
                      type="password"
                      name="Password"
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPasswordConfirmation">
                    <Form.Label className="form-label">
                      Confirm New Password
                    </Form.Label>
                    <Form.Control
                      className={inputClass}
                      type="password"
                      name="passwordConfirmation"
                      placeholder="Password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />
                    <div className="invalid-feedback">{error}</div>
                  </Form.Group>

                  <SubmitButton btnTxt={"Update Profile"} />
                  <Button
                    variant="outline-danger form-btn"
                    type="button"
                    onClick={deleteClicked}
                  >
                    Delete Account
                  </Button>
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

export default connect(mapStateToProps, {
  signedIn,
  editUser,
  failedAuth,
  handleLogOut,
})(EditProfile);
