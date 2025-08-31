import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../libs/style/OnlineOffline.css";

function OnlineOfflineView(props) {
  const navigate = useNavigate();
  console.log("props: " + JSON.stringify(props));
  return (
    <div className="main-div">
      <div className="content-div">
        <div className="header-container">
          <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="roots-header">
            ROOTS - Research Operation Organization and Tracking System (Online)
          </h1>
        </div>
      </div>
      <div className="home-container">
        <div className="onlineoffline-container">
          <Link to="/field/online" className="online-button">
            Online
          </Link>
          <Link to="/field/offline/selection" className="offline-button">
            Offline
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OnlineOfflineView;
