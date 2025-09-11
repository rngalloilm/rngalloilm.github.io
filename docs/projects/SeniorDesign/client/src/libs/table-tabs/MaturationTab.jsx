import React, { useState, useEffect } from "react";
import "../style/TableTab.css";
import TableComponent from './TableComponent';
import { getMaturations } from "../services/api-client/maturationService";
import { getId } from "../services/api-client/idService";

function MaturationTab(props) {
  const [data, setData] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMaturations() {
      let tempArray = [];
      await getMaturations()
        .then(async (res) => {
          for (let maturation in res.data) {
            let obj = {
              maturationId: res.data[maturation].maturationId,
              maturationGeneticId: "",
              species: "",
              mediaBatch: res.data[maturation].mediaBatch,
              numberOfPlates: res.data[maturation].numberOfPlates,
              dateMatured: res.data[maturation].dateMatured,
              transferDate: res.data[maturation].transferDate,
              location: res.data[maturation].locationId,
              active: res.data[maturation].active
            };
            await getId(res.data[maturation].maturationGeneticId)
              .then((res2) => {
                obj.maturationGeneticId = "P" + res2.data.populationId + "_" + res2.data.familyId + "_" + (res2.data.rametId ? res2.data.rametId : "NA") + "_" + res2.data.geneticId + "_" + res2.data.progenyId;
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
    loadMaturations();
  }, []);

  const rows = data.map((row) => ({
    id: row.maturationId,
    maturationId: row.maturationId,
    maturationGeneticId: row.maturationGeneticId,
    species: row.species,
    mediaBatch: row.mediaBatch,
    numberOfPlates: row.numberOfPlates,
    dateMatured: row.dateMatured.substring(0, 10),
    transferDate: row.transferDate.substring(0, 10),
    location: row.location
  }));

  const columns = [
    { field: "maturationId", headerName: "ID", width: 100 },
    { field: "maturationGeneticId", headerName: "Genetic ID", width: 150 },
    { field: "species", headerName: "Species", width: 150 },
    { field: "mediaBatch", headerName: "Media Batch", width: 150 },
    { field: "numberOfPlates", headerName: "Number of Plates", width: 150 },
    { field: "dateMatured", headerName: "Date", width: 150 },
    { field: "transferDate", headerName: "Transfer Date", width: 150 },
    { field: "location", headerName: "Location", width: 150 }
  ];


  return (
    <div>
      {data ? (
        <TableComponent propagateLink="/propagate/maturation" editLink= "/material/maturation/edit" addLink="/material/maturation/add" status={"active"} material={"maturation"} rows={rows} columns={columns} loading={loading1} error={error} user={props.user}/>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default MaturationTab;