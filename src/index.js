import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  //   <br />
  //   <div className="container">
  //     <App />
  //   </div>
  // </React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

reportWebVitals();
