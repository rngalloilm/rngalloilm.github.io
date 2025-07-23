// client/src/libs/table-tabs/RametOfflineTab.jsx

import React, { useState, useEffect } from "react";
// Offline imports
import { getAllEntries, markEntryAsDeleted } from "../../../IndexedDB";
import TableComponent from "../TableComponent";
import "../../style/TableTab.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

function RametOfflineTab(props) {
  const { user } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Data from IndexedDB ---
  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadOfflineRamets = async () => {
      try {
        console.log("Offline Mode: Fetching ramets from IndexedDB table 'ramets'");
        const offlineRamets = await getAllEntries('ramets'); // Table name

        // Filter out entries marked for deletion locally
        const activeOfflineRamets = offlineRamets.filter(ramet => ramet._syncStatus !== 'deleted');

        // --- Process Data for Display ---
        // Assumes genetic parts are stored in the ramet object offline
        const processedData = activeOfflineRamets.map(ramet => {
           const geneticIdStr = `P${ramet.populationId || '?'}_${ramet.familyId || '?'}_${ramet.rametId || 'NA'}_${ramet.geneticId || '?'}_${ramet.progenyId || '?'}`;
           // Species might need to be stored separately or looked up if needed for display
           // const speciesStr = ramet.species || 'Unknown';

          return {
            id: ramet.id, // Use the primary key for DataGrid
            rametId: ramet.id, // Keep original field name if needed
            geneticId: ramet.geneticId, // Display constructed ID
            motherTreeId: ramet.motherTreeId || "N/A",
            location: ramet.location, // Assuming locationId is stored
            gps: ramet.gps,
             // active: ramet.active // Might not be needed if only showing non-deleted
            _syncStatus: ramet._syncStatus || 'synced'
          };
        });

        setData(processedData);

      } catch (err) {
        console.error(`Error loading offline ramets:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadOfflineRamets();
  }, []); // Run only once on mount

  // --- Handle Offline Deletion ---
  // const handleDeleteOffline = async (idToDelete) => {
  //     const confirmation = window.confirm(`Are you sure you want to mark Ramet ID ${idToDelete} for deletion? It will be removed on the next sync.`);
  //     if (confirmation) {
  //         try {
  //             await markEntryAsDeleted('ramets', idToDelete); // Change table name
  //             // Refresh local data view
  //             setData(currentData => currentData.filter(item => item.id !== idToDelete));
  //             alert(`Ramet ${idToDelete} marked for deletion offline.`);
  //         } catch (err) {
  //             console.error(`Error marking ramet ${idToDelete} as deleted offline:`, err);
  //             alert(`Failed to mark ramet for deletion: ${err.message}`);
  //         }
  //     }
  // };

  // --- Define Columns ---
  const columns = [
    // Match columns from RametTab.jsx where applicable
    { field: 'id', headerName: 'Ramet ID', width: 200 },
    { field: 'geneticId', headerName: 'Ramet Genetic ID', width: 200 },
    { field: 'motherTreeId', headerName: 'Mother Tree ID', width: 200 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'gps', headerName: 'GPS', width: 200 },
    { field: '_syncStatus', headerName: 'Sync Status', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          {/* Edit Link - points to the form in offline mode */}
          <Link to={`/material/ramet-material/edit/${params.id}?offline=true`} title="Edit Offline" style={{ marginRight: '10px' }}>
             <FontAwesomeIcon icon={faEdit} />
          </Link>

          {/* Delete Button - triggers offline soft delete */}
          {/* <button
            onClick={() => handleDeleteOffline(params.id)}
            style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            title="Mark for Deletion Offline"
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button> */}
        </>
      ),
      width: 100,
    }
  ];

 // Link for adding a new ramet offline
 const addLinkOffline = "/material/ramet-material/add?offline=true";

  return (
    <div>
      <TableComponent
        addLink={addLinkOffline}
        status={"active"}
        material={"ramet"} // Use 'ramet' consistently
        rows={data}
        columns={columns}
        loading={loading}
        error={error}
        user={user}
        isOffline={true}
      />
    </div>
  );
}

export default RametOfflineTab;