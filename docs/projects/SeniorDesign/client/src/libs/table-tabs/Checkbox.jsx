import React from "react";
import Checkbox from "@mui/material/Checkbox";
import CircleCheckedFilled from "@mui/icons-material/CheckCircle";
import CircleUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import RemoveCircle from "@mui/icons-material/RemoveCircle";


export const CheckboxWrapper = React.forwardRef(
  (props, ref) => (
    <Checkbox
      ref={ref}
      style={{ color: "#ff0000" }}
      icon={<CircleUnchecked />}
      checkedIcon={<CircleCheckedFilled />}
      indeterminateIcon={<RemoveCircle />}
      // checked={props.checked}
      {...props}
    />
  )
);

export default CheckboxWrapper;
