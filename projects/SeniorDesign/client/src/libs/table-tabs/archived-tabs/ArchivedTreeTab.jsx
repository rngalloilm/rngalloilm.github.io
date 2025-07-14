import React, { useState, useEffect } from "react";
import { getTrees } from "../../services/api-client/treeService";
import { getId } from "../../services/api-client/idService";

import TableComponent from "../TableComponent";
import "../../style/TableTab.css";

function ArchivedTreeTab(props) {
  const [data, setData] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTrees() {
      let tempArray = [];
      await getTrees()
        .then(async (res) => {
          for (let tree in res.data) {
            let obj = {
              treeId: res.data[tree].treeId,
              treeGeneticId: res.data[tree].treeGeneticId,
              species: "",
              geneticId: "",
              locationId: res.data[tree].locationId,
              gps: res.data[tree].gps,
              active: res.data[tree].active,
            };
            await getId(res.data[tree].treeGeneticId)
              .then((res2) => {
                obj.geneticId =
                  "P" +
                  res2.data.populationId +
                  "_" +
                  res2.data.familyId +
                  "_" +
                  res2.data.geneticId +
                  "_" +
                  res2.data.progenyId;
                obj.species = res2.data.species;
              })
              .catch((error) => {
                setError(error);
              });
            if(!obj.active) {
              tempArray.push(obj);
            }
            //tempArray.push(obj);
          }
          //console.log(tempArray);
          setData(tempArray);
          setLoading1(false);
        })
        .catch((error) => {
          setError(error);
          setLoading1(false);
        });
    }
    loadTrees();
  }, []);

  const rows = data.map((row) => ({
    id: row.treeId,
    treeId: row.treeId,
    geneticId: row.geneticId,
    species: row.species,
    location: row.locationId,
    gps: row.gps,
    active: row.active,
  }));

  const columns = [
    {
      field: "treeId",
      headerName: "Tree ID",
      width: 130,
    },
    {
      field: "geneticId",
      headerName: "Genetic ID",
      width: 170,
    },
    {
      field: "species",
      headerName: "Species",
      width: 130,
    },
    {
      field: "location",
      headerName: "Location",
      width: 130,
    },
    {
      field: "gps",
      headerName: "GPS",
      width: 180,
    },
    {
      field: "active",
      headerName: "Active",
      width: 130,
    },
  ];

  // const initialFilterModel = {
  //   items: [{ columnField: "active", value: true }],
  // };

  return (
    <div>
      {data ? (
        <TableComponent
          addLink="/material/trees/edit"
          editLink="/material/trees/add"
          status={"archive"}
          material={"tree"}
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

export default ArchivedTreeTab;
