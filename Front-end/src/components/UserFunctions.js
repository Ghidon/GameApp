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
    .catch(function(error) {
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

export async function login(user, showErrorMessage, hideErrorMessage) {
  const response = await axios
    .post("users/login", {
      email: user.email,
      password: user.password,
    })
    .then(hideErrorMessage())
    .then((response) => {
      if (!response.data.error) {
        localStorage.setItem("usertoken", response.data.token);
        return response.data.token;
      } else {
        // console.log(response);
        showErrorMessage(response);
      }
    });
  return response;
}
