import React from "react";
import { connect } from "react-redux";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import userEvent from "@testing-library/user-event";

const NavBar = ({ user }) => {
  const handleLogout = () => {
    localStorage.clear();
  };
  console.log(user);
  return (
    // <div>
    //   <Link className="btn btn-secondary " onClick={handleLogout} to="/">
    //     Logout
    //   </Link>
    // </div>
    <Navbar bg="light" expand="lg" sticky="top">
      <img
        className="compass"
        src={process.env.PUBLIC_URL + "images/compass.png"}
        alt="Compass Rose"
      />
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav className="mr-auto">
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
          <ion-icon name="person-outline"></ion-icon>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default connect((state) => ({ user: state.UserReducer.user }))(NavBar);
