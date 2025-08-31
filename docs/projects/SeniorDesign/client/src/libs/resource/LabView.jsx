import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../libs/style/HomeView.css";
import qricon from "../images/qr-icon.png";
import MaintenanceTab from "../table-tabs/MaintenanceTab";
import LocationTab from "../table-tabs/LocationTab";
import SpeciesTab from "../table-tabs/SpeciesTab";
import PopulationTab from "../table-tabs/PopulationTab";
import GeneticIdTab from "../table-tabs/GeneticIdTab";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import GreenhouseTab from "../table-tabs/GreenhouseTab";
import GerminationTab from "../table-tabs/GerminationTab";
import MaturationTab from "../table-tabs/MaturationTab";
import InitiationTab from "../table-tabs/InitiationTab";
import AcclimationTab from "../table-tabs/AcclimationTab";
import FieldstationTab from "../table-tabs/FieldstationTab";
import ColdTreatmentTab from "../table-tabs/ColdTreatmentTab";

function LabView(props) {
  const navigate = useNavigate();
  console.log("props: " + JSON.stringify(props));
  const [tableDisplay, setTableDisplay] = useState(<div></div>);
  const [currentLabTab, setCurrentLabTab] = useState("Default");

  function showLabResourceTab(event) {
    setCurrentLabTab(event.target.value);
    let tab = event.target.value;

    if (tab === "Maintenance") {
      setTableDisplay(
        <div>
          <MaintenanceTab user={props.user}/>
        </div>
      );
    } else if (tab === "Greenhouse") {
      setTableDisplay(
        <div>
          <GreenhouseTab user={props.user}/>
        </div>
      );
    } else if (tab === "Cold Treatment") {
      setTableDisplay(<div><ColdTreatmentTab user={props.user}/></div>)
    } else if (tab === "Germination") {
      setTableDisplay(<div><GerminationTab user={props.user}/></div>)
    } else if (tab === "Maturation") {
      setTableDisplay(<div><MaturationTab user={props.user}/></div>)
    } else if (tab === "Initiation") {
      setTableDisplay(<div><InitiationTab user={props.user}/></div>)
    } else if (tab === "Acclimation") {
      setTableDisplay(<div><AcclimationTab user={props.user}/></div>)
    } else if (tab === "Field Station") {
      setTableDisplay(<div><FieldstationTab user={props.user}/></div>)
    } else if (tab === "Location") {
      setTableDisplay(<div><LocationTab user={props.user}/></div>);
    } else if (tab === "Genetic ID") {
      setTableDisplay(<div><GeneticIdTab user={props.user}/></div>);
    } else if (tab === "Population") {
      setTableDisplay(<div><PopulationTab user={props.user}/></div>);
    } else if (tab === "Species") {
      setTableDisplay(<div><SpeciesTab user={props.user}/></div>)
    } else {
      setTableDisplay(<div></div>);
    }
  }

  function goToQR() {
    window.location.href = "/qr/read";
  }

  return (
    <div className="main-div">
      <div className="content-div">
        <div className="header-container">
          <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="roots-header">
            ROOTS - Research Operation Organization and Tracking System (Lab)
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
          <div className="labdropdown" id="lab-dropdown">
            <FormControl className="drop-form"  variant="standard">
              <Select
                className="select"
                label="Select Active Lab Resource"
                onChange={showLabResourceTab}
                value={currentLabTab}
              >
                <MenuItem className="drop-button" value="Default">
                Select Active Lab Resource
                </MenuItem>
                <MenuItem className="drop-button" value="Initiation">
                  Initiation
                </MenuItem>
                <MenuItem className="drop-button" value="Maintenance">
                  Maintenance
                </MenuItem>
                <MenuItem className="drop-button" value="Maturation">
                  Maturation
                </MenuItem>
                <MenuItem className="drop-button" value="Cold Treatment">
                  Cold Treatment
                </MenuItem>
                <MenuItem className="drop-button" value="Germination">
                  Germination
                </MenuItem>
                <MenuItem className="drop-button" value="Acclimation">
                  Acclimation
                </MenuItem>
                <MenuItem className="drop-button" value="Greenhouse">
                  Greenhouse
                </MenuItem>
                <MenuItem className="drop-button" value="Field Station">
                  Field Station
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
        
      </div>
    </div>
  );
}

export default LabView;