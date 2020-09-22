import React, { Component } from "react";
import { createGame } from "./GamesFunctions";

export default class CreateGame extends Component {
  constructor() {
    super();
    this.state = {
      game_name: "",
      created: "",
      error: false,
      messageError: "",
      statusError: "",
    };
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto"></div>
        </div>
      </div>
    );
  }
}
