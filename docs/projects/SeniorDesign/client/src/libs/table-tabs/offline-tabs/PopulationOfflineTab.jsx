// client/src/libs/table-tabs/PopulationOfflineTab.jsx

import React, { useState, useEffect } from "react";
// Offline imports
import { getAllEntries, markEntryAsDeleted } from "../../../IndexedDB"; // Import necessary functions
import TableComponent from "../TableComponent";
import "../../style/TableTab.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

function PopulationOfflineTab(props) {
  const { user } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Data from IndexedDB ---
  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadOfflinePopulations = async () => {
      try {
        console.log("Offline Mode: Fetching populations from IndexedDB table 'populations'");
        const offlinePopulations = await getAllEntries('populations');

        // Filter out entries marked for deletion locally (if feature is enabled later)
        const activeOfflinePopulations = offlinePopulations.filter(pop => pop._syncStatus !== 'deleted');

        // --- Process Data for Display ---
        // The primary key 'id' is already what we need
        const processedData = activeOfflinePopulations.map(pop => ({
          id: pop.id, // Use 'id' (primary key) as the DataGrid 'id'
          populationId: pop.id, // Keep original field name if needed
          _syncStatus: pop._syncStatus || 'synced'
        }));

        setData(processedData);

      } catch (err) {
        console.error(`Error loading offline populations:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadOfflinePopulations();
  }, []); // Run only once on mount

  // --- Handle Offline Deletion (Currently Disabled for Populations) ---
  const handleDeleteOffline = async (idToDelete) => {
      alert("Offline deletion for Populations is currently disabled for data integrity reasons.");
      /* // Example if deletion were enabled:
      const confirmation = window.confirm(`WARNING: Deleting Population ID ${idToDelete} offline might orphan related data. Proceed?`);
      if (confirmation) {
          try {
              await markEntryAsDeleted('populations', idToDelete); // Use primary key 'id'
              setData(currentData => currentData.filter(item => item.id !== idToDelete));
              alert(`Population ${idToDelete} marked for deletion offline.`);
          } catch (err) {
              console.error(`Error marking population ${idToDelete} as deleted offline:`, err);
              alert(`Failed to mark population for deletion: ${err.message}`);
          }
      }
      */
  };

  // --- Define Columns ---
  const columns = [
    { field: "populationId", headerName: "Population", width: 200 },
    { field: '_syncStatus', headerName: 'Sync Status', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          {/* Edit Link - Editing Population ID itself is usually not done */}
           <span title="Editing Population ID Not Allowed" style={{ marginRight: '10px', color: '#999' }}>
              <FontAwesomeIcon icon={faEdit} />
           </span>

          {/* Delete Button - Disabled for populations */}
          {/* <button
            onClick={() => handleDeleteOffline(params.id)}
            style={{ color: '#aaa', background: 'none', border: 'none', cursor: 'not-allowed', padding: 0 }}
            title="Offline Deletion Disabled for Populations"
            disabled // Disable the button
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button> */}
        </>
      ),
      width: 100,
    }
  ];

 // Link for adding a new population offline
 const addLinkOffline = "/material/population/add?offline=true";

  return (
    <div>
      <TableComponent
        addLink={addLinkOffline}
        // No edit link provided as editing PK is discouraged
        status={"active"}
        material={"population"}
        rows={data}
        columns={columns}
        loading={loading}
        error={error}
        user={user}
        isOffline={true}
        // Explicitly disable delete/edit if TableComponent relies on props
        // disableDelete={true}
        // disableEdit={true}
      />
    </div>
  );
}

export default PopulationOfflineTab;