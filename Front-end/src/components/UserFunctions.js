import axios from "axios";

export async function register(newUser) {
  const response = await axios.post("users/register", {
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    email: newUser.email,
    password: newUser.password,
  });
  return response;
}

// export const register = (newUser) => {
//   return axios
//     .post("users/register", {
//       first_name: newUser.first_name,
//       last_name: newUser.last_name,
//       email: newUser.email,
//       password: newUser.password,
//     })
//     .then((response) => {
//       console.log("Registered"); // get back from result a successfull message
//     });
// };

export const login = (user) => {
  return axios
    .post("users/login", {
      email: user.email,
      password: user.password,
    })
    .then((response) => {
      localStorage.setItem("usertoken", response.data.token);
      return response.data.token;
    })
    .catch((err) => {
      console.log(err);
    });
};
