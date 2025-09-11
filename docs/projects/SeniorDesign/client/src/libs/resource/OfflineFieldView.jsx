import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../libs/style/HomeView.css";
import "../../libs/style/OfflineView.css";
import qricon from "../images/qr-icon.png";
import TreeOfflineTab from "../table-tabs/offline-tabs/TreeOfflineTab";
import ConeOfflineTab from "../table-tabs/offline-tabs/ConeOfflineTab";
import SeedOfflineTab from "../table-tabs/offline-tabs/SeedOfflineTab";
import RametOfflineTab from "../table-tabs/offline-tabs/RametOfflineTab";
import LocationOfflineTab from "../table-tabs/offline-tabs/LocationOfflineTab";
import SpeciesOfflineTab from "../table-tabs/offline-tabs/SpeciesOfflineTab";
import PopulationOfflineTab from "../table-tabs/offline-tabs/PopulationOfflineTab";
import GeneticIdOfflineTab from "../table-tabs/offline-tabs/GeneticIdOfflineTab";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getAllEntries, fieldOfflineTable } from "../../IndexedDB";
import { instance } from "../services/api-client/apiClient";

const offlineTableNames = fieldOfflineTable.map(t => t.name);


function OfflineFieldView(props) {
  const navigate = useNavigate();
  console.log("props: " + JSON.stringify(props));
  const [tableDisplay, setTableDisplay] = useState(<div></div>);
  const [currentFieldTab, setCurrentFieldTab] = useState("Default");
  const [isSyncing, setIsSyncing] = useState(false);

  function showFieldResourceTab(event) {
    setCurrentFieldTab(event.target.value);
    let tab = event.target.value;
    if (tab === "Trees") {
      setTableDisplay(
        <div>
          <TreeOfflineTab user={props.user}/>
        </div>
      );
    } else if (tab === "Cones") {
      setTableDisplay(
        <div>
          <ConeOfflineTab user={props.user}/>
        </div>
      );
    } else if (tab === "Seeds") {
      setTableDisplay(
        <div>
          <SeedOfflineTab user={props.user}/>
        </div>
      );
    } else if (tab === "Location") {
      setTableDisplay(<div><LocationOfflineTab user={props.user}/></div>);
    } else if (tab === "Genetic ID") {
      setTableDisplay(<div><GeneticIdOfflineTab user={props.user}/></div>);
    } else if (tab === "Population") {
      setTableDisplay(<div><PopulationOfflineTab user={props.user}/></div>);
    } else if (tab === "Ramet") {
      setTableDisplay(<div><RametOfflineTab user={props.user}/></div>);
    } else if (tab === "Species") {
      setTableDisplay(<div><SpeciesOfflineTab user={props.user}/></div>)
    } else {
      setTableDisplay(<div></div>);
    }
  }

  function goToQR() {
    window.location.href = "/qr/read";
  }

  const goOnline = async () => {
    const confirmationMessage = "Are you sure you want to go Online?";
    if (!window.confirm(confirmationMessage)) {
      console.log("Cancelled going online.");
      return;
    }

    setIsSyncing(true);
    console.log("Confirmed going Online...");
    
    let itemsToUnlock = {};

    try {
      // --- 1. Gather All Local IDs for Unlock ---
      for (const tableName of offlineTableNames) {
        const allOfflineData = await getAllEntries(tableName);
        console.log(`Data from IndexedDB table "${tableName}":`, allOfflineData);

        const tableConfig = fieldOfflineTable.find(t => t.name === tableName);
        if (!tableConfig) {
          console.warn(`No table config found for ${tableName}, skipping unlock attempt for this table.`);
          continue;
        }
        const keyPath = tableConfig.keyPath;

        // Collect *all* primary keys present locally for this table
        const idsForTable = allOfflineData.map(item => item[keyPath]);
        if (idsForTable.length > 0) {
            itemsToUnlock[tableName] = idsForTable;
        }
      }

      console.log("Items to attempt unlocking:", itemsToUnlock);

      // --- 2. Call Unlock API (if there's anything to unlock) ---
      if (Object.keys(itemsToUnlock).length > 0) {
        console.log("Sending unlock request...");
        const unlockResponse = await instance.post('/offline/unlock', { entriesToUnlock: itemsToUnlock });

        if (unlockResponse.status === 200) {
          console.log("Unlock successful:", unlockResponse.data.message);
          if (unlockResponse.data.warnings && unlockResponse.data.warnings.length > 0) {
            console.warn("Unlock warnings:", unlockResponse.data.warnings);
            alert("Server unlock completed with warnings (some items might not have been locked by you):\n" + unlockResponse.data.warnings.join('\n'));
          }

          // --- 3. Cleanup Local IndexedDB ---
          // await clearAllOfflineData(); // Clear all tables defined in fieldOfflineTable
          console.log("Cleared offline IndexedDB tables.");

          alert("Successfully unlocked items and went online! Local offline data has been cleared.");
          navigate("/"); // Navigate to online home

        } else {
          // Handle non-200 success from unlock API
          console.error("Unlock failed on server:", unlockResponse.data);
          alert(`Unlock operation failed on the server: ${unlockResponse.data.message || 'Unknown server error during unlock.'}. Local data remains.`);
          // Keep local data in this case
        }
      } else {
        // Nothing was stored locally in the first place
        console.log("No local data found in IndexedDB. Proceeding online.");
        alert("No offline data found. Proceeding online.");
        //  await clearAllOfflineData(); // Still good practice to ensure it's clean
        navigate("/");
      }

    } catch (error) {
      // Handle errors during IndexedDB access or the API call itself
      console.error("Error during goOnline (unlock only) process:", error);
      alert(`Failed to go online: ${error.response?.data?.message || error.message || 'Could not connect to server or access local data.'}. Local data remains.`);
       // Keep local data
    } finally {
      setIsSyncing(false); // Reset loading state
    }
      // Sync happens here?
      // Unlock happens after as well?

    navigate("/");
  };

  return (
    <div className="main-div">
      <div className="content-div">
        <div className="header-container">
          <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="roots-header">
            ROOTS - Research Operation Organization and Tracking System (Offline)
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
          className="go-online-button"
          onClick={goOnline}
        >
          Go Online
        </button>
      </div>
    </div>
  );
}

export default OfflineFieldView;