import React, { useState, useEffect } from "react";
import "../style/TableTab.css";
import TableComponent from './TableComponent';
import { getColdTreatments } from "../services/api-client/coldTreatmentService";
import { getId } from "../services/api-client/idService";

function ColdTreatmentTab(props) {
  const [data, setData] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadColdTreatments() {
      let tempArray = [];
      await getColdTreatments()
        .then(async (res) => {
          for (let treatment in res.data) {
            let obj = {
              coldTreatmentId: res.data[treatment].coldTreatmentId,
              coldTreatmentGeneticId: "",
              species: "",
              duration: res.data[treatment].duration,
              numberEmbryos: res.data[treatment].numberEmbryos,
              dateCold: res.data[treatment].dateCold,
              transferDate: res.data[treatment].transferDate,
              location: res.data[treatment].locationId,
              active: res.data[treatment].active
            };
            await getId(res.data[treatment].coldTreatmentGeneticId)
            .then((res2) => {
              obj.coldTreatmentGeneticId = "P" + res2.data.populationId + "_" + res2.data.familyId + "_" + (res2.data.rametId ? res2.data.rametId : "NA") + "_" + res2.data.geneticId + "_" + res2.data.progenyId;
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
    loadColdTreatments();
  }, []);

  const rows = data.map((row) => ({
    id: row.coldTreatmentId,
    coldTreatmentId: row.coldTreatmentId,
    coldTreatmentGeneticId: row.coldTreatmentGeneticId,
    species: row.species,
    duration: row.duration,
    numberEmbryos: row.numberEmbryos,
    dateCold: row.dateCold.substring(0, 10),
    transferDate: row.transferDate.substring(0, 10),
    location: row.location
  }));

  const columns = [
    { field: "coldTreatmentId", headerName: "ID", width: 100 },
    { field: "coldTreatmentGeneticId", headerName: "Genetic ID", width: 150 },
    { field: "species", headerName: "Species", width: 150 },
    { field: "duration", headerName: "Duration", width: 150 },
    { field: "numberEmbryos", headerName: "Number of Embryos", width: 150 },
    { field: "dateCold", headerName: "Date", width: 150 },
    { field: "transferDate", headerName: "Transfer Date", width: 150 },
    { field: "location", headerName: "Location", width: 150 }
  ];


  return (
    <div>
      {data ? (
        <TableComponent propagateLink="/propagate/cold-treatment" editLink= "/material/cold-treatment/edit" addLink="/material/cold-treatment/add" status={"active"} material={"treatment"} rows={rows} columns={columns} loading={loading1} error={error} user={props.user} />
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default ColdTreatmentTab;