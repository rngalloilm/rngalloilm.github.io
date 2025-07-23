// client/src/libs/table-tabs/ConeOfflineTab.jsx

import React, { useState, useEffect } from "react";
// Import IndexedDB functions
import { getAllEntries, markEntryAsDeleted } from "../../../IndexedDB";
import TableComponent from "../TableComponent";
import "../../style/TableTab.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons"; // Example icons

function ConeOfflineTab(props) {
  const { user } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Data from IndexedDB ---
  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadOfflineCones = async () => {
      try {
        console.log("Offline Mode: Fetching cones from IndexedDB table 'cones'");
        const offlineCones = await getAllEntries('cones'); // Change table name

        // Filter out entries marked for deletion locally
        const activeOfflineCones = offlineCones.filter(cone => cone._syncStatus !== 'deleted');

        // --- Process Data for Display ---
        // Assumes necessary genetic parts are stored within the cone object in IndexedDB during checkout
        const processedData = activeOfflineCones.map(cone => {
          const geneticIdStr = `P${cone.populationId || '?'}_${cone.familyId || '?'}_${cone.rametId || 'NA'}_${cone.geneticId || '?'}_${cone.progenyId || '?'}`;
          const speciesStr = cone.species || 'Unknown'; // Assuming species is stored

          return {
            id: cone.id, // Use the primary key for DataGrid
            coneId: cone.id, // Keep original field name if needed elsewhere
            geneticId: cone.geneticId,
            motherTreeId: cone.motherTreeId || "N/A",
            fatherTreeId: cone.fatherTreeId || "N/A",
            species: speciesStr,
            location: cone.locationId, // Assuming locationId is stored
            dateHarvested: cone.dateHarvested ? cone.dateHarvested.substring(0, 10) : "N/A",
            _syncStatus: cone._syncStatus || 'synced'
          };
        });

        setData(processedData);

      } catch (err) {
        console.error(`Error loading offline cones:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadOfflineCones();
  }, []); // Run only once on mount

  // // --- Handle Offline Deletion ---
  // const handleDeleteOffline = async (idToDelete) => {
  //     const confirmation = window.confirm(`Are you sure you want to mark Cone ID ${idToDelete} for deletion? It will be removed on the next sync.`);
  //     if (confirmation) {
  //         try {
  //             await markEntryAsDeleted('cones', idToDelete); // Change table name
  //             // Refresh local data view
  //             setData(currentData => currentData.filter(item => item.id !== idToDelete));
  //             alert(`Cone ${idToDelete} marked for deletion offline.`);
  //         } catch (err) {
  //             console.error(`Error marking cone ${idToDelete} as deleted offline:`, err);
  //             alert(`Failed to mark cone for deletion: ${err.message}`);
  //         }
  //     }
  // };

  // --- Define Columns ---
  const columns = [
    // Match columns from ConeTab.jsx where applicable
    { field: "coneId", headerName: "Cone ID", width: 130 },
    { field: "geneticId", headerName: "Genetic ID", width: 170 },
    { field: "motherTreeId", headerName: "Mother ID", width: 130 },
    { field: "fatherTreeId", headerName: "Father ID", width: 130 },
    { field: "species", headerName: "Species", width: 130 },
    { field: "location", headerName: "Location", width: 130 },
    { field: "dateHarvested", headerName: "Date Harvested", width: 130 },
    { field: '_syncStatus', headerName: 'Sync Status', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Link to={`/material/cones/edit/${params.id}?offline=true`} title="Edit Offline" style={{ marginRight: '10px' }}>
             <FontAwesomeIcon icon={faEdit} />
          </Link>
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

  // Link for adding a new cone offline
  const addLinkOffline = "/material/cones/add?offline=true";

  return (
    <div>
      <TableComponent
        addLink={addLinkOffline}
        status={"active"}
        material={"cone"} // Use 'cone' consistently
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

export default ConeOfflineTab;