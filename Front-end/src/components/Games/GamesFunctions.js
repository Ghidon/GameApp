import axios from "axios";

export async function register(newUser, showErrorMessage, hideErrorMessage) {
  const response = await axios
    .post("users/register", {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      password: newUser.password,
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

export async function createGame(newGame, showErrorMessage, hideErrorMessage) {
  const response = await axios
    .post("games/createGame", {
      game_name: newGame.game_name,
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
