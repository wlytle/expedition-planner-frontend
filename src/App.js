import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Profile from "./containers/Profile";
import NavBar from "./components/NavBar";
import MapContainer from "./containers/MapContainer";
import "./App.css";

function App() {
  return (
    <Router>
      <Route path="/">
        <NavBar />
      </Route>
      <Switch>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/trip">
          <MapContainer />
        </Route>
        <Route exact path="/">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
