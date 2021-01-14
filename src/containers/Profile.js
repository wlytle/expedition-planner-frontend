import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

const Profile = () => {
  useEffect(() => {
    if (!localStorage.getItem("user")) return null;
    const id = localStorage.getItem("user").id;
    const token = localStorage.getItem("jwt");
    fetch(`http://localhost:3000/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((user) => {
        console.log(user);
      })
      .catch(console.log);
  });

  return (
    <Container>
      <Row>
        <Col>{"Edit profile stuff"}</Col>
        <Col>
          <h1>{"My Trips"}</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
