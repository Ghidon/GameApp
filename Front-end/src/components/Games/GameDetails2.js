import React, { useState, useEffect } from "react";
import { findUser } from "../Account/UserFunctions";
import { useHistory } from "react-router-dom";
import AddPlayerToGame from "../Games/AddPlayerToGame";
import jwt_decode from "jwt-decode";
import "./GameDetails.css";
import { GamePlayersList } from "./GamePlayersList";

import {
  findGameDetails,
  removeUserFromGame,
  removeGame,
} from "./GamesFunctions";

export const GameDetails2 = () => {
  const history = useHistory();
  const [current_user, setCurrent_user] = useState("");
  const [game_id, setGame_id] = useState(0);
  const [game_name, setGame_name] = useState("");
  const [creator, setCreator] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [players, setPlayers] = useState([]);
  const [creationDate, setCreationDate] = useState("");
  const [creationTime, setCreationTime] = useState("");
  const [error, setError] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [messageSuccess, setMessageSuccess] = useState("");

  useEffect(() => {
    if (!localStorage.usertoken) {
      history.push({ pathname: "/login" });
    } else {
      const token = localStorage.usertoken;
      const decoded = jwt_decode(token);
      setCurrent_user(decoded.identity.email);
      let urlParams = new URLSearchParams(window.location.search);
      let game_Id = urlParams.get("ID");
      setGame_id(game_Id);
      findGameDetails(game_Id).then((res) => {
        let game = res.data[0];
        let date = game.created.split(/(?<=^\S+)\s/);
        setGame_name(game.game_name);
        setCreator(game.creator);
        setPlayers(game.players);
        setCreationDate(date[0]);
        setCreationTime(date[1]);
      });
      findUser(creator).then((res) => {
        if (res === undefined) {
          console.log("error: Creator was not found");
        } else {
          setCreatorName(res.data[0].first_name);
        }
      });
    }
  }, [creator, history]);

  const showErrorMessage = (data) => {
    setError(true);
    setMessageError(data.message);
  };

  const removePlayerFromGame = (playerEmail) => {
    removeUserFromGame(game_id, playerEmail, showErrorMessage).then((res) => {
      if (res === undefined) {
        console.log("error: Game was not updated");
      } else {
        setMessageSuccess(res.data.message);
      }
    });
    setPlayers([...players.filter((player) => player.email !== playerEmail)]);
  };

  const deleteThisGame = () => {
    removeGame(game_id, showErrorMessage).then((res) => {
      if (res === undefined) {
        console.log("error: Game was not updated");
      } else {
        setMessageSuccess(res.data.message);
      }
    });
    history.push({ pathname: "/profile" });
  };

  const playerLeaveGame = () => {
    removeUserFromGame(game_id, current_user, showErrorMessage).then((res) => {
      if (res === undefined) {
        console.log("error: Game was not updated");
      } else {
        setMessageSuccess(res.data.message);
      }
    });
    history.push({ pathname: "/profile" });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="jumbotron mt-2">
            <h2 className="text-center">{game_name}</h2>
            <div className="GameImage"></div>
            <div className="d-flex justify-content-between bottom-wrapper">
              <div className="GameCreator">Created by: {creatorName}</div>
              {/* Do not Show if user in not Creator */}
              {current_user === creator ? (
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={deleteThisGame}
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
                  onClick={playerLeaveGame}
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

            <div id="playersList" className="mainDiv d-flex flex-wrap">
              {players.map((player) => (
                <GamePlayersList
                  playerDetails={player}
                  creator={creator}
                  current_user={current_user}
                  GameDetailsRemovePlayer={removePlayerFromGame}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
