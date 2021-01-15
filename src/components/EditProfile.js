import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, Container, Form, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { signedIn } from "../actions/UserActions";

const EditProfile = ({ user }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = user.id;
    const token = localStorage.getItem("jwt");
    fetch(`http://localhost:3000/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify({
        user: {
          user_name: username,
          password: password,
        },
      }),
    })
      .then((r) => r.json())
      .then((user) => {
        localStorage.setItem("jwt", user.jwt);
        localStorage.setItem("user", user);
        signedIn(user);
        history.push("/profile");
      });
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
      signedIn(user);
      history.push("/");
    });
  };

  return (
    <section>
      <Container className="min-vh-100">
        <Row className="align-items-center min-vh-100">
          <Col>
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
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      className="input"
                      type="password"
                      name="Password"
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPasswordConfirmation">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      className="input"
                      type="password"
                      name="passwordConfirmation"
                      placeholder="Password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Edit Account
                  </Button>
                  <Button variant="danger" type="button" onClick={handleDelete}>
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

export default connect((state) => ({ user: state.UserReducer.user }), {
  signedIn,
})(EditProfile);
