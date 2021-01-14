import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Profile from "./components/Profile";
import "./App.css";

function App() {
  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <Router>
      <Link className="btn btn-secondary " onClick={handleLogout} to="/">
        Logout
      </Link>
      <Switch>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
