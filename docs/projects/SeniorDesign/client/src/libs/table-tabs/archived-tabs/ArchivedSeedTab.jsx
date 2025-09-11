import React, { useState, useEffect } from "react";
import "../../style/TableTab.css";
import TableComponent from '../TableComponent';
import { getSeeds } from "../../services/api-client/seedService";
import { getId } from "../../services/api-client/idService";


function ArchivedSeedTab(props) {
  const [data, setData] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSeeds() {
      let tempArray = [];
      await getSeeds()
        .then(async (res) => {
          for (let seed in res.data) {
            let obj = {
              seedId: res.data[seed].id,
              seedGeneticId: res.data[seed].seedGeneticId,
              geneticId: '',
              species: '',
              motherTreeId: res.data[seed].motherTreeId,
              coneId: res.data[seed].coneId,
              fatherTreeId: res.data[seed].fatherTreeId,
              origin: res.data[seed].origin,
              quantity: res.data[seed].quantity,
              dateMade: res.data[seed].dateMade,
              locationId: res.data[seed].locationId,
              active: res.data[seed].active
            };
           await getId(res.data[seed].seedGeneticId)
              .then((res2) => {
                obj.geneticId =
                  "P" +
                  res2.data.populationId +
                  "_" +
                  res2.data.familyId +
                  "_" +
                  (res2.data.rametId ? res2.data.rametId : "NA") +
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
            setData(tempArray);
            setLoading1(false);
          }
        })
        .catch((error) => {
          setError(error);
          setLoading1(false);
        });
    }
    loadSeeds();
  }, []);

  const rows = data.map((row) => ({
    id: row.seedId,
    geneticId: row.geneticId,
    species: row.species,
    motherTreeId: row.motherTreeId ? row.motherTreeId : "N/A",
    coneId: row.coneId ? row.coneId : "N/A",
    fatherTreeId: row.fatherTreeId ? row.fatherTreeId : "N/A",
    origin: row.origin,
    quantity: row.quantity,
    dateMade: row.dateMade.substring(0, 10),
    locationId: row.locationId,
    active: row.active
  }));

  const columns = [
    { field: "id", headerName: "Seed ID", width: 100 },
    { field: "geneticId", headerName: "Genetic ID", width: 170 },
    { field: "species", headerName: "Species", width: 150 },
    { field: "motherTreeId", headerName: "Mother Tree ID", width: 150 },
    { field: "coneId", headerName: "Cone ID", width: 150 },
    { field: "fatherTreeId", headerName: "Father Tree ID", width: 150 },
    { field: "origin", headerName: "Origin", width: 150 },
    { field: "quantity", headerName: "Quantity", width: 150 },
    { field: "dateMade", headerName: "Date Made", width: 150 },
    { field: "locationId", headerName: "Location", width: 150 },
    { field: "active", headerName: "Active", width: 150 },
  ];


  return (
    <div>
      {data ? (
        <TableComponent editLink= "/material/seed-material/edit" addLink="/material/seed-material/add" status={"archive"} material={"seed"} rows={rows} columns={columns} loading={loading1} error={error} user={props.user}/>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default ArchivedSeedTab;