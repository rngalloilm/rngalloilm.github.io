// client/src/libs/table-tabs/SeedOfflineTab.jsx

import React, { useState, useEffect } from "react";
// Offline imports
import { getAllEntries, markEntryAsDeleted } from "../../../IndexedDB";
import TableComponent from "../TableComponent";
import "../../style/TableTab.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faFilePdf } from "@fortawesome/free-solid-svg-icons"; // Add PDF icon

function SeedOfflineTab(props) {
  const { user } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Data from IndexedDB ---
  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadOfflineSeeds = async () => {
      try {
        console.log("Offline Mode: Fetching seeds from IndexedDB table 'seeds'");
        const offlineSeeds = await getAllEntries('seeds');

        // Filter out entries marked for deletion locally
        const activeOfflineSeeds = offlineSeeds.filter(seed => seed._syncStatus !== 'deleted');

        // --- Process Data for Display ---
        // Assumes genetic parts are stored within the seed object in IndexedDB
        const processedData = activeOfflineSeeds.map(seed => {
          const speciesStr = seed.species || 'Unknown'; // Assuming species is stored

          return {
            id: seed.id, // Use the primary key for DataGrid
            seedId: seed.id, // Keep original field name if needed
            geneticId: seed.geneticId,
            species: speciesStr,
            motherTreeId: seed.motherTreeId || "N/A",
            coneId: seed.coneId || "N/A",
            fatherTreeId: seed.fatherTreeId || "N/A",
            origin: seed.origin,
            quantity: seed.quantity,
            dateMade: seed.dateMade ? seed.dateMade.substring(0, 10) : "N/A",
            transferDate: seed.transferDate ? seed.transferDate.substring(0, 10) : "N/A", // Assuming transferDate is stored
            locationId: seed.locationId, // Assuming locationId is stored
            _syncStatus: seed._syncStatus || 'synced'
          };
        });

        setData(processedData);

      } catch (err) {
        console.error(`Error loading offline seeds:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadOfflineSeeds();
  }, []); // Run only once on mount

  // --- Handle Offline Deletion ---
  // const handleDeleteOffline = async (idToDelete) => {
  //     const confirmation = window.confirm(`Are you sure you want to mark Seed ID ${idToDelete} for deletion? It will be removed on the next sync.`);
  //     if (confirmation) {
  //         try {
  //             await markEntryAsDeleted('seeds', idToDelete); // Change table name
  //             // Refresh local data view
  //             setData(currentData => currentData.filter(item => item.id !== idToDelete));
  //             alert(`Seed ${idToDelete} marked for deletion offline.`);
  //         } catch (err) {
  //             console.error(`Error marking seed ${idToDelete} as deleted offline:`, err);
  //             alert(`Failed to mark seed for deletion: ${err.message}`);
  //         }
  //     }
  // };

  // --- Define Columns ---
  const columns = [
    // Match columns from SeedTab.jsx
    { field: "id", headerName: "Seed ID", width: 100 },
    { field: "geneticId", headerName: "Genetic ID", width: 170 },
    { field: "motherTreeId", headerName: "Mother Tree ID", width: 150 },
    { field: "coneId", headerName: "Cone ID", width: 150 },
    { field: "fatherTreeId", headerName: "Father Tree ID", width: 150 },
    { field: "origin", headerName: "Origin", width: 150 },
    { field: "quantity", headerName: "Quantity", width: 150 },
    { field: "dateMade", headerName: "Date Made", width: 150 },
    { field: "transferDate", headerName: "Transfer Date", width: 150 },
    { field: "locationId", headerName: "Location", width: 150 },
    { field: '_syncStatus', headerName: 'Sync Status', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Edit Link - points to the form in offline mode */}
          <Link to={`/material/seeds/edit/${params.id}?offline=true`} title="Edit Offline">
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
           
        </div>
      ),
      width: 120, // Adjust width if needed
    }
  ];

 // Link for adding a new seed offline
 const addLinkOffline = "/material/seeds/add?offline=true";

  return (
    <div>
      <TableComponent
        addLink={addLinkOffline}
        status={"active"}
        material={"seed"} // Use 'seed' consistently
        rows={data}
        columns={columns}
        loading={loading}
        error={error}
        user={user}
        isOffline={true}
        // Do not include propagateLink as propagation is likely an online-only action
      />
    </div>
  );
}

export default SeedOfflineTab;