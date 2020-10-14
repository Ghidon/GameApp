import React, { Component } from "react";
import { addUserToGame } from "./GamesFunctions";
// import jwt_decode from "jwt-decode";

export default class AddPlayerToGame extends Component {
  constructor() {
    super();
    this.state = {
      player_email: "",
      error: false,
      messageError: "",
      messageSuccess: "",
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (!localStorage.usertoken) {
      this.props.history.push(`/login`);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value, error: false, messageSuccess: "" });
  }

  showErrorMessage(data) {
    this.setState({
      error: true,
      messageError: data.message,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    let urlParams = new URLSearchParams(window.location.search);
    let game_id = urlParams.get("ID");
    let userEmail = this.state.player_email;
    addUserToGame(game_id, userEmail, this.showErrorMessage.bind(this)).then(
      (res) => {
        if (res === undefined) {
          console.log("error: Creator was not found");
        } else {
          console.log(res.data.message);
          this.setState({ messageSuccess: res.data.message });
        }
      }
    );
  }

  render() {
    const { error, messageError, messageSuccess } = this.state;

    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="addPlayerToGameModal">
            Add a player to your Chronicle
          </h5>
          <button
            id="closeButton"
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form noValidate onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                name="player_email"
                placeholder="Insert player's email"
                value={this.state.player_email}
                onChange={this.onChange}
              />
            </div>
            {error ? (
              <div className="alert alert-light" role="alert">
                {messageError}
              </div>
            ) : (
              <div className="alert alert-light" role="alert">
                {messageSuccess}
              </div>
            )}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-outline-primarybtn btn-outline-primary"
              >
                Add Player
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
