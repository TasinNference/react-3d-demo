import { Slider } from "@mui/material";
import React from "react";

const CustomSlider = ({ size, defaultValue, min, max, onChange }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Slider
        sx={{
          padding: 0,
        }}
        size="small"
        defaultValue={defaultValue}
        valueLabelDisplay="auto"
        min={min}
        max={max}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomSlider;
