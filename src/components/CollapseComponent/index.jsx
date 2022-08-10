import { Collapse, Typography } from "@mui/material";
import React from "react";
import {
  CollapseBtn,
  CollapseContainer,
  CollapseContent,
  CollapseHeader,
} from "./styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const CollapseComponent = ({ value, onClick, children, title, contentPadding=true, square=false }) => {
  console.log("padding", contentPadding)

  return (
    <CollapseContainer>
      <CollapseHeader>
        <Typography variant="caption">{title}</Typography>
        <CollapseBtn onClick={onClick}>
          {value ? (
            <RemoveIcon fontSize="small" />
          ) : (
            <AddIcon fontSize="small" />
          )}
        </CollapseBtn>
      </CollapseHeader>
      <Collapse in={value}>
        <CollapseContent contentPadding={contentPadding} square={square}>{children}</CollapseContent>
      </Collapse>
    </CollapseContainer>
  );
};

export default CollapseComponent;
