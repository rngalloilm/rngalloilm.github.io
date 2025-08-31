import React, {useEffect, useState} from "react";
import "../../libs/style/TableTab.css";
//import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, Link } from "react-router-dom";
import { DataGridPro } from '@mui/x-data-grid-pro';
import { Box } from "@mui/material";
import Checkbox from "./Checkbox";
import Toolbar from "./Toolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCirclePlus,
  faFileCircleMinus,
  faArchive, // Icon for Archive
  faTrashCan, // Icon for Permanent Delete
  faFilePen,
  faFilePdf,
  faFileExport,
  faFileCsv
} from "@fortawesome/free-solid-svg-icons";
import { archiveTree, deleteTree } from "../services/api-client/treeService";
import { archiveCone, deleteCone } from "../services/api-client/coneService";
import { archiveSeed, deleteSeed } from "../services/api-client/seedService";
import { archiveInitiation, deleteInitiation } from "../services/api-client/initiationService";
import { archiveMaintenance, deleteMaintenance } from "../services/api-client/maintenanceService";
import { archiveMaturation, deleteMaturation } from "../services/api-client/maturationService";
import { archiveColdTreatment, deleteColdTreatment } from "../services/api-client/coldTreatmentService";
import { archiveGermination, deleteGermination } from "../services/api-client/germinationService";
import { archiveAcclimation, deleteAcclimation } from "../services/api-client/acclimationService";
import { archiveGreenhouse, deleteGreenhouse } from "../services/api-client/greenhouseService";
import { archiveFieldstation, deleteFieldstation } from "../services/api-client/fieldstationService";
import { archiveSpecies, deleteSpecies } from "../services/api-client/speciesService";
import { archiveLocation, deleteLocation } from "../services/api-client/locationService";
import { archivePopulation, deletePopulation } from "../services/api-client/populationService";
import { archiveRamet, deleteRamet } from "../services/api-client/rametService";
import { archiveId, deleteGeneticId } from "../services/api-client/idService"
import { instance } from "../services/api-client/apiClient";
import { getAllEntries, saveEntry, archiveEntry } from "../../IndexedDB";

/**
 * editLink="/edit/tree-material" addLink="/add/tree-material"  status={"active"} material={"tree"} rows={rows} columns={columns} loading={loading1} error={error}
 * @param {*} props broken down into many different parts
 * @param editLink edit link for the table
 * @param addLink add link for the table
 * @param status whether the table is storing active or inactive data
 * @param material what material the table is storing
 * @param rows the array of rows with the data in it
 * @param columns the array of column objects that defines the columsn
 * @param loading the loading state
 * @param error the error state
 * @param isOfflineSelection tells us if the current tab is for offline selectio 
 * @param isOffline tells us if the current tab is for offline data
 * @returns 
 */
