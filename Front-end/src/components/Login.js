import React, { Component } from "react";
import { login } from "./UserFunctions";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: false,
      messageError: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (localStorage.usertoken) {
      this.props.history.push(`/profile`);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  showErrorMessage(res) {
    this.setState({
      error: true,
      messageError: res.data.error,
    });
  }
  hideErrorMessage() {
    this.setState({ error: false, messageError: "" });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password,
    };

    login(
      user,
      this.showErrorMessage.bind(this),
      this.hideErrorMessage.bind(this)
    ).then((res) => {
      if (res) {
        this.props.history.push(`/profile`);
      } else {
        console.log("error: Login Failed");
      }
    });
  }

  render() {
    const { error, messageError } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
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
                Sign in
              </button>
            </form>
            {error && (
              <div className="alert alert-light" role="alert">
                {messageError}
              </div> //May add a link to Login page from here if error
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
