import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../libs/style/HomeView.css";
import qricon from "../images/qr-icon.png";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ArchivedTreeTab from "../table-tabs/archived-tabs/ArchivedTreeTab";
import ArchivedAcclimationTab from "../table-tabs/archived-tabs/ArchivedAcclimationTab";
import ArchivedColdTreatmentTab from "../table-tabs/archived-tabs/ArchivedColdTreatmentTab";
import ArchivedConeTab from "../table-tabs/archived-tabs/ArchivedConeTab";
import ArchivedFieldstationTab from "../table-tabs/archived-tabs/ArchivedFieldstationTab";
import ArchivedGeneticIdTab from "../table-tabs/archived-tabs/ArchivedGeneticIdTab";
import ArchivedGerminationTab from "../table-tabs/archived-tabs/ArchivedGerminationTab";
import ArchivedGreenhouseTab from "../table-tabs/archived-tabs/ArchivedGreenhouseTab";
import ArchivedInitiationTab from "../table-tabs/archived-tabs/ArchivedInitiationTab";
import ArchivedMaintenanceTab from "../table-tabs/archived-tabs/ArchivedMaintenanceTab";
import ArchivedMaturationTab from "../table-tabs/archived-tabs/ArchivedMaturationTab";
import ArchivedRametTab from "../table-tabs/archived-tabs/ArchivedRametTab";
import ArchivedSeedTab from "../table-tabs/archived-tabs/ArchivedSeedTab";
import ArchivedSpeciesTab from "../table-tabs/archived-tabs/ArchivedSpeciesTab";
import ArchivedLocationTab from "../table-tabs/archived-tabs/ArchivedLocationTab";
import ArchivedPopulationTab from "../table-tabs/archived-tabs/ArchivedPopulationTab";

function ArchiveView(props) {
  const navigate = useNavigate();
  console.log("props: " + JSON.stringify(props));
  const [tableDisplay, setTableDisplay] = useState(<div></div>);
  const [currentArchiveTab, setCurrentArchiveTab] = useState("Default");

  function showArchiveResourceTab(event) {
    setCurrentArchiveTab(event.target.value);
    let tab = event.target.value;

    if (tab === "Trees Archive") {
      setTableDisplay(
        <div>
        <ArchivedTreeTab user={props.user}/>
        </div>
    );
    } else if (tab === "Cones Archive") {
      setTableDisplay(<div><ArchivedConeTab user={props.user}/></div>)
    } else if (tab === "Seeds Archive") {
      setTableDisplay(<div><ArchivedSeedTab user={props.user}/></div>)
    } else if (tab === "Maintenance Archive") {
      setTableDisplay(<div><ArchivedMaintenanceTab user={props.user}/></div>)
    } else if (tab === "Greenhouse Archive") {
      setTableDisplay(<div><ArchivedGreenhouseTab user={props.user}/></div>)
    } else if (tab === "Cold Treatment Archive") {
      setTableDisplay(<div><ArchivedColdTreatmentTab user={props.user}/></div>)
    } else if (tab === "Germination Archive") {
      setTableDisplay(<div><ArchivedGerminationTab user={props.user}/></div>)
    } else if (tab === "Maturation Archive") {
      setTableDisplay(<div><ArchivedMaturationTab user={props.user}/></div>)
    } else if (tab === "Initiation Archive") {
      setTableDisplay(<div><ArchivedInitiationTab user={props.user}/></div>)
    } else if (tab === "Acclimation Archive") {
      setTableDisplay(<div><ArchivedAcclimationTab user={props.user}/></div>)
    } else if (tab === "Field Station Archive") {
      setTableDisplay(<div><ArchivedFieldstationTab user={props.user}/></div>)
    } else if (tab === "Genetic ID Archive") {
      setTableDisplay(<div><ArchivedGeneticIdTab user={props.user}/></div>)
    } else if (tab === "Ramet Archive") {
      setTableDisplay(<div><ArchivedRametTab user={props.user}/></div>)
    } else if (tab === "Species Archive") {
      setTableDisplay(<div><ArchivedSpeciesTab user={props.user}/></div>)
    } else if (tab === "Location Archive") {
      setTableDisplay(<div><ArchivedLocationTab user={props.user}/></div>)
    } else if (tab === "Population Archive") {
      setTableDisplay(<div><ArchivedPopulationTab user={props.user}/></div>)
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
            ROOTS - Research Operation Organization and Tracking System (Archive)
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
          <div className="dropdown" id="archived-dropdown">
            <FormControl className="drop-form"  variant="standard">
              <Select
                className="select"
                label="Select Archived Data"
                onChange={showArchiveResourceTab}
                value={currentArchiveTab}
              >
                <MenuItem className="drop-button" value="Default">
                Select Archived Data
                </MenuItem>
                <MenuItem className="drop-button" value="Trees Archive">
                  Trees Archive
                </MenuItem>
                <MenuItem className="drop-button" value="Cones Archive">
                  Cones Archive
                </MenuItem>
                <MenuItem className="drop-button" value="Seeds Archive">
                  Seeds Archive
                </MenuItem>
                <MenuItem className="drop-button" value="Ramet Archive">
                  Ramet Archive
                </MenuItem>
                <MenuItem className="drop-button" value="Location Archive">
                  Location Archive
                </MenuItem>
                <MenuItem className="drop-button" value="Genetic ID Archive">
                  Genetic ID Archive
                </MenuItem>
                <MenuItem className="drop-button" value="Population Archive">
                  Population Archive
                </MenuItem>
                <MenuItem className="drop-button" value="Species Archive">
                  Species Archive
                </MenuItem>
                <MenuItem className="drop-button" value="Initiation Archive">
                  Initiation Archive
                </MenuItem>
                <MenuItem className="drop-button" value="Maintenance Archive">
                  Maintenance Archive
                </MenuItem>
                <MenuItem className="drop-button" value="Maturation Archive">
                  Maturation Archive
                </MenuItem>
                <MenuItem className="drop-button" value="Cold Treatment Archive">
                  Cold Treatment Archive
                </MenuItem>
                <MenuItem className="drop-button" value="Germination Archive">
                  Germination Archive
                </MenuItem>
                <MenuItem className="drop-button" value="Acclimation Archive">
                  Acclimation Archive
                </MenuItem>
                <MenuItem className="drop-button" value="Greenhouse Archive">
                  Greenhouse Archive
                </MenuItem>
                <MenuItem className="drop-button" value="Field Station Archive">
                  Field Station Archive
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

export default ArchiveView;