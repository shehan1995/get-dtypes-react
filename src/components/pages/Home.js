import React, { Component } from "react";
import UploadFile from "./../UploadFile";

class Home extends Component {
  render() {
    return (
      <div className="container">
        <br />
        <UploadFile />
        <br />
      </div>
    );
  }
}

export default Home;
