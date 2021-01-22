import React, { useEffect } from "react";
import { connect } from "react-redux";
import { signedIn } from "../actions/UserActions";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const NavBar = ({ user, signedIn }) => {
  const handleLogout = () => {
    localStorage.clear();
  };

  useEffect(() => {
    //No user signd in but session in local storage sign user in
    if (!user.id && localStorage.getItem("userId")) {
      signedIn({
        id: localStorage.getItem("userId"),
        username: localStorage.getItem("username"),
      });
    }
  });

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
        <Nav className="mr-auto">
          <strong>
            <NavDropdown
              title={user.username ? user.username : "menu"}
              id="basic-nav-dropdown"
              className="Justify-content-center"
            >
              <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/" onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </strong>
          <ion-icon name="person-outline"></ion-icon>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default connect((state) => ({ user: state.UserReducer.user }), {
  signedIn,
})(NavBar);
