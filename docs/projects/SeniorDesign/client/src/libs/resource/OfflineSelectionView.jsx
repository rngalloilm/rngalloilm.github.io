import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import "../../libs/style/HomeView.css";
import "../../libs/style/OfflineSelection.css";
import qricon from "../images/qr-icon.png";
import TreeTab from "../table-tabs/selection-tabs/TreeSelectionTab";
import ConeTab from "../table-tabs/selection-tabs/ConeSelectionTab";
import SeedTab from "../table-tabs/selection-tabs/SeedSelectionTab";
import RametTab from "../table-tabs/selection-tabs/RametSelectionTab";
import LocationTab from "../table-tabs/selection-tabs/LocationSelectionTab";
import SpeciesTab from "../table-tabs/selection-tabs/SpeciesSelectionTab";
import PopulationTab from "../table-tabs/selection-tabs/PopulationSelectionTab";
import GeneticIdTab from "../table-tabs/selection-tabs/GeneticIdSelectionTab";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function FieldView(props) {
  const navigate = useNavigate();
  console.log("props: " + JSON.stringify(props));
  const [tableDisplay, setTableDisplay] = useState(<div></div>);
  const [currentFieldTab, setCurrentFieldTab] = useState("Default");

  function showFieldResourceTab(event) {
    setCurrentFieldTab(event.target.value);
    let tab = event.target.value;

    if (tab === "Trees") {
      setTableDisplay(
        <div>
          <TreeTab user={props.user}/>
        </div>
      );
    } else if (tab === "Cones") {
      setTableDisplay(
        <div>
          <ConeTab user={props.user}/>
        </div>
      );
    } else if (tab === "Seeds") {
      setTableDisplay(
        <div>
          <SeedTab user={props.user}/>
        </div>
      );
    } else if (tab === "Location") {
      setTableDisplay(<div><LocationTab user={props.user}/></div>);
    } else if (tab === "Genetic ID") {
      setTableDisplay(<div><GeneticIdTab user={props.user}/></div>);
    } else if (tab === "Population") {
      setTableDisplay(<div><PopulationTab user={props.user}/></div>);
    } else if (tab === "Ramet") {
      setTableDisplay(<div><RametTab user={props.user}/></div>);
    } else if (tab === "Species") {
      setTableDisplay(<div><SpeciesTab user={props.user}/></div>)
    } else {
      setTableDisplay(<div></div>);
    }
  }

  function goToQR() {
    window.location.href = "/qr/read";
  }

  function goOffline() {
    const confirmationMessage = "Are you sure you want to go offline? Data will be stored locally.";
    if (window.confirm(confirmationMessage)) {
      console.log("Confirmed going offline...");
      navigate("/field/offline");
    } else {
      console.log("Cancelled going offline.");
    }
  }

  return (
    <div className="main-div">
      <div className="content-div">
        <div className="header-container">
          <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="roots-header">
            Offline Selection
          </h1>
        </div>
        <div className="search-div">
          <input
            id="search-bar"
            type="text"
            placeholder="Enter search term..."
          />

          <button id="search-button">Search</button>
          <input type="image" src={qricon} alt="qr-button" id="qr-button" onClick={goToQR}/>
        </div>

        <div className="tabs-div">
          <div className="fielddropdown" id="field-dropdown">
            <FormControl className="drop-form"  variant="standard">

              <Select
                className="select"
                label="Select Active Field Resource"
                onChange={showFieldResourceTab}
                value={currentFieldTab}
              >
                <MenuItem className="drop-buton" value="Default">
                Select Active Field Resource
                </MenuItem>
                <MenuItem className="drop-button" value="Trees">
                  Trees
                </MenuItem>
                <MenuItem className="drop-button" value="Cones">
                  Cones
                </MenuItem>
                <MenuItem className="drop-button" value="Seeds">
                  Seeds
                </MenuItem>
                <MenuItem className="drop-button" value="Ramet">
                  Ramet
                </MenuItem>
                <MenuItem className="drop-button" value="Location">
                  Location
                </MenuItem>
                <MenuItem className="drop-button" value="Genetic ID">
                  Genetic ID
                </MenuItem>
                <MenuItem className="drop-button" value="Population">
                  Population
                </MenuItem>
                <MenuItem className="drop-button" value="Species">
                  Species
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        {tableDisplay}

        <button
          className="go-offline-button"
          onClick={goOffline}
        >
          Go Offline
        </button>

      </div>
    </div>
  );
}

export default FieldView;