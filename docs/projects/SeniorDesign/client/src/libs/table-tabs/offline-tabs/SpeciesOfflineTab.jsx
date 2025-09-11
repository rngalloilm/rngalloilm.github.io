// client/src/libs/table-tabs/SpeciesOfflineTab.jsx

import React, { useState, useEffect } from "react";
// Offline imports
import { getAllEntries, markEntryAsDeleted } from "../../../IndexedDB"; // Import necessary functions
import TableComponent from "../TableComponent";
import "../../style/TableTab.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

function SpeciesOfflineTab(props) {
  const { user } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Data from IndexedDB ---
  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadOfflineSpecies = async () => {
      try {
        console.log("Offline Mode: Fetching species from IndexedDB table 'species'");
        const offlineSpecies = await getAllEntries('species'); // Table name

        // Filter out entries marked for deletion locally (if feature is enabled later)
        const activeOfflineSpecies = offlineSpecies.filter(spec => spec._syncStatus !== 'deleted');

        // --- Process Data for Display ---
        const processedData = activeOfflineSpecies.map(spec => ({
          id: spec.species, // Use 'species' (primary key) as the DataGrid 'id'
          species: spec.species,
          shorthand: spec.shorthand,
          _syncStatus: spec._syncStatus || 'synced'
        }));

        setData(processedData);

      } catch (err) {
        console.error(`Error loading offline species:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadOfflineSpecies();
  }, []); // Run only once on mount

  // --- Handle Offline Deletion (Currently Disabled for Species) ---
  const handleDeleteOffline = async (idToDelete) => {
      alert("Offline deletion for Species is currently disabled for data integrity reasons.");
      /* // Example if deletion were enabled:
      const confirmation = window.confirm(`WARNING: Deleting Species "${idToDelete}" offline might orphan related data. Proceed?`);
      if (confirmation) {
          try {
              await markEntryAsDeleted('species', idToDelete); // Use primary key 'species'
              setData(currentData => currentData.filter(item => item.id !== idToDelete));
              alert(`Species "${idToDelete}" marked for deletion offline.`);
          } catch (err) {
              console.error(`Error marking species ${idToDelete} as deleted offline:`, err);
              alert(`Failed to mark species for deletion: ${err.message}`);
          }
      }
      */
  };

  // --- Define Columns ---
  const columns = [
    { field: "species", headerName: "Species", width: 200 },
    { field: "shorthand", headerName: "Shorthand", width: 200 },
    { field: '_syncStatus', headerName: 'Sync Status', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          {/* Edit Link - Can edit shorthand offline */}
          <Link to={`/material/species/edit/${params.id}?offline=true`} title="Edit Offline Shorthand" style={{ marginRight: '10px' }}>
             <FontAwesomeIcon icon={faEdit} />
          </Link>

          {/* Delete Button - Disabled for species */}
          {/* <button
            onClick={() => handleDeleteOffline(params.id)}
            style={{ color: '#aaa', background: 'none', border: 'none', cursor: 'not-allowed', padding: 0 }}
            title="Offline Deletion Disabled for Species"
            disabled // Disable the button
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button> */}
        </>
      ),
      width: 100,
    }
  ];

 // Link for adding a new species offline
 const addLinkOffline = "/material/species/add?offline=true";

  return (
    <div>
      <TableComponent
        addLink={addLinkOffline}
        // editLink prop not needed as it's handled in actions column
        status={"active"}
        material={"species"}
        rows={data}
        columns={columns}
        loading={loading}
        error={error}
        user={user}
        isOffline={true}
        // Explicitly disable delete if TableComponent needs it
        // disableDelete={true}
      />
    </div>
  );
}

export default SpeciesOfflineTab;