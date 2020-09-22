import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Landing from "./components/Landing";
import Login from "./components/Account/Login";
import Register from "./components/Account/Register";
import Profile from "./components/Account/Profile";
import CreateGame from "./components/Games/CreateGame";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <NavBar />
          <Route exact path="/" component={Landing} />
          <div className="container-fluid">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/games/new" component={CreateGame} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
