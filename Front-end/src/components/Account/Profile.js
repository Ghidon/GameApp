import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
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
    };
  }

  componentDidMount() {
    if (localStorage.usertoken) {
      this.setUserDetails();
      //check games for a game with user email in either Creator or Player's Array
      //If there is a Match, Show the name of the Game in Active Games section
    } else {
      this.props.history.push(`/login`);
    }
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
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            {" "}
            <div className="jumbotron mt-2">
              <h2 className="text-center">PROFILE</h2>

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
                <Link to="/games/new" className="nav-link">
                  <button type="button" className="btn btn-outline-primary">
                    Create a New Game
                  </button>
                </Link>
              </div>
            </div>
            <div className="jumbotron">
              <div className="d-flex justify-content-between">
                <h5>No Active Games for now</h5>
              </div>
            </div>
            {/* If no active game present, state games is empty, then show a message "No Active Games for now" */}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Profile);
