import React, { Component } from "react";
import { createGame } from "./GamesFunctions";
import jwt_decode from "jwt-decode";

export default class CreateGame extends Component {
  constructor() {
    super();
    this.state = {
      game_name: "",
      creator: "",
      error: false,
      messageError: "",
      statusError: "",
      messageSuccess: "",
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (!localStorage.usertoken) {
      this.props.history.push(`/login`);
    } else {
      const token = localStorage.usertoken;
      const decoded = jwt_decode(token);
      this.setState({ creator: decoded.identity.email });
    }
  }

  onChange(e) {
    this.setState({ messageError: "" });
    this.setState({ messageSuccess: "" });
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
    const closeModal = document.getElementById("closeButton");
    const newGame = {
      game_name: this.state.game_name,
      creator: this.state.creator,
      players: [],
    };

    createGame(
      newGame,
      this.showErrorMessage.bind(this),
      this.hideErrorMessage.bind(this)
    ).then((res) => {
      if (res === undefined) {
        console.log("error: Game was not created");
      } else {
        this.setState({ messageSuccess: res.data.message });
        closeModal.click();
      }
    });
  }

  render() {
    const { error, messageSuccess, messageError } = this.state;

    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLongTitle">
            Create a new Chronicle
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
                name="game_name"
                placeholder="Name your Chronicle"
                value={this.state.game_name}
                onChange={this.onChange}
              />
            </div>
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
                Save game
              </button>
            </div>
          </form>
          {error ? (
            <div className="alert alert-light" role="alert">
              {messageError}
            </div>
          ) : (
            <div className="alert alert-light" role="alert">
              {messageSuccess}
            </div>
          )}
        </div>
      </div>
    );
  }
}
