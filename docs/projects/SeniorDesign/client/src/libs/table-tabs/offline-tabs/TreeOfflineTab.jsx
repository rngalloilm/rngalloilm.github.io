// client/src/libs/table-tabs/TreeOfflineTab.jsx

import React, { useState, useEffect } from "react";
// Import IndexedDB functions
import { getAllEntries,  } from "../../../IndexedDB";
import TableComponent from "../TableComponent";
import "../../style/TableTab.css";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons"; // Example icons

function TreeOfflineTab(props) {
  const {user} = props; // Get user if needed for permissions
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Data from IndexedDB ---
  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadOfflineTrees = async () => {
      try {
        console.log("Offline Mode: Fetching trees from IndexedDB table 'trees'");
        const offlineTrees = await getAllEntries('trees');

        // Filter out entries marked for deletion locally
        const activeOfflineTrees = offlineTrees.filter(tree => tree._syncStatus !== 'deleted');

        // --- Process Data for Display ---
        // Construct the display data. How you display geneticId depends on what's stored offline.
        const processedData = activeOfflineTrees.map(tree => {
          // Option 1: Assume necessary parts are stored in the 'tree' object in IndexedDB
          const geneticIdStr = `P${tree.populationId || '?'}_${tree.familyId || '?'}_${tree.rametId || 'NA'}_${tree.geneticShortId || '?'}_${tree.progenyId || '?'}`;
          const speciesStr = tree.species || 'Unknown'; // Assuming species is stored too

          return {
            id: tree.treeId, // Use the actual primary key for the DataGrid's id
            treeId: tree.treeId,
            geneticId: geneticIdStr, // Display the constructed string
            species: speciesStr,
            locationId: tree.locationId, // Assuming locationId is stored
            gps: tree.gps,
            populationId: tree.populationId,
            familyId: tree.familyId,
            rametId: tree.rametId,
            progenyId: tree.progenyId,
            geneticShortId: tree.geneticShortId
            // active: tree.active, // 'active' might be less relevant if only showing non-deleted offline items
          };
        });

        setData(processedData);

      } catch (err) {
        console.error(`Error loading offline trees:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadOfflineTrees();
  }, []); // Run only once on mount

  // // --- Handle Offline Deletion ---
  // const handleDeleteOffline = async (idToDelete) => {
  //     const confirmation = window.confirm(`Are you sure you want to mark Tree ID ${idToDelete} for deletion? It will be removed on the next sync.`);
  //     if (confirmation) {
  //         try {
  //             await markEntryAsDeleted('trees', idToDelete);
  //             // Refresh local data view by removing the item visually
  //             setData(currentData => currentData.filter(item => item.id !== idToDelete));
  //             alert(`Tree ${idToDelete} marked for deletion offline.`);
  //         } catch (err) {
  //             console.error(`Error marking tree ${idToDelete} as deleted offline:`, err);
  //             alert(`Failed to mark tree for deletion: ${err.message}`);
  //         }
  //     }
  // };


  // --- Define Columns (including Actions) ---
  const columns = [
    { field: "treeId", headerName: "Tree ID", width: 130 },
    { field: "geneticId", headerName: "Genetic ID", width: 170 },
    { field: "locationId", headerName: "Location", width: 130 },
    { field: "gps", headerName: "GPS", width: 180 },
    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   sortable: false,
    //   filterable: false,
    //   renderCell: (params) => (
    //     <>
    //       {/* Edit Link - points to the form in offline mode */}
    //       <Link to={`/material/trees/edit/${params.id}?offline=true`} title="Edit Offline" style={{ marginRight: '10px' }}>
    //          <FontAwesomeIcon icon={faEdit} />
    //       </Link>

    //       {/* Delete Button - triggers offline soft delete */}
    //       {/* <button
    //         onClick={() => handleDeleteOffline(params.id)}
    //         style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    //         title="Mark for Deletion Offline"
    //       >
    //         <FontAwesomeIcon icon={faTrashAlt} />
    //       </button> */}
    //     </>
    //   ),
    //   width: 100,
    // }
  ];

 // Link for adding a new tree offline
 const addLinkOffline = "/material/trees/add?offline=true";
 const editLinkOffline = "/material/trees/edit";

  return (
    <div>
      {/* Pass offline-specific props or handle actions differently in TableComponent if needed */}
      <TableComponent
        addLink={addLinkOffline} // Use the offline add link
        editLink={editLinkOffline}
        status={"active"} 
        material={"tree"}
        rows={data} // Use the data fetched from IndexedDB
        columns={columns}
        loading={loading}
        error={error}
        user={user} // Pass user if TableComponent needs it for permissions
        // Do NOT include online-specific props like `archiveData` or `propagateData` unless they have offline implementations
        // If TableComponent needs to know it's offline to adjust behavior:
        isOffline={true} // Custom status to indicate offline mode
      />
    </div>
  );
}

export default TreeOfflineTab;