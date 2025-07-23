// client/src/libs/table-tabs/GeneticIdOfflineTab.jsx

import React, { useState, useEffect } from "react";
// Offline imports
import { getAllEntries, markEntryAsDeleted } from "../../../IndexedDB"; // Assuming no offline delete for GeneticID for now
import TableComponent from "../TableComponent";
import "../../style/TableTab.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons"; // Only edit icon needed

function GeneticIdOfflineTab(props) {
  const { user } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Data from IndexedDB ---
  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadOfflineGeneticIds = async () => {
      try {
        console.log("Offline Mode: Fetching genetic IDs from IndexedDB table 'geneticIds'");
        const offlineIds = await getAllEntries('geneticIds'); // Table name assumed 'geneticIds'

        // Filter out entries potentially marked for deletion if that feature is added later
        const activeOfflineIds = offlineIds.filter(idEntry => idEntry._syncStatus !== 'deleted');

        // --- Process Data for Display ---
        // The structure in IndexedDB should be close to what's needed
        const processedData = activeOfflineIds.map(idEntry => {
          return {
            id: idEntry.id, // Use the auto-incremented ID as the key for DataGrid
            species: idEntry.species,
            populationId: idEntry.populationId,
            familyId: idEntry.familyId,
            rametId: idEntry.rametId || "N/A", // Handle null rametId
            geneticId: idEntry.geneticId,
            progenyId: idEntry.progenyId,
            yearPlanted: idEntry.yearPlanted,
            _syncStatus: idEntry._syncStatus || 'synced'
          };
        });

        setData(processedData);

      } catch (err) {
        console.error(`Error loading offline genetic IDs:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadOfflineGeneticIds();
  }, []); // Run only once on mount

  // --- Handle Offline Deletion (Commented out - Deleting Genetic IDs offline is risky) ---
  /*
  const handleDeleteOffline = async (idToDelete) => {
      const confirmation = window.confirm(`WARNING: Deleting Genetic ID ${idToDelete} offline might orphan related data. Proceed?`);
      if (confirmation) {
          try {
              await markEntryAsDeleted('geneticIds', idToDelete); // Change table name
              // Refresh local data view
              setData(currentData => currentData.filter(item => item.id !== idToDelete));
              alert(`Genetic ID ${idToDelete} marked for deletion offline.`);
          } catch (err) {
              console.error(`Error marking Genetic ID ${idToDelete} as deleted offline:`, err);
              alert(`Failed to mark Genetic ID for deletion: ${err.message}`);
          }
      }
  };
  */

  // --- Define Columns ---
  const columns = [
    // Match columns from GeneticIdTab.jsx
    { field: 'geneticId', headerName: 'Genetic ID', width: 150 },
    { field: 'populationId', headerName: 'Population ID', width: 150 },
    { field: 'familyId', headerName: 'Family ID', width: 150 },
    { field: 'rametId', headerName: 'Ramet ID', width: 150},
    { field: 'progenyId', headerName: 'Progeny ID', width: 150 },
    { field: '_syncStatus', headerName: 'Sync Status', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          {/* Edit Link - points to the form in offline mode */}
          {/* Note: Editing Genetic IDs might also be complex/risky depending on relationships */}
          <Link to={`/material/genetic-id/edit/${params.id}?offline=true`} title="Edit Offline (Use with Caution)" style={{ marginRight: '10px' }}>
             <FontAwesomeIcon icon={faEdit} />
          </Link>

          {/* Delete Button - Omitted for safety */}
          {/*
          <button
            onClick={() => handleDeleteOffline(params.id)}
            style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            title="Mark for Deletion Offline (Risky)"
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
          */}
        </>
      ),
      width: 100,
    }
  ];

 // Link for adding a new Genetic ID offline
 const addLinkOffline = "/material/genetic-id/add?offline=true";

  return (
    <div>
      <TableComponent
        addLink={addLinkOffline}
        status={"active"}
        material={"geneticId"} // Use 'geneticId' consistently
        rows={data}
        columns={columns}
        loading={loading}
        error={error}
        user={user}
        isOffline={true}
        // Omit delete/archive functionality for Genetic IDs in offline mode by default
      />
    </div>
  );
}

export default GeneticIdOfflineTab;