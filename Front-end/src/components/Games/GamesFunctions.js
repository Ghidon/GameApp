import axios from "axios";

// ##############################

export async function createGame(newGame, showErrorMessage, hideErrorMessage) {
  const response = await axios
    .post("/games/createGame", {
      game_name: newGame.game_name,
      creator: newGame.creator,
      players: newGame.players,
    })
    .then(hideErrorMessage())
    .catch(function (error) {
      if (error.response) {
        showErrorMessage(error.response.data, error.response.status);
        console.log(error.response.data);
        console.log(error.response.status);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
    });
  return response;
}

// ##############################

export async function addUserToGame(gameId, userEmail, showErrorMessage) {
  const response = await axios
    .patch("/games/details/" + gameId + "/" + userEmail)
    .catch(function (error) {
      if (error.response) {
        showErrorMessage(error.response.data);
        console.log(error.response.data);
        console.log(error.response.status);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
    });
  return response;
}

// ##############################

export async function findUserGames(email) {
  const response = await axios.get("/games/" + email).catch(function (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
  });
  return response;
}

// ##############################

export async function findGameDetails(id) {
  const response = await axios
    .get("/games/details/" + id)
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
    });
  return response;
}
