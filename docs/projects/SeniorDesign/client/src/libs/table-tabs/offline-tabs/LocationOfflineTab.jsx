// client/src/libs/table-tabs/LocationOfflineTab.jsx

import React, { useState, useEffect } from "react";
// Offline imports
import { getAllEntries, markEntryAsDeleted } from "../../../IndexedDB"; // Import necessary functions
import TableComponent from "../TableComponent";
import "../../style/TableTab.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

function LocationOfflineTab(props) {
  const { user } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Data from IndexedDB ---
  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadOfflineLocations = async () => {
      try {
        console.log("Offline Mode: Fetching locations from IndexedDB table 'locations'");
        const offlineLocations = await getAllEntries('locations');

        // Filter out entries marked for deletion locally (if feature is enabled later)
        const activeOfflineLocations = offlineLocations.filter(loc => loc._syncStatus !== 'deleted');

        // --- Process Data for Display ---
        const processedData = activeOfflineLocations.map(loc => ({
          id: loc.location, // Use 'location' (primary key) as the DataGrid 'id'
          location: loc.location,
          shorthand: loc.shorthand,
          // uniqueId: loc.uniqueId, // Include if needed for display/linking
          _syncStatus: loc._syncStatus || 'synced'
        }));

        setData(processedData);

      } catch (err) {
        console.error(`Error loading offline locations:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadOfflineLocations();
  }, []); // Run only once on mount

  // --- Handle Offline Deletion (Currently Disabled for Locations) ---
  const handleDeleteOffline = async (idToDelete) => {
      alert("Offline deletion for Locations is currently disabled for data integrity reasons.");
      /* // Example if deletion were enabled:
      const confirmation = window.confirm(`WARNING: Deleting Location "${idToDelete}" offline might orphan related data. Proceed?`);
      if (confirmation) {
          try {
              await markEntryAsDeleted('locations', idToDelete); // Use primary key 'location'
              setData(currentData => currentData.filter(item => item.id !== idToDelete));
              alert(`Location "${idToDelete}" marked for deletion offline.`);
          } catch (err) {
              console.error(`Error marking location ${idToDelete} as deleted offline:`, err);
              alert(`Failed to mark location for deletion: ${err.message}`);
          }
      }
      */
  };

  // --- Define Columns ---
  const columns = [
    { field: "location", headerName: "Location", width: 200 },
    { field: "shorthand", headerName: "Shorthand", width: 200 },
    { field: '_syncStatus', headerName: 'Sync Status', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          {/* Edit Link - points to the form in offline mode */}
          <Link to={`/material/location/edit/${params.id}?offline=true`} title="Edit Offline" style={{ marginRight: '10px' }}>
             <FontAwesomeIcon icon={faEdit} />
          </Link>

          {/* Delete Button - Disabled for locations */}
          {/* <button
            onClick={() => handleDeleteOffline(params.id)}
            style={{ color: '#aaa', background: 'none', border: 'none', cursor: 'not-allowed', padding: 0 }}
            title="Offline Deletion Disabled for Locations"
            disabled // Disable the button
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button> */}
        </>
      ),
      width: 100,
    }
  ];

 // Link for adding a new location offline
 const addLinkOffline = "/material/location/add?offline=true";

  return (
    <div>
      <TableComponent
        addLink={addLinkOffline}
        status={"active"}
        material={"location"}
        rows={data}
        columns={columns}
        loading={loading}
        error={error}
        user={user}
        isOffline={true}
        // Explicitly disable delete actions in TableComponent if it has separate logic
        // disableDelete={true}
      />
    </div>
  );
}

export default LocationOfflineTab;