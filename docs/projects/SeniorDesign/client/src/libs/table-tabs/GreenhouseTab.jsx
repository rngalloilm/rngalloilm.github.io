import React, { useState, useEffect } from "react";
import "../style/TableTab.css";
import TableComponent from './TableComponent';
import { getGreenhouses } from "../services/api-client/greenhouseService";
import { getId } from "../services/api-client/idService";

function GreenhouseTab(props) {
  const [data, setData] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGreenhouses() {
      let tempArray = [];
      await getGreenhouses()
        .then(async (res) => {
          for (let greenhouse in res.data) {
            let obj = {
              greenhouseId: res.data[greenhouse].greenhouseId,
              greenhouseGeneticId: "",
              species: "",
              dateGreenhouse: res.data[greenhouse].dateGreenhouse,
              transferDate: res.data[greenhouse].transferDate,
              location: res.data[greenhouse].locationId,
              active: res.data[greenhouse].active
            };
            await getId(res.data[greenhouse].greenhouseGeneticId)
              .then((res2) => {
                obj.greenhouseGeneticId = "P" + res2.data.populationId + "_" + res2.data.familyId + "_" + (res2.data.rametId ? res2.data.rametId : "NA") + "_" + res2.data.geneticId + "_" + res2.data.progenyId;
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
    loadGreenhouses();
  }, []);

  const rows = data.map((row) => ({
    id: row.greenhouseId,
    greenhouseId: row.greenhouseId,
    greenhouseGeneticId: row.greenhouseGeneticId,
    species: row.species,
    dateGreenhouse: row.dateGreenhouse.substring(0, 10),
    transferDate: row.transferDate.substring(0, 10),
    location: row.location
  }));

  const columns = [
    { field: "greenhouseId", headerName: "ID", width: 100 },
    { field: "greenhouseGeneticId", headerName: "Genetic ID", width: 200 },
    { field: "species", headerName: "Species", width: 150 },
    { field: "dateGreenhouse", headerName: "Date", width: 150 },
    { field: "transferDate", headerName: "Transfer Date", width: 150 },
    { field: "location", headerName: "Location", width: 150 }
  ];


  return (
    <div>
      {data ? (
        <TableComponent propagateLink="/propagate/greenhouse" editLink= "/material/greenhouse/edit" addLink="material/greenhouse/add" status={"active"} material={"greenhouse"} rows={rows} columns={columns} loading={loading1} error={error} user={props.user}/>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default GreenhouseTab;