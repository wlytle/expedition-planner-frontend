import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import EditProfile from "../components/EditProfile";
import Trips from "../components/Trips";
import { signedIn } from "../actions/UserActions";
import { getInvites, getTrips } from "../actions/TripActions";

const Profile = ({
  user,
  fetched,
  allTrips,
  signedIn,
  getTrips,
  getInvites,
}) => {
  let history = useHistory();

  useEffect(() => {
    //No user signd in but session in local storage sign user in
    if (!user.id && localStorage.getItem("userId")) {
      signedIn({
        id: localStorage.getItem("userId"),
        username: localStorage.getItem("username"),
      });
      // Load all the user's trips into state
      if (!fetched) {
        getTrips();
        getInvites();
      }
      //no user or session rdirect to login page
    } else if (!user.id && !localStorage.getItem("userId")) {
      history.push("/login");
    } else if (!fetched) {
      // Load all the user's trips into state
      getTrips();
      getInvites();
    }
  });

  return (
    <Container>
      {/* <EditProfile /> */}
      <Row>
        <h1 className="d-flex align-items-center justify-content-center">
          {"My Trips"}
        </h1>
      </Row>
      <Row>
        <Col>
          <Trips />
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.UserReducer.user,
    allTrips: state.TripReducer.allTrips,
    fetched: state.TripReducer.fetched,
  };
};

export default connect(mapStateToProps, { signedIn, getTrips, getInvites })(
  Profile
);
