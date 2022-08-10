import React from "react";
import {
  ToolbarDivider,
  ToolbarGroup,
  ToolbarIcon,
  TopToolbarContainer,
} from "./styles";
import { GrPan } from "react-icons/gr";
import { Tb3DRotate } from "react-icons/tb";
import { GrPowerReset } from "react-icons/gr";
import { AiOutlineZoomIn } from "react-icons/ai";
import { IoMdCube } from "react-icons/io";
import { MdFitScreen } from "react-icons/md";
import { Tooltip } from "@mui/material";

const IconElement = ({children, selected, onClick, tooltipTitle}) => {
  return <Tooltip title={tooltipTitle}>
    <ToolbarIcon selected={selected} onClick={onClick} >
      {children}
    </ToolbarIcon>
  </Tooltip>
}

const TopToolbar = ({ resetImages, fitToMesh, cursorMode, setCursorMode }) => {
  return (
    <TopToolbarContainer>
      <ToolbarGroup>
        <IconElement selected={cursorMode === "pan"} onClick={() => setCursorMode(cursorMode === "pan" ? "free" : "pan")} tooltipTitle="Pan">
          <GrPan />
        </IconElement>
      </ToolbarGroup>
      <ToolbarDivider />
      <ToolbarGroup>
        {/* <IconElement tooltipTitle="Select View">
          <IoMdCube />
        </IconElement> */}
        <IconElement onClick={fitToMesh} tooltipTitle="Fit to screen">
          <MdFitScreen />
        </IconElement>
      </ToolbarGroup>
      <ToolbarDivider />
      <ToolbarGroup>
        <IconElement onClick={resetImages} tooltipTitle="Reset Images">
          <GrPowerReset />
        </IconElement>
      </ToolbarGroup>
    </TopToolbarContainer>
  );
};

export default TopToolbar;
