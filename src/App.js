import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import NavBar from "./components/NavBar";
import ShowHistory from "./components/pages/ShowHistory";

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <br />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<ShowHistory />} />
        </Routes>
      </div>
    );
  }
}

export default App;
