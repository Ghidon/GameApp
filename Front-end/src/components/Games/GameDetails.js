import React, { Component } from "react";
// import jwt_decode from "jwt-decode";
import { findGameDetails, findUser } from "./GamesFunctions";
import AddPlayerToGame from "../Games/AddPlayerToGame";
import "./GameDetails.css";

export default class GameDetails extends Component {
  constructor() {
    super();
    this.state = {
      creationDate: "",
      creationTime: "",
      creator: "",
      creator_name: "",
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
        this.setCreatordetails();
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

  setCreatordetails() {
    let creator_email = this.state.creator;
    findUser(creator_email).then((res) => {
      if (res === undefined) {
        console.log("error: Creator was not found");
      } else {
        // res.data[0] = whole creator details
        this.setState({ creator_name: res.data[0].first_name });
      }
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
              <div className="d-flex justify-content-between bottom-wrapper">
                <div className="GameCreator">
                  Created by: {this.state.creator_name}
                </div>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  data-toggle="modal"
                  data-target="#addPlayerToGameModal"
                >
                  Add a Player
                </button>
                <div
                  className="modal fade"
                  id="addPlayerToGameModal"
                  tabindex="-1"
                  role="dialog"
                  aria-labelledby="addPlayerToGameModalTitle"
                  aria-hidden="true"
                >
                  <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                  >
                    <AddPlayerToGame />
                  </div>
                </div>
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
