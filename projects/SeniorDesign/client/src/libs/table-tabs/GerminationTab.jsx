import React, { useState, useEffect } from "react";
import "../style/TableTab.css";
import TableComponent from './TableComponent';
import { getGerminations } from "../services/api-client/germinationService";
import { getId } from "../services/api-client/idService";


function GerminationTab(props) {
  const [data, setData] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGerminations() {
      let tempArray = [];
      await getGerminations()
        .then(async (res) => {
          for (let germination in res.data) {
            let obj = {
              germinationId: res.data[germination].germinationId,
              mediaBatch: res.data[germination].mediaBatch,
              numberEmbryos: res.data[germination].numberEmbryos,
              germinationGeneticId: "",
              species: "",
              dateGermination: res.data[germination].dateGermination,
              transferDate: res.data[germination].transferDate,
              location: res.data[germination].locationId,
              active: res.data[germination].active
            };
            await getId(res.data[germination].germinationGeneticId)
            .then((res2) => {
              obj.germinationGeneticId = "P" + res2.data.populationId + "_" + res2.data.familyId + "_" + (res2.data.rametId ? res2.data.rametId : "NA") + "_" + res2.data.geneticId + "_" + res2.data.progenyId;
              obj.species = res2.data.species;
            })
            .catch((error) => {
              setError(error);
            });
            if (obj.active) {
              tempArray.push(obj);
            }
            setData(tempArray);
            setLoading1(false);
          }
        })
        .catch((error) => {
          setError(error);
          setLoading1(false);
        });
    }
    loadGerminations();
  }, []);

  const rows = data.map((row) => ({
    id: row.germinationId,
    germinationId: row.germinationId,
    seedsAndEmbryos: row.seedsAndEmbryos,
    mediaBatch: row.mediaBatch,
    numberEmbryos: row.numberEmbryos,
    germinationGeneticId: row.germinationGeneticId,
    species: row.species,
    dateGermination: row.dateGermination.substring(0, 10),
    transferDate: row.transferDate.substring(0, 10),
    location: row.location
  }));

  const columns = [
    { field: "germinationId", headerName: "ID", width: 100 },
    { field: "germinationGeneticId", headerName: "Genetic ID", width: 150},
    { field: "species", headerName: "Species", width: 150 },
    { field: "numberEmbryos", headerName: "Number of Plates", width: 150 },
    { field: "mediaBatch", headerName: "Media Batch", width: 150 },
    { field: "dateGermination", headerName: "Date", width: 150 },
    { field: "transferDate", headerName: "Transfer Date", width: 150 },
    { field: "location", headerName: "Location", width: 150 }
  ];


  return (
    <div>
      {data ? (
        <TableComponent propagateLink="/propagate/germination" editLink= "/material/germination/edit" addLink="/material/germination/add" status={"active"} material={"germination"} rows={rows} columns={columns} loading={loading1} error={error} user={props.user}/>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default GerminationTab;