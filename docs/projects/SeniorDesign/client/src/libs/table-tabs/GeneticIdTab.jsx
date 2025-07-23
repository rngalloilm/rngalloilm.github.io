import React, { useEffect, useState } from 'react';
import { getIds } from '../services/api-client/idService';
import TableComponent from './TableComponent';
import '../style/TableTab.css';

function GeneticIdTab(props) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGeneticIds() {
      let tempArray = [];
      await getIds()
        .then(async (res) => {
          for (let geneticId in res.data) {
            let obj = {
              id: res.data[geneticId].id,
              species: res.data[geneticId].species,
              populationId: res.data[geneticId].populationId,
              familyId: res.data[geneticId].familyId,
              rametId: res.data[geneticId].rametId,
              geneticId: res.data[geneticId].geneticId,
              progenyId: res.data[geneticId].progenyId,
              yearPlanted: res.data[geneticId].yearPlanted,
              active: res.data[geneticId].active,
              isCheckedOut: res.data[geneticId].isCheckedOut,
              checkedOutBy: res.data[geneticId].checkedOutBy
            };

            if(obj.active){
              tempArray.push(obj);
            }
          }
          setData(tempArray);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
    loadGeneticIds();
  }, []);

  const rows = data.map((row) => ({
    id: row.id,
    species: row.species,
    populationId: row.populationId,
    familyId: row.familyId,
    rametId: row.rametId ? row.rametId : "N/A",
    geneticId: row.geneticId,
    progenyId: row.progenyId,
    yearPlanted: row.yearPlanted,
  }));

  const columns = [
    { field: 'species', headerName: 'Species', width: 150 },
    { field: 'populationId', headerName: 'Population ID', width: 150 },
    { field: 'familyId', headerName: 'Family ID', width: 150 },
    { field: 'rametId', headerName: 'Ramet ID', width: 150},
    { field: 'geneticId', headerName: 'Genetic ID', width: 150 },
    { field: 'progenyId', headerName: 'Progeny ID', width: 150 },
    { field: 'yearPlanted', headerName: 'Year Planted', width: 150 },
  ];

  return (
      <div>
        {data ? <TableComponent editLink="/material/genetic-id/edit" addLink="/material/genetic-id/add"  status={"active"} material={"geneticId"} rows={rows} columns={columns} loading={loading} error={error} user={props.user}/> : <p></p>}
      </div>
  )
}

export default GeneticIdTab