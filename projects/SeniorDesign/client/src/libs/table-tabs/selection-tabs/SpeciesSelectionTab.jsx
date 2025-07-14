import React, {useEffect, useState} from 'react';
import {getSpecies} from '../../services/api-client/speciesService';
import TableComponent from '../TableComponent';
import "../../style/TableTab.css";

function SpeciesTab(props) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadSpecies() {
      let tempArray = []
      await getSpecies()
        .then(async (res) => {
          for (let species in res.data) {
            let obj = {
              species: res.data[species].species,
              shorthand: res.data[species].shorthand,
              active:  res.data[species].active,
              isCheckedOut: res.data[species].isCheckedOut,
              checkedOutBy: res.data[species].checkedOutBy
            }
            if (obj.active) {
              console.log("active is true");
              tempArray.push(obj)
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
    loadSpecies()
  }, [])

  const rows = data.map((row) => ({
    id: row.species,
    species: row.species,
    shorthand: row.shorthand,
    active: row.active,
  }))
  const columns = [
    {
      field: 'species',
      headerName: 'Species',
      width: 200,
    },
    {
      field: 'shorthand',
      headerName: 'Shorthand',
      width: 200,
    },
    {
      field: 'isCheckedOut',
      headerName: 'isCheckedOut',
      width: 200,
    },
  ]


  return (
    <div>
      {data ? <TableComponent editLink="/material/species/edit" addLink="/material/species/add" status={"active"} material={"species"} rows={rows} columns={columns} loading={loading} error={error} user={props.user} isOfflineSelection={true}/> : <p></p>}
    </div>
  )
}

export default SpeciesTab