import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Profile from "./containers/Profile";
import EditProfile from "./components/EditProfile";
import NavBar from "./components/NavBar";
import MapContainer from "./containers/MapContainer";
import PageNotFound from "./components/PageNotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <NavBar />

      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/invites">
          <Profile />
        </Route>
        <Route exact path="/profile/edit">
          <EditProfile />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/trip">
          <MapContainer />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route path="/trip/:id" children={<MapContainer />} />
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
