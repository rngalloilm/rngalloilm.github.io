import React, {useState, useEffect} from 'react'
import TableComponent from '../TableComponent'
import { getRamets } from '../../services/api-client/rametService'
import { getId } from '../../services/api-client/idService';
import "../../style/TableTab.css";

function ArchivedRametTab(props) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadRamets() {
      let tempArray = []
      await getRamets()
        .then(async (res) => { 
          for (let ramet in res.data) {
            let obj = {
              id: res.data[ramet].id,
              gps: res.data[ramet].gps,
              active: res.data[ramet].active,
              location: res.data[ramet].locationId,
              rametGeneticId: res.data[ramet].rametGeneticId,
              motherTreeId: res.data[ramet].motherTreeId,
            }
            await getId(res.data[ramet].rametGeneticId)
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
          setData(tempArray)
          setLoading(false)
        })
        .catch((error) => {
          setError(error)
          setLoading(false)
        })
    }
    loadRamets()
  }, [])

  const rows = data.map((row) => ({
    id: row.id,
    geneticId: row.geneticId,
    motherTreeId: row.motherTreeId,
    location: row.location,
    gps: row.gps,
    active: row.active,
  }))
  const columns = [
    {
      field: 'id',
      headerName: 'Ramet ID',
      width: 200,
    },
    {
      field: 'geneticId',
      headerName: 'Ramet Genetic ID',
      width: 200,
    },
    {
      field: 'motherTreeId',
      headerName: 'Mother Tree ID',
      width: 200,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 200,
    },
    {
      field: 'gps',
      headerName: 'GPS',
      width: 200,
    },
    {
      field: 'active',
      headerName: 'Active',
      width: 200,
    },
  ]

  return (
    <div>
      {data ? (
        <TableComponent editLink= "/material/ramet-material/edit" addLink="/material/ramet-material/add" status={"archive"} material={"ramet"} rows={rows} columns={columns} loading={loading} error={error} user={props.user}/>
      ) : (
        <p></p>
      )}
    </div>
  )
}

export default ArchivedRametTab