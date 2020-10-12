import React, { Component } from "react";
// import jwt_decode from "jwt-decode";
import { findGameDetails } from "./GamesFunctions";
import "./GameDetails.css";

export default class GameDetails extends Component {
  constructor() {
    super();
    this.state = {
      creationDate: "",
      creationTime: "",
      creator: "",
      game_name: "",
      players: [],
    };
  }

  async componentDidMount() {
    if (!localStorage.usertoken) {
      this.props.history.push(`/login`);
    } else {
      // const token = localStorage.usertoken;
      // const decoded = jwt_decode(token);
      // this.setState({ creator: decoded.identity.email });
      await this.getGame_Id();
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
        this.setPlayersList();
      }
    });
  }

  setPlayersList() {
    const myDiv = document.getElementById("playersList");
    // console.log(this.state.players);
    this.state.players.forEach((player) => {
      myDiv.classList.add(
        "mainDiv",
        "d-flex",
        "flex-wrap"
        // "justify-content-between"
      );
      let playerImageDiv = document.createElement("div");
      playerImageDiv.classList.add("playerImage");
      let playerNameDiv = document.createElement("div");
      playerNameDiv.classList.add("text-center");
      playerNameDiv.innerText = player.first_name;
      let playerWrapper = document.createElement("div");
      playerWrapper.classList.add("d-flex", "flex-column", "playerWrapper");
      playerWrapper.appendChild(playerImageDiv);
      playerWrapper.appendChild(playerNameDiv);
      myDiv.appendChild(playerWrapper);
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="jumbotron mt-2">
              <h2 className="text-center">{this.state.game_name}</h2>
              <div className="GameImage"></div>
              <div className="GameCreator">
                Created by: {this.state.creator}
              </div>
            </div>
            <div>
              <h5>Players</h5>
              <div id="playersList"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
