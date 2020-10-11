import React, { Component } from "react";
// import jwt_decode from "jwt-decode";
import { findGameDetails } from "./GamesFunctions";

export default class GameDetails extends Component {
  constructor() {
    super();
    this.state = {
      game_name: "",
      creator: "",
      players: [],
      creationDate: "",
      creationTime: "",
    };
  }

  componentDidMount() {
    if (!localStorage.usertoken) {
      this.props.history.push(`/login`);
    } else {
      // const token = localStorage.usertoken;
      // const decoded = jwt_decode(token);
      // this.setState({ creator: decoded.identity.email });
      this.getGame_Id();
    }
  }

  getGame_Id() {
    let urlParams = new URLSearchParams(window.location.search);
    let game_Id = urlParams.get("ID");
    findGameDetails(game_Id).then((res) => {
      if (res === undefined) {
        console.log("error: Game was not found");
      } else {
        let game = res.data[0];
        let date = game.created.split(/(?<=^\S+)\s/);
        this.setState({
          game_name: game.game_name,
          creator: game.creator,
          players: game.players,
          creationDate: date[0],
          creationTime: date[1],
        });
      }
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {" "}
            <div className="jumbotron mt-2">
              <h2 className="text-center">{this.state.game_name}</h2>
              <div className="profileImage"></div>
              <div className="text-center">
                Created by: {this.state.creator}
              </div>
              <div className="text-center">Players: {this.state.players}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
