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
    )
      .then((res) => {
        if (res === undefined) {
          console.log("error: Game was not created");
        } else {
          this.setState({ messageSuccess: res.data.message });
        }
      })
      .then(closeModal.click());
  }

  render() {
    const { error, messageSuccess, messageError } = this.state;

    return (
      // <div className="container">
      //   <div className="row">
      //     <div className="col-md-6 mt-5 mx-auto">
      //       <h3>Create a new Chronicle</h3>
      //       <p>
      //         Name your new Chronicle. Then click the "Create a New Game"
      //         button.
      //       </p>
      //       <form noValidate onSubmit={this.onSubmit}>
      //         <div className="form-group">
      //           <label htmlFor="exampleInputEmail1">Chronicle name</label>
      //           <input
      //             type="email"
      //             className="form-control"
      //             name="game_name"
      //             placeholder="Name your Chronicle"
      //             value={this.state.name}
      //             onChange={this.onChange}
      //           />
      //         </div>

      //         <button type="submit" className="btn btn-outline-primary">
      //           Create a New Game
      //         </button>
      //       </form>
      //       {error ? (
      //         <div className="alert alert-light" role="alert">
      //           {messageError}
      //         </div>
      //       ) : (
      //         <div className="alert alert-light" role="alert">
      //           {messageSuccess}
      //         </div>
      //       )}
      //     </div>
      //   </div>
      // </div>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">
            Create a new Chronicle
          </h5>
          <button
            id="closeButton"
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form noValidate onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                name="game_name"
                placeholder="Name your Chronicle"
                value={this.state.name}
                onChange={this.onChange}
              />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-outline-primarybtn btn-outline-primary"
              >
                Save changes
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
