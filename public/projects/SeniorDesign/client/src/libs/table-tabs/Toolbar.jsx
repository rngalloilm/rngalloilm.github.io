import React from "react";
import { Toolbar } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";

function ToolbarWrapper(props) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton style={{ color: "#990100" }} />
      <GridToolbarFilterButton style={{ color: "#990100" }} />
      <GridToolbarDensitySelector style={{ color: "#990100" }} />
      <GridToolbarExport style={{ color: "#990100" }} />
    </GridToolbarContainer>
  );
}

export default ToolbarWrapper;
