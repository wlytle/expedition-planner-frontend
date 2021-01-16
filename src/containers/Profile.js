import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import EditProfile from "../components/EditProfile";
import { signedIn } from "../actions/UserActions";

const Profile = ({ user }) => {
  let history = useHistory();

  // if the user prop isn't declared check local storage
  user = user.id
    ? user
    : {
        id: localStorage.getItem("userId"),
        username: localStorage.getItem("username"),
      };

  useEffect(() => {
    if (user.id) {
      signedIn(user);
    } else {
      history.push("/");
    }
  });

  return (
    <Container>
      <Row>
        <Col>
          {"Edit profile stuff"}
          <h1>{user?.username}</h1>
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
