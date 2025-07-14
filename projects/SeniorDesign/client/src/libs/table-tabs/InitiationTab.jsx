import React, { useState, useEffect } from "react";
import "../style/TableTab.css";
import TableComponent from './TableComponent';
import { getInitiations } from "../services/api-client/initiationService";
import { getId } from "../services/api-client/idService";

function InitiationTab(props) {
  const [data, setData] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInitiations() {
      let tempArray = [];
      await getInitiations()
        .then(async (res) => {
          for (let initiation in res.data) {
            let obj = {
              initiationId: res.data[initiation].initiationId,
              initiationGeneticId: "",
              species: "",
              seedsAndEmbryos: res.data[initiation].seedsAndEmbryos,
              mediaBatch: res.data[initiation].mediaBatch,
              numberOfPlates: res.data[initiation].numberOfPlates,
              dateMade: res.data[initiation].dateMade,
              transferDate: res.data[initiation].transferDate,
              location: res.data[initiation].locationId,
              active: res.data[initiation].active
            };
            await getId(res.data[initiation].initiationGeneticId)
            .then((res2) => {
              obj.initiationGeneticId = "P" + res2.data.populationId + "_" + res2.data.familyId + "_" + (res2.data.rametId ? res2.data.rametId : "NA") + "_" + res2.data.geneticId + "_" + res2.data.progenyId;
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
    loadInitiations();
  }, []);

  const rows = data.map((row) => ({
    id: row.initiationId,
    initiationId: row.initiationId,
    initiationGeneticId: row.initiationGeneticId,
    species: row.species,
    seedsAndEmbryos: row.seedsAndEmbryos,
    mediaBatch: row.mediaBatch,
    numberOfPlates: row.numberOfPlates,
    dateMade: row.dateMade.substring(0, 10),
    transferDate: row.transferDate.substring(0, 10),
    location: row.location
  }));

  const columns = [
    { field: "initiationId", headerName: "ID", width: 100 },
    { field: "initiationGeneticId", headerName: "Genetic ID", width: 150 },
    { field: "species", headerName: "Species", width: 150 },
    { field: "seedsAndEmbryos", headerName: "Seeds and Embryos", width: 150 },
    { field: "mediaBatch", headerName: "Media Batch", width: 150 },
    { field: "numberOfPlates", headerName: "Number of Plates", width: 150 },
    { field: "dateMade", headerName: "Date", width: 150 },
    { field: "transferDate", headerName: "Transfer Date", width: 150 },
    { field: "location", headerName: "Location", width: 150 }
  ];


  return (
    <div>
      {data ? (
        <TableComponent propagateLink="/propagate/initiation" editLink= "/material/initiation/edit" addLink="/material/initiation/add" status={"active"} material={"initiation"} rows={rows} columns={columns} loading={loading1} error={error} user={props.user}/>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default InitiationTab;