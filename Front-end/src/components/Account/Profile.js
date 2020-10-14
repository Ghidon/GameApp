import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { findUserGames } from "../Games/GamesFunctions";
import CreateGame from "../Games/CreateGame";
import jwt_decode from "jwt-decode";
import "./Profile.css";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      created: "",
      no_games: false,
    };
  }

  async componentDidMount() {
    if (localStorage.usertoken) {
      await this.setUserDetails();
      this.setGameDetails();      
    } else {
      this.props.history.push(`/login`);
    }
  }

  setGameDetails() {
    findUserGames(this.state.email).then((res) => {
      if (res === undefined) {
        console.log("error: Could not retrieve games");
      } else {
        const gamesList = res.data;
        // console.log(gamesList);
        if (gamesList.length < 1) {
          this.setState({ no_games: true });
        } else {
          this.setState({ no_games: false });
          const myDiv = document.getElementById("gamesList");
          gamesList.forEach((game) => {
            let gameName = game.game_name;
            let gameId = game._id;
            myDiv.classList.add(
              "mainDiv",
              "d-flex",
              "flex-wrap",
              "justify-content-between"
            );

            let gameNameDiv = document.createElement("div");
            gameNameDiv.classList.add("gameTitle", "d-flex", "flex-column");

            let gameImage = document.createElement("div");
            gameImage.classList.add("gameImage");
            let gameNameLink = document.createElement("a");
            gameNameLink.href = "/games/details?ID=" + gameId;
            let gameRoleDiv = document.createElement("span");
            gameRoleDiv.classList.add("roleClass");

            let role;
            if (game.creator === this.state.email) {
              gameRoleDiv.classList.add("creator");
              role = "Creator";
              //maybe add a role in the state?
            } else {
              gameRoleDiv.classList.add("player");
              role = "Player";
              //maybe add a role in the state?cd 
            }
            gameNameLink.innerText = gameName;
            gameRoleDiv.innerText = role;

            gameNameDiv.appendChild(gameImage);
            gameNameDiv.appendChild(gameNameLink);
            gameNameDiv.appendChild(gameRoleDiv);
            myDiv.appendChild(gameNameDiv);
          });
        }
      }
    });
  }

  setUserDetails() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    this.setState({
      first_name: decoded.identity.first_name,
      last_name: decoded.identity.last_name,
      email: decoded.identity.email,
      created: decoded.identity.created,
    });
  }

  render() {
    const { no_games } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            {" "}
            <div className="jumbotron mt-2">
              <h2 className="text-center">PROFILE</h2>
              <div className="profileImage"></div>

              <table className="table">
                <tbody>
                  <tr>
                    <td>First Name</td>
                    <td>{this.state.first_name}</td>
                  </tr>
                  <tr>
                    <td>Last Name</td>
                    <td>{this.state.last_name}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{this.state.email}</td>
                  </tr>
                  <tr>
                    <td>Member since</td>
                    <td>{this.state.created}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-8">
            {" "}
            <div className="jumbotron mt-2">
              <div className="d-flex justify-content-between">
                <h2 className="">Active Games</h2>
                {no_games ? (
                  <div></div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    data-toggle="modal"
                    data-target="#createGameModal"
                  >
                    Create a New Game
                  </button>
                )}
                <div
                  className="modal fade"
                  id="createGameModal"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="createGameModalTitle"
                  aria-hidden="true"
                >
                  <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                  >
                    <CreateGame />
                  </div>
                </div>
              </div>
            </div>
            <div className="jumbotron">
              {no_games ? (
                <div className="d-flex justify-content-between">
                  <h4>There is no active game at the moment</h4>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target="#createGameModal"
                  >
                    Create a New Game
                  </button>
                </div>
              ) : (
                <div className="d-flex justify-content-between">
                  <div id="gamesList"></div>
                </div>
              )}
            </div>
            {/* If no active game present, state games is empty, then show a message "No Active Games for now" */}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Profile);
