import React from "react";
import { Link } from "react-router-dom";
import "../../libs/style/ActualHomeView.css";

function HomeView(props) {
  console.log("props: " + JSON.stringify(props));
  return (
    <div className="main-div">
      <div className="content-div">
        <h1 className="roots-header">ROOTS - Research Operation Organization and Tracking System</h1>
      </div>
      <div className="home-container">
        <div className="main-button-container">
          <Link to="/onlineoffline" className="main-button">
            Field
          </Link>
          <Link to="/lab" className="main-button">
            Lab
          </Link>
          <Link to="/archive" className="main-button">
            Archive
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomeView;
