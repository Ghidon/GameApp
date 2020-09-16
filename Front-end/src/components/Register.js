import React, { Component } from "react";
import { register, login } from "./UserFunctions";

const initialState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  error: false,
  messageError: "",
  statusError: "",
  nameError: "",
  lastError: "",
  emailError: "",
  passwordError: "",
};

class Register extends Component {
  constructor() {
    super();
    this.state = initialState;

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ messageError: "" });
    this.setState({ [e.target.name]: e.target.value });
  }
  showErrorMessage(data, status) {
    this.setState({
      error: true,
      messageError: data.message,
      statusError: status,
    });
  }
  hideErrorMessage() {
    this.setState({ error: false, messageError: "", statusError: "" });
  }

  validate = () => {
    let nameError = "";
    let lastError = "";
    let emailError = "";
    let passwordError = "";

    if (!this.state.first_name) {
      nameError = "Please type your first name";
    }
    if (!this.state.last_name) {
      lastError = "Please type your last name";
    }
    const passVal = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passVal.test(this.state.password)) {
      passwordError =
        "Password must have minimum eight characters, at least one uppercase letter, one lowercase letter and one number";
    }

    const emailVal = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailVal.test(this.state.email)) {
      emailError = "Please type a valid email address";
    }

    if (emailError || nameError || lastError || passwordError) {
      this.setState({ emailError, nameError, lastError, passwordError });
      return false;
    }
    return true;
  };

  onSubmit(e) {
    e.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      const newUser = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password,
      };

      register(
        newUser,
        this.showErrorMessage.bind(this),
        this.hideErrorMessage.bind(this)
      ).then((res) => {
        if (res === undefined) {
          console.log("error: Registration failed");
        } else {
          const user = {
            email: this.state.email,
            password: this.state.password,
          };
          login(user).then((res) => {
            this.props.history.push(`/profile`);
          });
        }
      });
      this.setState(initialState);
    }
  }

  render() {
    const { error, messageError } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Register</h1>
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  placeholder="Enter First Name"
                  value={this.state.first_name}
                  onChange={this.onChange}
                />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.nameError}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  placeholder="Enter Last Name"
                  value={this.state.last_name}
                  onChange={this.onChange}
                />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.lastError}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter Email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.emailError}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Enter Password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.passwordError}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Register
              </button>
            </form>
            {error && (
              <div class="alert alert-light" role="alert">
                {messageError}
              </div> //May add a link to Login page from here if error
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
