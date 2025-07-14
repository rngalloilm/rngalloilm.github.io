import React, { useEffect, useState } from 'react';
import { getPopulations } from '../services/api-client/populationService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import TableComponent from './TableComponent';
import '../style/TableTab.css';

function PopulationTab(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPopulations() {
      let tempArray = [];
      await getPopulations()
        .then(async (res) => {
          for (let population in res.data) {
            
            let obj = {
              populationId: res.data[population].id,
              active: res.data[population].active,
              isCheckedOut: res.data[population].isCheckedOut,
              checkedOutBy: res.data[population].checkedOutBy
            }
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
    loadPopulations();
  }, []);

  const rows = data.map((row) => ({
    id: row.populationId,
    populationId: row.populationId,
  }));

  const columns = [
    {
      field: 'populationId',
      headerName: 'Population',
      width: 200,
    },
  ];

  return (
    <div>
      {data ? <TableComponent editLink="/material/population/edit" addLink="/material/population/add" status={"active"} material={"population"} rows={rows} columns={columns} loading={loading} error={error} user={props.user}/> : <p></p>}
    </div>
  )
}

export default PopulationTab