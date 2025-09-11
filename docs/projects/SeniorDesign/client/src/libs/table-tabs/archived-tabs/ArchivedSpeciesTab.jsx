import React, { useState, useEffect } from "react";
import { getSpecies } from "../../services/api-client/speciesService";

import TableComponent from "../TableComponent";
import "../../style/TableTab.css";

function ArchivedSpeciesTab(props) {
  const [data, setData] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadArchivedSpecies() {
      let tempArray = [];
      await getSpecies()
        .then(async (res) => {
          for (let s in res.data) {
            let obj = {
              species: res.data[s].species,
              shorthand: res.data[s].shorthand,
              active: res.data[s].active
            };
            if (!obj.active) {
              tempArray.push(obj);
            }
          }
          setData(tempArray);
          setLoading1(false);
        })
        .catch((error) => {
          setError(error);
          setLoading1(false);
        });
    }
    loadArchivedSpecies();
  }, []);

  const rows = data.map((row) => ({
   id: row.species,
   species: row.species,
   shorthand: row.shorthand,
  }));

  const columns = [
    {
      field: "species",
      headerName: "Species",
      width: 200,
    },
    {
      field: "shorthand",
      headerName: "Shorthand",
      width: 200,
    },
    
  ];

  return (
    <div>
      {data ? (
        <TableComponent
          addLink="/material/species/edit"
          editLink="/material/species/add"
          status={"archive"}
          material={"species"}
          rows={rows}
          columns={columns}
          loading={loading1}
          error={error}
          user={props.user}
        />
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default ArchivedSpeciesTab;