import React, {useState} from "react";
import "../../libs/style/TableTab.css";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Toolbar from "./Toolbar";

/**
 * editLink="/edit/tree-material" addLink="/add/tree-material"  status={"active"} material={"tree"} rows={rows} columns={columns} loading={loading1} error={error}
 * @param {*} props broken down into many different parts
 * @param editLink edit link for the table
 * @param addLink add link for the table
 * @param status whether the table is storing active or inactive data
 * @param material what material the table is storing
 * @param rows the array of rows with the data in it
 * @param columns the array of column objects that defines the columsn
 * @param loading the loading state
 * @param error the error state
 * @returns 
 */
function UserTableComponent(props) {

  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelection = (selection, other) => {
    console.log(selection, other);
    setSelectedRows(selection);
    if(props.toEdit){
      props.toEdit(selection[0]);
    }
    // setNumSelected(selection.length);
  };

  

  const StripedDataGrid = DataGrid;

  return (
    <Box
      sx={{
        backgroundColor: "#aaaaaa",
        height: "fit-content",
        width: "100%",
        marginTop: "10px",
        "& .headerStyle": {
          backgroundColor: "#dddddd",
        },
      }}
    >
      <StripedDataGrid
        sx={{
          height: "405px",
        }}
        rows={props.rows}
        columns={props.columns}
        onRowSelectionModelChange={handleSelection}
        pageSize={5}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        slots={{
          toolbar: Toolbar,
        }}
        //New code
        initialState={{
          sorting: {
            sortModel: [{ field: "id", sort: "desc" }],
          },
        }}
      />
    </Box>
  );
}

export default UserTableComponent;
