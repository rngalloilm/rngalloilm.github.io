import React, { useState, useEffect } from "react";
import "../style/TableTab.css";
import TableComponent from './TableComponent';
import { getFieldstations } from "../services/api-client/fieldstationService";
import { getId } from "../services/api-client/idService";

function FieldstationTab(props) {
  const [data, setData] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFieldstations() {
      let tempArray = [];
      await getFieldstations()
        .then(async (res) => {
          for (let fieldstation in res.data) {
            let obj = {
              fieldStationId: res.data[fieldstation].fieldStationId,
              fieldStationGeneticId: "",
              species: "",
              datePlanted: res.data[fieldstation].datePlanted,
              location: res.data[fieldstation].locationId,
              active: res.data[fieldstation].active
            };
            await getId(res.data[fieldstation].fieldStationGeneticId)
              .then((res2) => {
                obj.fieldStationGeneticId = "P" + res2.data.populationId + "_" + res2.data.familyId + "_" + (res2.data.rametId ? res2.data.rametId : "NA") + "_" + res2.data.geneticId + "_" + res2.data.progenyId;
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
    loadFieldstations();
  }, []);

  const rows = data.map((row) => ({
    id: row.fieldStationId,
    fieldStationId: row.fieldStationId,
    fieldStationGeneticId: row.fieldStationGeneticId,
    species: row.species,
    datePlanted: row.datePlanted.substring(0, 10),
    location: row.location
  }));

  const columns = [
    { field: "fieldStationId", headerName: "ID", width: 100 },
    { field: "fieldStationGeneticId", headerName: "Genetic ID", width: 200 },
    { field: "species", headerName: "Species", width: 150},
    { field: "datePlanted", headerName: "Date", width: 150 },
    { field: "location", headerName: "Location", width: 150 }
  ];


  return (
    <div>
      {data ? (
        <TableComponent editLink= "/material/fieldstation/edit" addLink="/material/fieldstation/add" status={"active"} material={"fieldstation"} rows={rows} columns={columns} loading={loading1} error={error} user={props.user} />
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default FieldstationTab;