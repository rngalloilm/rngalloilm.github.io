import React, { useState, useEffect } from "react";
import { getCones } from "../../services/api-client/coneService";
import { getId } from "../../services/api-client/idService";
import TableComponent from "../TableComponent";
import "../../style/TableTab.css";

function ArchivedConeTab(props) {
  const [data, setData] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCones() {
      let tempArray = [];
      await getCones()
        .then(async (res) => {
          for (let cone in res.data) {
            let obj = {
              coneId: res.data[cone].id,
              motherTreeId: res.data[cone].motherTreeId,
              fatherTreeId: res.data[cone].fatherTreeId,
              rametId: res.data[cone].rametId,
              locationId: res.data[cone].locationId,
              coneGeneticId: res.data[cone].coneGeneticId,
              geneticId: "",
              species: "",
              dateHarvested: res.data[cone].dateHarvested,
              active: res.data[cone].active,
            };
            await getId(res.data[cone].coneGeneticId)
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
          }
          console.log(tempArray);
          setData(tempArray);
          setLoading1(false);
        })
        .catch((error) => {
          setError(error);
          setLoading1(false);
        });
    }
    loadCones();
  }, []);

  const rows = data.map((row) => ({
    id: row.coneId,
    coneId: row.coneId,
    geneticId: row.geneticId,
    motherTreeId: row.motherTreeId ? row.motherTreeId : "N/A",
    fatherTreeId: row.fatherTreeId ? row.fatherTreeId : "N/A",
    species: row.species,
    location: row.locationId,
    dateHarvested: row.dateHarvested.substring(0, 10),
    active: row.active,
  }));

  const columns = [
    {
      field: "coneId",
      headerName: "Cone ID",
      width: 130,
    },
    {
      field: "geneticId",
      headerName: "Genetic ID",
      width: 170,
    },
    {
      field: "motherTreeId",
      headerName: "Mother ID",
      width: 130,
    },
    {
      field: "fatherTreeId",
      headerName: "Father ID",
      width: 130,
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
      field: "dateHarvested",
      headerName: "Date Harvested",
      width: 130,
    },
    {
      field: "active",
      headerName: "Active",
      width: 130,
    },
  ];

  return (
    <div>
      {data ? (
        <TableComponent editLink= "/material/cones/edit" addLink="/material/cones/add" status={"archive"} material={"cone"} rows={rows} columns={columns} loading={loading1} error={error} user={props.user}/>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default ArchivedConeTab;