import axios from "axios";
import React, { Component } from "react";

class UploadFile extends Component {
  state = {
    selectedFile: null,
    responseData: null,
    editedValues: {},
    showAlert: false,
    alertMessage: null,
    alertType: null,
  };

  // trigger alerts
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

  // close button in alert
  handleCloseAlert = () => {
    this.setState({ showAlert: false });
  };

  // trigger when choosen a file
  onFileChange = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
    });
  };

  // file upload
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
          alertType: "error",
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

      // call backend endpoint
      axios
        .post(process.env.REACT_APP_API_URL, formData)
        .then((response) => {
          if (response.status === 200) {
            const initialEditedValues = {};
            for (const [fieldName, value] of Object.entries(
              response.data.dtypes
            )) {
              initialEditedValues[fieldName] = value;
            }
            this.setState({
              responseData: response.data,
              editedValues: initialEditedValues,
              showAlert: true,
              alertType: "success",
              alertMessage: "File Processed Successfully",
            });
          } else {
            //show error if error code returned in response
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
            alertMessage: "Something went wrong",
          });
        });
    } else {
      this.setState({
        showAlert: true,
        alertType: "error",
        alertMessage: "Choose a file before upload",
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
  };

  // show processed data types
  renderInputs = () => {
    const { responseData, editedValues } = this.state;
    if (responseData) {
      return Object.entries(responseData.dtypes).map(([fieldName, value]) => (
        <div className="mb-3" key={fieldName}>
          <div className="input-group">
            <label className="input-group-text" htmlFor={fieldName}>
              {fieldName}
            </label>
            <input
              className="form-control"
              aria-describedby="basic-addon3 basic-addon4"
              type="text"
              id={fieldName}
              value={
                editedValues[fieldName] !== undefined
                  ? editedValues[fieldName]
                  : ""
              }
              onChange={(event) => this.onEditDataTypes(fieldName, event)}
            />
          </div>
        </div>
      ));
    } else {
      return <p>Choose File and Upload for Processing</p>;
    }
  };

  // enable update button
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

  // call backend to update the record
  onUpdateTypes = () => {
    if (this.state.editedValues) {
      const req = {
        id: this.state.responseData.id,
        dtypes: this.state.editedValues,
      };
      axios
        .patch(process.env.REACT_APP_API_URL, req)
        .then((response) => {
          if (response.status === 200) {
            this.setState({
              showAlert: true,
              alertType: "success",
              alertMessage: "Record Updated Successfully",
            });
          } else {
            this.setState({
              showAlert: true,
              alertType: "error",
              alertMessage: "Something went wrong",
            });
          }
        })
        .catch((error) => {
          this.setState({
            showAlert: true,
            alertType: "error",
            alertMessage: "Something went wrong",
          });
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
      return <></>;
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
              Upload
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
