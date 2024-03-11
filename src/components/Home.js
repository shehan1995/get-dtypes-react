import React, { Component } from "react";
import UploadFile from "./UploadFile";
import ShowHistory from "./ShowHistory";

class Home extends Component {
  render() {
    return (
      <div className="container">
        <br />
        <UploadFile />
        <br />

        <ShowHistory />
        <br />
      </div>
    );
  }
}

export default Home;
