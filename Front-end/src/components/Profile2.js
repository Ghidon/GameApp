import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import "./Profile2.css";

class Profile2 extends Component {
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
      const token = localStorage.usertoken;
      const decoded = jwt_decode(token);
      this.setState({
        first_name: decoded.identity.first_name,
        last_name: decoded.identity.last_name,
        email: decoded.identity.email,
        created: decoded.identity.created,
      });
    } else {
      this.props.history.push(`/login`);
    }
  }

  render() {
    return (
      <div className="container">
        <div class="row">
          <div class="col-8 nero">col-8</div>
          <div class="col-4 nero">col-4</div>
        </div>
      </div>
    );
  }
}

export default Profile2;
