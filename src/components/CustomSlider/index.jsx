import { Slider } from "@mui/material";
import React from "react";

const CustomSlider = ({
  size,
  defaultValue,
  min,
  max,
  onChange,
  value,
  marks,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Slider
        sx={{
          padding: 0,
        }}
        size="small"
        defaultValue={defaultValue}
        value={value}
        valueLabelDisplay="auto"
        min={min}
        max={max}
        onChange={onChange}
        marks={marks}
      />
    </div>
  );
};

export default CustomSlider;
