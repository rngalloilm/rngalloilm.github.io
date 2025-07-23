import React, { useState, useEffect } from "react";
import "../style/TableTab.css";
import TableComponent from './TableComponent';
import { getMaintenances } from "../services/api-client/maintenanceService";
import { getId } from "../services/api-client/idService";

function MaintenanceTab(props) {
  const [data, setData] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMaintenance() {
      let tempArray = [];
      await getMaintenances()
        .then(async (res) => {
          for (let maintenance in res.data) {
            let obj = {
              maintenanceId: res.data[maintenance].maintenanceId,
              maintenanceGeneticId: "",
              species: "",
              numberOfPlates: res.data[maintenance].numberOfPlates,
              mediaBatchCurr: res.data[maintenance].mediaBatchCurr,
              dateCurr: res.data[maintenance].dateCurr,
              mediaBatchPrev: res.data[maintenance].mediaBatchPrev,
              datePrev: res.data[maintenance].datePrev,
              transferDate: res.data[maintenance].transferDate,
              location: res.data[maintenance].locationId,
              active: res.data[maintenance].active
            };
            await getId(res.data[maintenance].maintenanceGeneticId)
            .then((res2) => {
              obj.maintenanceGeneticId = "P" + res2.data.populationId + "_" + res2.data.familyId + "_" + (res2.data.rametId ? res2.data.rametId : "NA") + "_" + res2.data.geneticId + "_" + res2.data.progenyId;
              obj.species = res2.data.species;
            }).catch((error) => {
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
    loadMaintenance();
  }, []);

  const rows = data.map((row) => ({
    id: row.maintenanceId,
    maintenanceId: row.maintenanceId,
    maintenanceGeneticId: row.maintenanceGeneticId,
    species: row.species,
    numberOfPlates: row.numberOfPlates,
    mediaBatchCurr: row.mediaBatchCurr,
    dateCurr: row.dateCurr.substring(0, 10),
    mediaBatchPrev: row.mediaBatchPrev ? row.mediaBatchPrev : "N/A",
    datePrev: row.datePrev ? row.datePrev.substring(0, 10) : "N/A",
    transferDate: row.transferDate.substring(0, 10),

    location: row.location
  }));

  const columns = [
    { field: "maintenanceId", headerName: "Maintenance ID", width: 150 },
    { field: "maintenanceGeneticId", headerName: "Genetic ID", width: 100 },
    { field: "species", headerName: "Species", width: 150 },
    { field: "numberOfPlates", headerName: "Number of Plates", width: 150 },
    { field: "mediaBatchCurr", headerName: "Current Media Batch", width: 150 },
    { field: "dateCurr", headerName: "Current Date", width: 150 },
    { field: "mediaBatchPrev", headerName: "Previous Media Batch", width: 150 },
    { field: "datePrev", headerName: "Previous Date", width: 150 },
    { field: "transferDate", headerName: "Transfer Date", width: 150 },
    { field: "location", headerName: "Location", width: 150 }
  ];


  return (
    <div>
      {data ? (
        <TableComponent propagateLink="/propagate/maintenance" editLink= "/material/maintenance/edit" addLink="/material/maintenance/add" status={"active"} material={"maintenance"} rows={rows} columns={columns} loading={loading1} error={error} user={props.user}/>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default MaintenanceTab;
