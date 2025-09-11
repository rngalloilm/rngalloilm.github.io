// client/src/libs/table-tabs/archived-tabs/ArchivedPopulationTab.jsx

import React, { useState, useEffect } from "react";
import { getPopulations } from "../../services/api-client/populationService"; // Import your service

import TableComponent from "../TableComponent";
import "../../style/TableTab.css";

function ArchivedPopulationTab(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadArchivedPopulations() {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors
      let tempArray = [];
      try {
        const res = await getPopulations(); // Fetch all populations
        for (let population of res.data) { // Use for...of for arrays
            // Check if the 'active' field exists and is explicitly false
            if (population.hasOwnProperty('active') && population.active === false) {
                tempArray.push({
                  // Map to the structure needed by the table
                  populationId: population.id,
                  // Add other fields here if your Population model has more
                });
            }
        }
        setData(tempArray);
      } catch (error) {
        console.error("Error fetching or processing populations:", error);
        setError(error); // Set error state
      } finally {
        setLoading(false); // End loading regardless of success/failure
      }
    }
    loadArchivedPopulations();
  }, []); // Empty dependency array means run once on mount

  // Map the filtered data for the TableComponent rows
  const rows = data.map((row) => ({
   id: row.populationId, // Use populationId as the unique id for the DataGrid row
   populationId: row.populationId,
   // Add other properties if needed for display
  }));

  // Define columns for the table
  const columns = [
    {
      field: "populationId",
      headerName: "Population ID",
      width: 200,
    },
    // Add other columns here if your Population model has more displayable fields
    // { field: "description", headerName: "Description", width: 300 }, // Example
  ];

  return (
    <div>
      {/* Conditionally render TableComponent based on loading/error state could be added */}
      <TableComponent
        // No addLink or editLink for archived items typically
        addLink={null} // Or a link to an "unarchive" action if implemented
        editLink={null}
        status={"archive"} // Indicate this shows archived data
        material={"population"}
        rows={rows}
        columns={columns}
        loading={loading} // Pass loading state
        error={error} // Pass error state
        user={props.user} // Pass user prop down
        // Disable actions that don't make sense for archived basic data
        // disableDelete={true}
        // disableEdit={true}
      />
      {/* Optional: Display loading or error messages directly */}
      {loading && <p style={{color: 'white', textAlign: 'center'}}>Loading archived populations...</p>}
      {error && <p style={{color: 'red', textAlign: 'center'}}>Error loading data: {error.message}</p>}
    </div>
  );
}

export default ArchivedPopulationTab;