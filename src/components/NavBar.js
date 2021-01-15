import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavBar = () => {
  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    // <div>
    //   <Link className="btn btn-secondary " onClick={handleLogout} to="/">
    //     Logout
    //   </Link>
    // </div>
    <Navbar bg="light" expand="lg">
      <img
        className="compass"
        src={process.env.PUBLIC_URL + "images/compass.png"}
        alt="Compass Rose"
      />
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav className="mr-auto">
          <NavDropdown
            title="menu"
            id="basic-nav-dropdown"
            className="Justify-content-center"
          >
            <NavDropdown.Item href="/trips">My Trips</NavDropdown.Item>
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

export default NavBar;
