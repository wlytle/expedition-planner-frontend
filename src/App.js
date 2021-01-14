import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import "./App.css";

function App() {
  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <div>
      <button className="button" onClick={handleLogout}>
        Logout
      </button>
      <Router>
        <Switch>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/">
            <SignUp />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
