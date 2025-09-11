import React, { useState, useEffect } from "react";
import { getLocations } from "../../services/api-client/locationService";

import TableComponent from "../TableComponent";
import "../../style/TableTab.css";

function ArchivedLocationTab(props) {
  const [data, setData] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadLocations() {
      let tempArray = [];
      await getLocations()
        .then(async (res) => {
          for (let location in res.data) {
            let obj = {
              location: res.data[location].location,
              shorthand: res.data[location].shorthand,
              active: res.data[location].active,
            };
            if(!obj.active) {
              tempArray.push(obj);
            }
            //tempArray.push(obj);
          }
          setData(tempArray);
          setLoading1(false);
        })
        .catch((error) => {
          setError(error);
          setLoading1(false);
        });
    }
    loadLocations();
  }, []);

  const rows = data.map((row) => ({
   id: row.location,
   location: row.location,
   shorthand: row.shorthand,
  }));

  const columns = [
    {
      field: "location",
      headerName: "Location",
      width: 200,
    },
    {
      field: "shorthand",
      headerName: "Shorthand",
      width: 200,
    },
    
  ];

  // const initialFilterModel = {
  //   items: [{ columnField: "active", value: true }],
  // };

  return (
    <div>
      {data ? (
        <TableComponent
          addLink="/material/location/edit"
          editLink="/material/location/add"
          status={"archive"}
          material={"location"}
          rows={rows}
          columns={columns}
          loading={loading1}
          error={error}
          user={props.user}
        />
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default ArchivedLocationTab;