function TableComponent(props) {
  const [rows, setRows] = useState(props.rows);
  const [error, setError] = useState("");
  useEffect(() => {
    setRows(props.rows);
  }, [props.rows]);
  const navigate = useNavigate();
  const archiveData = async () => {
    console.log("Rows: " + selectedRows);
    for (let i = 0; i < selectedRows.length; i++) {
      console.log("Row: " + selectedRows[i]);
      console.log("Material: " + props.material);
      if (props.status === "active") {
        if (props.material === "tree") {
          if (props.isOffline) {
            await archiveEntry("trees", selectedRows[i]);
          }
          console.log("tree");
          await archiveTree(selectedRows[i], props.user)
            .then(() => {
              console.log("removed");
              rows.map((row) => row !== selectedRows[i]);
              setRows([...rows]);
              window.location.href = window.location.pathname;
            })
            .catch((error) => {
              console.log(error);
              alert(`An error occurred: ${error.message || "Unknown error"}`);
            });
        } else if (props.material === "cone") {
          await archiveCone(selectedRows[i], props.user).then(() => {
            console.log("removed");
            rows.map((row) => row !== selectedRows[i]);
            setRows([...rows]);
            window.location.href = window.location.pathname;
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "seed") {
          await archiveSeed(selectedRows[i], props.user).then(() => {
            console.log("removed");
            rows.map((row) => row !== selectedRows[i]);
            setRows([...rows]);
            window.location.href = window.location.pathname;
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "initiation") {
          await archiveInitiation(selectedRows[i]).then(() => {
            console.log("removed");
            rows.map((row) => row !== selectedRows[i]);
            setRows([...rows]);
            window.location.href = window.location.pathname;
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "maintenance") {
          await archiveMaintenance(selectedRows[i]).then(() => {
            console.log("removed");
            rows.map((row) => row !== selectedRows[i]);
            setRows([...rows]);
            window.location.href = window.location.pathname;
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "maturation") {
          await archiveMaturation(selectedRows[i]).then(() => {
            console.log("removed");
            rows.map((row) => row !== selectedRows[i]);
            setRows([...rows]);
            window.location.href = window.location.pathname;
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "treatment") {
          await archiveColdTreatment(selectedRows[i]).then(() => {
            console.log("removed");
            rows.map((row) => row !== selectedRows[i]);
            setRows([...rows]);
            window.location.href = window.location.pathname;
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "germination") {
          await archiveGermination(selectedRows[i]).then(() => {
            console.log("removed");
            rows.map((row) => row !== selectedRows[i]);
            setRows([...rows]);
            window.location.href = window.location.pathname;
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "acclimation") {
          await archiveAcclimation(selectedRows[i]).then(() => {
            console.log("removed");
            rows.map((row) => row !== selectedRows[i]);
            setRows([...rows]);
            window.location.href = window.location.pathname;
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "greenhouse") {
          await archiveGreenhouse(selectedRows[i]).then(() => {
            console.log("removed");
            rows.map((row) => row !== selectedRows[i]);
            setRows([...rows]);
            window.location.href = window.location.pathname;
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "fieldstation") {
          await archiveFieldstation(selectedRows[i]).then(() => {
            console.log("removed");
            rows.map((row) => row !== selectedRows[i]);
            setRows([...rows]);
            window.location.href = window.location.pathname;
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });

        } else if (props.material === "species") {
          await archiveSpecies(selectedRows[i], props.user).then(() => {
            console.log("removed");
            rows.map((row) => row !== selectedRows[i]);
            setRows([...rows]);
            window.location.href = window.location.pathname;
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "location") {
          console.log("location remove: ",selectedRows[i] );
          await archiveLocation(selectedRows[i], props.user).then(() => {
            console.log("removed");
            rows.map((row) => row !== selectedRows[i]);
            setRows([...rows]);
            window.location.href = window.location.pathname;
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "population") {
          console.log("population archived: ",selectedRows[i] );
          await archivePopulation(selectedRows[i], props.user).then(() => {
            console.log("archived");
            rows.map((row) => row !== selectedRows[i]);
            setRows([...rows]);
            window.location.href = window.location.pathname;
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "geneticId") {
          console.log("genetic id archived: ",selectedRows[i] );
          await archiveId(selectedRows[i], props.user).then(() => {
            console.log("archived");
            rows.map((row) => row !== selectedRows[i]);
            setRows([...rows]);
            window.location.href = window.location.pathname;
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "ramet") {
          console.log("ramet archived: ",selectedRows[i] );
          await archiveRamet(selectedRows[i], props.user).then(() => {
            console.log("archived");
            rows.map((row) => row !== selectedRows[i]);
            setRows([...rows]);
            window.location.href = window.location.pathname;
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else { // When props.status !== "active"
          console.warn("Archive action called from non-active view. Aborting.");
          return Promise.reject("Archive action only allowed from active view.");
        }
      } 
    }
  };

  const deleteData = async () => {
    // Confirmation dialog before permanent deletion
    const confirmation = window.confirm(
      `Are you sure you want to permanently delete the selected ${selectedRows.length} item(s)? This action cannot be undone.`
    );
    if (!confirmation) {
      console.log("Permanent deletion cancelled by user.");
      return;
    }

    console.log("Deleting Rows: " + selectedRows);
    let deletedCount = 0; // Num of successfully deleted items

    for (let i = 0; i < selectedRows.length; i++) {
      const currentId = selectedRows[i];
      console.log("Attempting to delete Row: " + currentId);
      console.log("Material Type: " + props.material);

      // Only runs on the archive page
      if (props.status === "archive") {
        let deletePromise;

        // Exclusions
        if (props.material === "geneticId" || props.material === "population") {
          console.warn(`Permanent delete is not allowed for ${props.material}. Skipping ID: ${currentId}`);
          alert(`Permanent delete is not supported for ${props.material}.`);
          continue;
        }

        else if (props.material === "tree") {
          deletePromise = deleteTree(currentId);
        } else if (props.material === "cone") {
          deletePromise = deleteCone(currentId);
        } else if (props.material === "seed") {
          deletePromise = deleteSeed(currentId);
        } else if (props.material === "initiation") {
          deletePromise = deleteInitiation(currentId);
        } else if (props.material === "maintenance") {
          deletePromise = deleteMaintenance(currentId);
        } else if (props.material === "maturation") {
          deletePromise = deleteMaturation(currentId);
        } else if (props.material === "treatment") { // Note: material name might be 'coldtreatment' in some places
          deletePromise = deleteColdTreatment(currentId);
        } else if (props.material === "germination") {
          deletePromise = deleteGermination(currentId);
        } else if (props.material === "acclimation") {
          deletePromise = deleteAcclimation(currentId);
        } else if (props.material === "greenhouse") {
          deletePromise = deleteGreenhouse(currentId);
        } else if (props.material === "fieldstation") {
          deletePromise = deleteFieldstation(currentId);
        } else if (props.material === "species") {
          deletePromise = deleteSpecies(currentId);
        } else if (props.material === "location") {
          deletePromise = deleteLocation(currentId);
        } else if (props.material === "ramet") {
           deletePromise = deleteRamet(currentId);
        } else {
           console.error(`Unknown material type for deletion: ${props.material}`);
           setError(`Deletion not implemented for material type: ${props.material}`);
          // Skip if material type is not recognized
           continue;
        }

        // Execute delete promise
        try {
          await deletePromise;
          console.log(`Permanently deleted ${props.material} with ID: ${currentId}`);
          deletedCount++;
        } catch (error) {
          console.error(`Error permanently deleting ${props.material} with ID ${currentId}:`, error);
          setError(`Failed to delete ${props.material} ID ${currentId}. See console for details.`);
          // Stop the loop on error or continue with others?
          // continue; // or break;
        }

      } else { // Safety check
        console.warn("Delete action called from non-archive view. Aborting.");
        alert("Delete action is only allowed from the archive view.");
        return;
      }
    }

    // After loop finishes
    if (deletedCount > 0) {
      // Update the local state to remove deleted items visually
      const remainingRows = rows.filter(row => !selectedRows.includes(row.id));
      setRows(remainingRows); // Update state for immediate UI feedback (as page reloads)

      alert(`${deletedCount} item(s) permanently deleted successfully.`);

      // Reload the page to reflect changes from the database
      window.location.reload();
    }
    setSelectedRows([]); // Clear selection after operation attempt
  };

  const propagateData = async () => {
    console.log("Rows: " + selectedRows);
    for (let i = 0; i < selectedRows.length; i++) {
      console.log("Row: " + selectedRows[i]);
      console.log("Material: " + props.material);
      if (props.status === "active") {
        if (props.material === "tree") {
          console.log("tree");
          await archiveTree(selectedRows[i], props.user)
            .then(() => {
              
              console.log("removed");
            })
            .catch((error) => {
              console.log(error);
              alert(`An error occurred: ${error.message || "Unknown error"}`);
            });
        } else if (props.material === "cone") {
          await archiveCone(selectedRows[i], props.user).then(() => {
            
            console.log("removed");
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "seed") {
          await archiveSeed(selectedRows[i], props.user).then(() => {
            console.log("removed");
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "initiation") {
          await archiveInitiation(selectedRows[i]).then(() => {
            console.log("removed");
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "maintenance") {
          await archiveMaintenance(selectedRows[i]).then(() => {
            console.log("removed");
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "maturation") {
          await archiveMaturation(selectedRows[i]).then(() => {
            console.log("removed");
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "treatment") {
          await archiveColdTreatment(selectedRows[i]).then(() => {
            console.log("removed");
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "germination") {
          await archiveGermination(selectedRows[i]).then(() => {
            console.log("removed");
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "acclimation") {
          await archiveAcclimation(selectedRows[i]).then(() => {
            console.log("removed");
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "greenhouse") {
          await archiveGreenhouse(selectedRows[i]).then(() => {
            console.log("removed");
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "fieldstation") {
          await archiveFieldstation(selectedRows[i]).then(() => {
            console.log("removed");
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "species") {
          await archiveSpecies(selectedRows[i], props.user).then(() => {
            console.log("removed");
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "location") {
          await archiveLocation(selectedRows[i], props.user).then(() => {
            console.log("removed");
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        } else if (props.material === "population") {
          await archivePopulation(selectedRows[i], props.user).then(() => {
            console.log("archived");
          })
          .catch((error) => {
            console.log(error);
            alert(`An error occurred: ${error.message || "Unknown error"}`);
          });
        }
      }
    }

    navigate(props.propagateLink + "/" + selectedRows[0]);
  }

  const exportData = async () => {
    let data = [
      ['Plate Label', 'Species', 'Media', 'Date'],
    ];
    const filename = 'plateLabel.csv';
    for(let i = 0; i < selectedRows.length; i++){
          for(let j = 0; j < props.rows.length; j++){
            if(props.rows[j].id === selectedRows[i]){

              //pulls file data for selected initiation materials
               let newRow = [props.rows[j].id, props.rows[j].species, props.rows[j].mediaBatch,props.rows[j].dateMade,];
                data = data.concat([newRow]);  
            }
          }
    }
    exportToCSV(data, filename);

  }

  //Exports intiation data into plate lable by converting Data into a csv format
  function exportToCSV(data, filename) {
    const csv = data.map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    link.download = filename;

    link.click();
  }

  const [selectedRows, setSelectedRows] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  const handleSelection = (selection, other) => {
    console.log(selection, other);
    setSelectedRows(selection);
    // setNumSelected(selection.length);
  };

  // Checks out selected entries and add them to offline database
  const addToOfflineDatabase = async () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one row to add for offline use.');
      return;
    }

    // 1. Prepare data for the API call
    let entriesToCheckout = {};
    // Ensure props.material is a valid key for your models map on the backend
    let modelName = props.material;
    if (props.material != "species") {
      modelName = props.material + 's';
    }
    
    if (!modelName) {
        alert(`Error: Unknown material type "${props.material}" for offline checkout.`);
        return;
    }
    entriesToCheckout[modelName] = selectedRows; // e.g., { trees: [1, 5] }

    console.log(`Attempting to checkout:`, entriesToCheckout);

    // 2. Call the /checkout API endpoint
    try {
      const response = await instance.post('/offline/checkout', { entriesToCheckout });

      // 3. Handle successful checkout (API returns 200)
      if (response.status === 200 && response.data.checkedOutData) {
        const savePromises = [];
        selectedRows.forEach((rowId) => {
          // Find the full data object corresponding to the selected ID
          const selectedRowData = props.rows.find(row => row.id === rowId);
          if (selectedRowData) {
            savePromises.push(saveEntry(modelName, { ...selectedRowData }));
          } else {
            console.warn(`Could not find data for selected ID ${rowId} in props.rows`);
          }
        });
    
        // 3. Execute all save promises
        try {
          await Promise.all(savePromises);
          console.log('Selected rows added/updated in IndexedDB table:', modelName);
          alert(`${savePromises.length} selected row(s) successfully added/updated in offline storage!`);
          // Optionally clear selection after successful save
          try {
            const allOfflineEntries = await getAllEntries(modelName);
            alert(`Success! Current offline ${modelName}:\n${JSON.stringify(allOfflineEntries, null, 2)}`);
          } catch (fetchError) {
            console.error(`Error fetching entries from ${modelName} after saving:`, fetchError);
          }
          setSelectedRows([]);
        } catch (error) {
          console.error('Error adding items to offline database:', error);
          alert('An error occurred while saving data offline. Check console for details.');
        }

      } else {
        // Handle unexpected success response format
         alert('Checkout request sent, but received an unexpected response from the server.');
         console.warn("Unexpected checkout response:", response);
      }

    } catch (error) {
      // 4. Handle API errors (Conflict, Server Error, etc.)
      if (error.response) {
        if (error.response.status === 409) {
          // Conflict error
          const conflicts = error.response.data.conflicts || [];
          let conflictMessages = conflicts.map(c => `  - ${c.type} ID ${c.id}: ${c.message}`).join('\n');
          alert(`Checkout failed due to conflicts:\n${conflictMessages}`);
          console.warn("Checkout conflicts:", conflicts);
          // Decide how to handle UI - maybe keep conflicting items selected?
        } else if (error.response.status === 401) {
             alert("Authentication error. Please ensure you are logged in.");
        }
         else {
          // Other server errors
          alert(`Checkout failed: ${error.response.data.message || 'Server error'}`);
          console.error('Checkout API error:', error.response);
        }
      } else {
        // Network error or other client-side issue
        alert('Checkout failed. Could not reach the server. Please check your connection.');
        console.error('Checkout network/request error:', error);
      }
    }
  };
  

  const validUser = (
    <div className="operations-div">
      {selectedRows.length === 0 && props.status !== "archive" && !props.isOfflineSelection ? (
        <div className="add-button-container">
          <Link to={props.addLink}>
            <FontAwesomeIcon title="Add" className="icon" icon={faFileCirclePlus} />
          </Link>
          <span className="add-button-text">Add new {props.material}</span>
        </div>
        ) : (<div></div>)}
      
      {/* Add to offline database. Onclick link needs to be changed or fix funtion above. Not sure about last line */}
      {props.isOfflineSelection && props.status !== "archive" && selectedRows.length >= 1 ? (
        <div className="add-to-offline-button-container">
          <a onClick={addToOfflineDatabase}>
            <FontAwesomeIcon title="Add to Offline" className="icon" icon={faFileCirclePlus} />
          </a>
          <span className="add-to-offline-button-text">Add selected resources to offline database</span>
        </div>
        ) : (<div></div>)}

      {/* Archive Button */}
      {selectedRows.length >= 1 && props.status === "active" && !props.isOfflineSelection ? (
        <div className="archive-button-container">
          <a onClick={archiveData}>
            <FontAwesomeIcon title="Delete" className="icon" icon={faArchive} />
          </a>
          <span className="archive-button-text">Archive selected {props.material}</span>
        </div>
        ) : ( <div></div> )}

      {/* Permanent Delete Button */}
      {selectedRows.length >= 1 &&
       props.status === "archive" && 
       props.material !== "geneticId" && // Exclude geneticId
       props.material !== "population" && // Exclude population
       !props.isOffline ? ( // Don't show in offline modes
        <div className="permanent-delete-button-container">
          <a onClick={deleteData}>
            <FontAwesomeIcon title="Permanently Delete" className="icon" icon={faTrashCan} />
          </a>
          <span className="delete-button-text">Permanently Delete selected {props.material}</span>
        </div>
        ) : ( <div></div> )}

      {selectedRows.length === 1 && props.status !== "archive" && props.material !== "population" && !props.isOfflineSelection && !props.isOffline ? (
        <div className="edit-button-container">
          <Link to={props.editLink + "/" + selectedRows[0]}>
            <FontAwesomeIcon title="Edit" className="icon" icon={faFilePen} />
          </Link>
          <span className="edit-button-text">Edit selected {props.material}</span>
        </div>
        ) : ( <div></div> )}

      {selectedRows.length === 1 && props.status !== "archive" && props.material !== "population" && !props.isOfflineSelection && props.isOffline? (
        <div className="edit-button-container">
          <Link to={props.editLink + "/" + selectedRows[0] + "?offline=true"}>
            <FontAwesomeIcon title="Edit" className="icon" icon={faFilePen} />
          </Link>
          <span className="edit-button-text">Edit selected {props.material}</span>
        </div>
        ) : ( <div></div> )}
      {selectedRows.length === 1 && props.material !== "location" && props.material !== "species" && props.material !== "geneticId" && props.material !== "population" & (props.material === "tree" || props.material === "cone" || props.material === "seed")  && !props.isOfflineSelection ? (
        <div className="view-report-button-container">
          <Link to={"/report/" + props.material + "/" + selectedRows[0]}>
            <FontAwesomeIcon title="View Report" className="icon" icon={faFilePdf} />
          </Link>
          <span className="view-report-button-text">View report for selected {props.material}</span>
        </div>
        ) : <div></div>}
      {selectedRows.length === 1 && props.status !== "archive" && ( props.material === "initiation" || props.material === "maintenance" || props.material === "maturation" || props.material === "treatment" || props.material === "germination" || props.material === "acclimation" || props.material === "greenhouse" || props.material === "acclimation")  ? ( 
        <div className="propagate-button-container">
          <a onClick={propagateData}>
            <FontAwesomeIcon title="Propagate" className="icon" icon={faFileExport} />
          </a>
          <span className="propagate-button-text">Propagate selected {props.material}</span>
        </div>
        ) : <div></div>}
      {selectedRows.length >= 1 && props.status !== "archive" && (props.material === "initiation" )  ? ( 
        <div className="export-csv-button-container">
          <a onClick={exportData}>
            <FontAwesomeIcon title="Export Label CSV" className="icon" icon={faFileCsv} />
          </a>
          <span className="export-csv-button-text">Export CSV for selected {props.material}</span>
        </div>
        ) : <div></div>}
    </div>
  )

  const StripedDataGrid = DataGridPro;

  return (
    <Box
      sx={{
        backgroundColor: "#aaaaaa",
        height: "fit-content",
        width: "100%",
        marginTop: "10px",
        "& .headerStyle": {
          backgroundColor: "#dddddd",
        },
      }}
    >
      <StripedDataGrid
        sx={{
          height: "405px",
        }}
        rows={rows}
        columns={props.columns}
        checkboxSelection
        pagination
        onRowSelectionModelChange={handleSelection}
        // pageSize={5}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        slots={{
          toolbar: Toolbar,
          baseCheckbox: Checkbox,
        }}
        //New code
        initialState={{
          sorting: {
            sortModel: [{ field: "active", sort: "desc" }],
          },
          pagination: { 
            paginationModel: { pageSize: 5 } 
          },        
        }}
        pageSizeOptions={[5, 10, 25]}
      />

      <div className="operations-div">
        { user.role !== "user" ? validUser : (
          selectedRows.length === 1 ? (
            <a href={"/report/" + props.material + "/" + selectedRows[0]}>
              <FontAwesomeIcon title="View Report" className="icon" icon={faFilePdf} />
            </a>
          ) : <div></div>
        )}
        {/*Error message*/}
        {props.loading ? (
          <div className="message-div"></div>
        ) : props.error ? (
          <div className="message-div">Error: {props.error.message}</div>
        ) : (
          <div></div>
        )}
      </div>
    </Box>
  );
}

export default TableComponent;
