import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import {
  findGameDetails,
  removeUserFromGame,
  removeGame,
} from "./GamesFunctions";
import { findUser } from "../Account/UserFunctions";
import AddPlayerToGame from "../Games/AddPlayerToGame";
import "./GameDetails.css";

export default class GameDetails extends Component {
  constructor() {
    super();
    this.state = {
      creationDate: "",
      creationTime: "",
      error: false,
      messageError: "",
      creator: "",
      creator_name: "",
      game_name: "",
      gameID: "",
      players: [],
      current_user: "",
    };
    this.playerLeaveGame = this.playerLeaveGame.bind(this);
    this.deleteThisGame = this.deleteThisGame.bind(this);
  }

  async componentDidMount() {
    if (!localStorage.usertoken) {
      this.props.history.push(`/login`);
    } else {
      const token = localStorage.usertoken;
      const decoded = jwt_decode(token);
      this.setState({ current_user: decoded.identity.email });
      await this.getGame_Id();
    }
  }

  getGame_Id() {
    let urlParams = new URLSearchParams(window.location.search);
    let game_Id = urlParams.get("ID");
    this.setState({ gameID: game_Id });
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
        this.setPlayersList(game.players);
        this.setCreatordetails();
      }
    });
  }

  setPlayersList(players) {
    const myDiv = document.getElementById("playersList");
    // console.log(players);
    players.forEach((player) => {
      myDiv.classList.add("mainDiv", "d-flex", "flex-wrap");
      let playerImageDiv = document.createElement("div");
      playerImageDiv.classList.add("playerImage");
      let pEmail = player.email;

      if (this.state.current_user === this.state.creator) {
        let con = document.createElement("div");
        con.classList.add("con-tooltip", "right");
        let removePlayer = document.createElement("span");
        removePlayer.innerText = "X";
        removePlayer.onclick = () => {
          removeUserFromGame(
            this.state.gameID,
            pEmail,
            this.showErrorMessage.bind(this)
          )
            .then((res) => {
              if (res === undefined) {
                console.log("error: Game was not updated");
              } else {
                this.setState({ messageSuccess: res.data.message });
              }
            })
            .then((document.getElementById("playersList").innerHTML = ""))
            .then(
              this.setState({
                players: [
                  ...this.state.players.filter(
                    (player) => player.email !== pEmail
                  ),
                ],
              })
            )

            .then(this.setPlayersList(this.state.players));
        };

        removePlayer.classList.add("removePlayer");
        let tool = document.createElement("div");
        tool.classList.add("tooltip");
        let orientation = document.createElement("span");
        orientation.innerText = "Remove player";
        tool.appendChild(orientation);
        con.appendChild(removePlayer);
        con.appendChild(tool);
        playerImageDiv.appendChild(con);
      }

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

  showErrorMessage(data, status) {
    this.setState({
      error: true,
      messageError: data.message,
    });
  }

  playerLeaveGame() {
    let playerEmail = this.state.current_user;
    let game_Id = this.state.gameID;
    console.log(game_Id);
    removeUserFromGame(game_Id, playerEmail, this.showErrorMessage.bind(this))
      .then((res) => {
        if (res === undefined) {
          console.log("error: Game was not updated");
        } else {
          this.setState({ messageSuccess: res.data.message });
        }
      })
      .then(this.componentDidMount());
  }

  deleteThisGame() {
    let game_Id = this.state.gameID;
    console.log(game_Id);
    removeGame(game_Id, this.showErrorMessage.bind(this)).then((res) => {
      if (res === undefined) {
        console.log("error: Game was not updated");
      } else {
        this.setState({ messageSuccess: res.data.message });
      }
    });
    this.props.history.push(`/profile`);
  }

  render() {
    const {
      current_user,
      creator,
      error,
      messageError,
      messageSuccess,
    } = this.state;
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
                {/* Do not Show if user in not Creator */}
                {current_user === creator ? (
                  <div>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={this.deleteThisGame}
                    >
                      Delete Game
                    </button>
                    <button
                      type="button"
                      style={{ marginLeft: "10px" }}
                      className="btn btn-outline-primary"
                      data-toggle="modal"
                      data-target="#addPlayerToGameModal"
                    >
                      Add a Player
                    </button>
                    <div
                      className="modal fade"
                      id="addPlayerToGameModal"
                      tabIndex="-1"
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
                ) : (
                  <button
                    type="button"
                    onClick={this.playerLeaveGame}
                    className="btn btn-outline-danger"
                  >
                    Leave this Game
                  </button>
                )}
                {/* Do not Show if user in not Creator */}
              </div>
            </div>
            <div>
              {error ? (
                <div className="alert alert-light" role="alert">
                  {messageError}
                </div>
              ) : (
                <div className="alert alert-light" role="alert">
                  {messageSuccess}
                </div>
              )}
              <h5>Players</h5>

              <div id="playersList"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
