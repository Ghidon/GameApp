import React, { Component } from "react";
import jwt_decode from "jwt-decode";

export default class GameDetails extends Component {
  constructor() {
    super();
    this.state = {
      game_name: "",
      creator: "",
      players: "",
    };
  }

  componentDidMount() {
    if (!localStorage.usertoken) {
      this.props.history.push(`/login`);
    } else {
      const token = localStorage.usertoken;
      const decoded = jwt_decode(token);
      this.setState({ creator: decoded.identity.email });
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {" "}
            <div className="jumbotron mt-2">
              <h2 className="text-center">Game Name{this.state.game_name}</h2>
              <div className="profileImage"></div>
              <div className="text-center">Creator: {this.state.creator}</div>
              <div className="text-center">Players: {this.state.players}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
