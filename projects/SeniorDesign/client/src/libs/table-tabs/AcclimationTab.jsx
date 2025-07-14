import React, { useState, useEffect } from "react";
import "../style/TableTab.css";
import TableComponent from './TableComponent';
import { getAcclimations } from "../services/api-client/acclimationService";
import { getId } from "../services/api-client/idService";

function AcclimationTab(props) {
  const [data, setData] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAcclimations() {
      let tempArray = [];
      await getAcclimations()
        .then(async (res) => {
          for (let acclimation in res.data) {
            let obj = {
              acclimationId: res.data[acclimation].acclimationId,
              acclimationGeneticId: "",
              species: "",
              dateAcclimation: res.data[acclimation].dateAcclimation,
              transferDate: res.data[acclimation].transferDate,
              location: res.data[acclimation].locationId,
              active: res.data[acclimation].active
            };
            await getId(res.data[acclimation].acclimationGeneticId)
              .then((res2) => {
                obj.acclimationGeneticId = "P" + res2.data.populationId + "_" + res2.data.familyId + "_" + (res2.data.rametId ? res2.data.rametId : "NA") + "_" + res2.data.geneticId + "_" + res2.data.progenyId;
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
    loadAcclimations();
  }, []);

  const rows = data.map((row) => ({
    id: row.acclimationId,
    acclimationId: row.acclimationId,
    acclimationGeneticId: row.acclimationGeneticId,
    species: row.species,
    dateAcclimation: row.dateAcclimation.substring(0, 10),
    transferDate: row.transferDate.substring(0, 10),
    location: row.location
  }));

  const columns = [
    { field: "acclimationId", headerName: "ID", width: 100 },
    { field: "acclimationGeneticId", headerName: "Genetic ID", width: 200 },
    { field: "species", headerName: "Species", width: 150 },
    { field: "dateAcclimation", headerName: "Date", width: 150 },
    { field: "transferDate", headerName: "Transfer Date", width: 150 },
    { field: "location", headerName: "Location", width: 150 }
  ];


  return (
    <div>
      {data ? (
        <TableComponent propagateLink="/propagate/acclimation" editLink= "/material/acclimation/edit" addLink="/material/acclimation/add" status={"active"} material={"acclimation"} rows={rows} columns={columns} loading={loading1} error={error} user={props.user} />
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default AcclimationTab;
