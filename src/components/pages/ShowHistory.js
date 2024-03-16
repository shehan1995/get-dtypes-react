import React, { Component } from "react";
import axios from "axios";
import PopModal from "./../Modal";

class ShowHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      data: null,
    };
  }
  state = {
    allRecords: null,
    showAlert: false,
    alertMessage: null,
    alertType: null,
  };

  triggerAlert = () => {
    let alertClass = "";
    let closeButtonClass = "";

    switch (this.state.alertType) {
      case "alert":
        alertClass = "alert alert-warning alert-dismissible fade show";
        closeButtonClass = "btn-close";
        break;
      case "error":
        alertClass = "alert alert-danger alert-dismissible fade show";
        closeButtonClass = "btn-close";
        break;
      case "success":
        alertClass = "alert alert-success alert-dismissible fade show";
        closeButtonClass = "btn-close";
        break;
      default:
        alertClass = "alert alert-info alert-dismissible fade show";
        closeButtonClass = "btn-close";
    }

    if (this.state.showAlert) {
      return (
        <div className={alertClass} role="alert">
          {this.state.alertMessage}
          <button
            type="button"
            className={closeButtonClass}
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={this.handleCloseAlert}
          ></button>
        </div>
      );
    }
  };

  handleCloseAlert = () => {
    this.setState({ showAlert: false });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  handleShow = (item) => {
    this.setState({ showModal: true, data: item });
  };

  componentDidMount() {
    this.renderAllRecords();
  }

  // fetch all processed dataset data types from backend
  renderAllRecords = () => {
    axios
      .get(process.env.REACT_APP_API_URL)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            allRecords: response.data,
          });
        } else {
          this.setState({
            showAlert: true,
            alertType: "error",
            alertMessage: "Something Went Wrong",
          });
        }
      })
      .catch((error) => {
        this.setState({
          showAlert: true,
          alertType: "error",
          alertMessage: "Something Went Wrong",
        });
      });
  };

  showRecords = () => {
    if (this.state.allRecords) {
      return (
        <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {this.state.allRecords.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.status}</td>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                  <td>{new Date(item.updated_at).toLocaleString()}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop"
                      onClick={() => this.handleShow(item)}
                    >
                      Show Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return <p>No Processed Files</p>;
    }
  };

  render() {
    return (
      <div className="container">
        <div>{this.triggerAlert()}</div>
        <div>
          <PopModal
            data={this.state.data}
            showModal={this.state.showModal}
            handleClose={this.handleClose}
          />
        </div>

        <div className="card">
          <div className="card-header">Processed Files History</div>
          <div className="card-body">{this.showRecords()}</div>
        </div>
      </div>
    );
  }
}

export default ShowHistory;
