import React, { Component } from "react";
import { register, login } from "./UserFunctions";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      error: false,
      messageError: "",
      statusError: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
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

  onSubmit(e) {
    e.preventDefault();

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
        console.log("error: Email already registered");
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
  }

  render() {
    const { loading, error, messageError, statusError } = this.state;

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
