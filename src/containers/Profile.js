import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import EditProfile from "../components/EditProfile";
import { Edit } from "leaflet";
import { signedIn } from "../actions/UserActions";

const Profile = ({ user }) => {
  console.log(user);
  useEffect(() => {
    signedIn(localStorage.getItem("user"));
  });
  return (
    <Container>
      <Row>
        <Col>
          {"Edit profile stuff"}
          <h1>{user?.user_name}</h1>
          <EditProfile />
        </Col>
        <Col>
          <h1>{"My Trips"}</h1>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return { user: state.UserReducer.user };
};

export default connect(mapStateToProps, signedIn)(Profile);
