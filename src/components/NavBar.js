import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { signedIn } from "../actions/UserActions";
import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
  DropdownButton,
} from "react-bootstrap";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";

const NavBar = ({ user, signedIn }) => {
  const handleLogout = () => {
    localStorage.clear();
  };

  const location = useLocation();

  useEffect(() => {
    //No user signd in but session in local storage sign user in
    if (!user.id && localStorage.getItem("userId")) {
      signedIn({
        id: localStorage.getItem("userId"),
        username: localStorage.getItem("username"),
      });
    }
  });

  // sett the far right of  the nav bar bassed on location
  const setNavEnd = () => {
    switch (location.pathname) {
      case "/login":
        return (
          <Button href="/signup" variant="outline-success">
            <strong>Sign Up</strong>
          </Button>
        );
      case "/signup":
        return (
          <Button href="/login" className="form-btn" variant="outline-success">
            <strong>Log In</strong>
          </Button>
        );
      default:
        return (
          <Nav className="mr-auto">
            <strong>
              <NavDropdown
                title={user.username ? user.username : "menu"}
                id="basic-nav-dropdown"
                align="right"
              >
                <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/login" onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </strong>
            <ion-icon className="dropdown" name="person-outline"></ion-icon>
          </Nav>
        );
    }
  };

  return (
    <Navbar id="nav-bar" bg="light" expand="lg" sticky="top">
      <Navbar.Brand href="/profile">
        <img
          className="compass"
          src={process.env.PUBLIC_URL + "images/compass.png"}
          alt="Compass Rose"
        />
        Bushwhacker!
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        {setNavEnd()}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default connect((state) => ({ user: state.UserReducer.user }), {
  signedIn,
})(NavBar);
