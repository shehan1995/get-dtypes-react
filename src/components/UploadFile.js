import axios from "axios";
import React, { Component } from "react";

class UploadFile extends Component {
  state = {
    selectedFile: null,
    responseData: null,
    editedValues: {}, // Store edited values here
    showAlert: false,
    alertMessage: null,
  };

  triggerAlert = () => {
    if (this.state.showAlert) {
      return (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          {this.state.alertMessage}
          <button
            type="button"
            className="btn-close"
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

  onFileChange = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
    });
  };

  onFileUpload = () => {
    if (this.state.selectedFile) {
      // Check if the file extension is .csv or .xls or .xlsx
      if (
        !(
          this.state.selectedFile.name.endsWith(".csv") ||
          this.state.selectedFile.name.endsWith(".xls") ||
          this.state.selectedFile.name.endsWith(".xlsx")
        )
      ) {
        this.setState({
          selectedFile: null,
          showAlert: true,
          alertMessage: "Upload CSV/Excel file for processing",
        });
        return;
      }

      const formData = new FormData();
      formData.append(
        "file",
        this.state.selectedFile,
        this.state.selectedFile.name
      );

      axios
        .post("http://127.0.0.1:8000/server/process/", formData)
        .then((response) => {
          if (response.status === 200) {
            const initialEditedValues = {}; // Initialize edited values with original data
            for (const [fieldName, value] of Object.entries(
              response.data.dtypes
            )) {
              initialEditedValues[fieldName] = value;
            }
            this.setState({
              responseData: response.data,
              editedValues: initialEditedValues,
              showAlert: true,
              alertMessage: "File Processed Successfully",
            });
          } else {
            this.setState({
              showAlert: true,
              alertMessage: "Something Went Wrong",
            });
          }
        })
        .catch((error) => {
          this.setState({
            showAlert: true,
            alertMessage: "Something went wrong",
          });
        });
    }
  };

  // Method to update edited values in state
  onEditDataTypes = (fieldName, event) => {
    const newValue = event.target.value;
    this.setState((prevState) => ({
      editedValues: {
        ...prevState.editedValues,
        [fieldName]: newValue,
      },
    }));
    console.log(this.state.editedValues);
  };

  renderInputs = () => {
    const { responseData, editedValues } = this.state;
    if (responseData) {
      return Object.entries(responseData.dtypes).map(([fieldName, value]) => (
        <div className="mb-3" key={fieldName}>
          <div class="input-group">
            <label className="input-group-text" htmlFor={fieldName}>
              {fieldName}
            </label>
            <input
              className="form-control"
              aria-describedby="basic-addon3 basic-addon4"
              type="text"
              id={fieldName}
              value={editedValues[fieldName] || value} // Use edited value if exists
              onChange={(event) => this.onEditDataTypes(fieldName, event)}
            />
          </div>
        </div>
      ));
    } else {
      return <p>Choose File and Upload for Processing</p>;
    }
  };

  enableUpdateBtn = () => {
    if (this.state.responseData) {
      return (
        <div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.onUpdateTypes}
          >
            Update
          </button>
        </div>
      );
    }
  };

  onUpdateTypes = () => {
    if (this.state.editedValues) {
      const req = {
        id: this.state.responseData.id,
        dtypes: this.state.editedValues,
      };
      axios
        .patch("http://127.0.0.1:8000/server/process/", req)
        .then((response) => {
          if (response.status === 200) {
            this.setState({
              showAlert: true,
              alertMessage: "Record Updated Successfully",
            });
          } else {
            this.setState({
              showAlert: true,
              alertMessage: "Something went wrong",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h6>File Details:</h6>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
          <p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h5>Choose file before Pressing the Upload button</h5>
        </div>
      );
    }
  };

  render() {
    return (
      <>
        <div>{this.triggerAlert()}</div>
        <div className="card">
          <div className="card-header">Upload File</div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">
                Upload a csv file for xslx file to process
              </label>
              <input
                className="form-control"
                type="file"
                id="formFile"
                onChange={this.onFileChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.onFileUpload}
            >
              Upload!
            </button>
          </div>
          <div className="card-body">{this.fileData()}</div>
        </div>
        <br />
        <div className="card">
          <div className="card-header">Data types in Uploaded Dataset</div>
          <div className="card-body">{this.renderInputs()}</div>
          <div className="card-body">{this.enableUpdateBtn()}</div>
        </div>
      </>
    );
  }
}

export default UploadFile;
