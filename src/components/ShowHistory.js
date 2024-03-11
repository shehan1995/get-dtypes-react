import React, { Component } from "react";
import axios from "axios";
import PopModal from "./Modal";

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

  renderAllRecords = () => {
    axios
      .get("http://127.0.0.1:8000/server/process/")
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            allRecords: response.data,
          });
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        console.log(error);
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
      <>
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
      </>
    );
  }
}

export default ShowHistory;
