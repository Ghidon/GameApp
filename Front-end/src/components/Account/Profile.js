import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { findUserGames } from "../Games/GamesFunctions";
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

  async componentDidMount() {
    if (localStorage.usertoken) {
      await this.setUserDetails();
      this.setGameDetails();
      //check games for a game with user email in either Creator or Player's Array
      //If there is a Match, Show the name of the Game in Active Games section
      //else show a message "No active Games yet"
    } else {
      this.props.history.push(`/login`);
    }
  }

  setGameDetails() {
    // console.log(this.state.email);
    findUserGames(this.state.email).then((res) => {
      if (res === undefined) {
        console.log("error: Could not retrieve games");
      } else {
        console.log(res.data);
        //need to use this to loop over the results and post in the DOM the list of Games
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
                <h5>No Active Games yet</h5>
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
