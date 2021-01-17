import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import EditProfile from "../components/EditProfile";
import Trips from "../components/Trips";
import { signedIn } from "../actions/UserActions";

const Profile = ({ user, signedIn }) => {
  let history = useHistory();

  useEffect(() => {
    //No user signd in but session in local storage sign user in
    if (!user.id && localStorage.getItem("userId")) {
      signedIn({
        id: localStorage.getItem("userId"),
        username: localStorage.getItem("username"),
      });
      //no user or session rdirect to login page
    } else if (!user.id && !localStorage.getItem("userId")) {
      history.push("/");
    }
  });

  return (
    <Container>
      <Row>
        <Col sm={4}>
          {"Edit profile stuff"}
          <h1>{user?.username}</h1>
          <EditProfile />
        </Col>
        <Col>
          <h1>{"My Trips"}</h1>
          <Trips />
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return { user: state.UserReducer.user };
};

export default connect(mapStateToProps, { signedIn })(Profile);
