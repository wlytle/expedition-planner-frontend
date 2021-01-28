import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { signedIn, handleLogOut } from "../actions/UserActions";
import {
  getInvites,
  clearTrip,
  showElevation,
  elevationAnimation,
  unFetch,
} from "../actions/TripActions";
import { Navbar, Nav, NavDropdown, Button, Dropdown } from "react-bootstrap";
import compass from "../images/compass.png";

const NavBar = ({
  user,
  signedIn,
  getInvites,
  invites,
  handleLogOut: logout,
  clearTrip,
  trip,
  showElevation,
  elevationAnimation,
  elevation,
  unFetch,
}) => {
  const handleLogout = () => {
    //Clear trip out of state
    clearTrip();
    localStorage.clear();
    logout();
    history.push("/login");
  };
  // get the end point of the url
  const location = useLocation();

  //set up hsitroy items
  let history = useHistory();

  //set state for showind nav dropdown
  const [show, setShow] = useState(false);

  //Handle clicks to the navigatin dropdown
  const handleNavClick = (route) => {
    //if navigating to the profile clear our the trip field in app state to set up next visit to maps page
    if (!route.includes("/trip")) clearTrip();
    unFetch(false);
    history.push(route);
    setShow(!show);
    if (elevation) showElevation();
  };

  const handleElevationClick = () => {
    if (!elevation) {
      showElevation();
      setTimeout(() => {
        elevationAnimation();
      }, 100);
    } else {
      elevationAnimation();
      setTimeout(() => {
        showElevation();
      }, 1020);
    }
  };

  useEffect(() => {
    //No user signd in but session in local storage sign user in
    if (!user.id && localStorage.getItem("userId")) {
      signedIn({
        id: localStorage.getItem("userId"),
        username: localStorage.getItem("username"),
      });
      getInvites();
    }
  }, [invites, getInvites, signedIn, user.id]);

  // sett the far right of  the nav bar bassed on location
  const setNavEnd = () => {
    switch (location.pathname) {
      case "/login":
        return (
          <Button href="/signup" variant="outline-dark">
            <strong>Sign Up</strong>
          </Button>
        );
      case "/signup":
        return (
          <Button href="/login" className="form-btn" variant="outline-dark">
            <strong>Log In</strong>
          </Button>
        );
      default:
        return (
          <Nav className="mr-auto">
            {location.pathname.includes("/trip") && trip.locations?.length ? (
              <ion-icon
                onClick={handleElevationClick}
                id="ele"
                name="analytics-outline"
              ></ion-icon>
            ) : null}
            {/* if ther are invites render a badge and add invites to drop down */}
            {invites.length ? (
              <Dropdown>
                <Dropdown.Toggle
                  roll="menu"
                  id="invites-dropdown"
                  className="dropdown-toggle"
                >
                  <span className="fa-stack" data-count={invites.length}>
                    <ion-icon id="notification" name="notifications-outline">
                      {" "}
                    </ion-icon>
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {invites.map((i) => (
                    <Dropdown.Item
                      key={i.id}
                      onClick={() => handleNavClick(`/invites#${i.id}`)}
                    >
                      {i.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Dropdown>
                <Dropdown.Toggle
                  roll="menu"
                  id="invites-dropdown"
                  className="dropdown-toggle"
                >
                  <ion-icon id="notification" name="notifications-outline">
                    {" "}
                  </ion-icon>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>You don't have any invites</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}

            <Dropdown>
              <Dropdown.Toggle
                roll="menu"
                id="profile-dropdown"
                className="dropdown-toggle"
              >
                <strong>{user.username}</strong>
                <ion-icon name="person-outline"></ion-icon>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  className="dropdown-item"
                  onClick={() => handleNavClick("/profile")}
                >
                  My Profile
                </Dropdown.Item>

                <Dropdown.Item
                  className="nav-Dropdown.Item"
                  onClick={() => handleNavClick("/profile/edit")}
                >
                  Edit Profile
                </Dropdown.Item>

                <NavDropdown.Divider />
                <Dropdown.Item
                  className="nav-link"
                  to="/login"
                  onClick={handleLogout}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        );
    }
  };

  return (
    <Navbar id="nav-bar" bg="light" expand="lg" sticky="top">
      <Navbar.Brand href="/profile">
        <img className="compass" src={compass} alt="Compass Rose" />
        Bushwhacker!
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        {setNavEnd()}
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.UserReducer.user,
    invites: state.TripReducer.invites,
    trip: state.TripReducer.trip,
    elevation: state.TripReducer.elevation,
  };
};

export default connect(mapStateToProps, {
  signedIn,
  getInvites,
  handleLogOut,
  clearTrip,
  showElevation,
  elevationAnimation,
  unFetch,
})(NavBar);
