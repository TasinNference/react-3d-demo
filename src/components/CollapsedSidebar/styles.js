import { Typography } from "@mui/material";
import styled from "styled-components";

export const CollapsedContainer = styled.div`
  padding: 10px;
  z-index: 1000;
`;

export const CollapsedItems = styled.div`
  display: grid;
`;

export const CollapsedMain = styled.div`
  padding: 10px 10px 0 10px;
  border-radius: 4px;
  display: grid;
  justify-items: center;
  row-gap: 10px;
  color: white;
`;

export const CollapsedItem = styled.div`
  margin-bottom: 10px;
`;

export const CollapsedImg = styled.img`
  width: 50px;
  height: 50px;
  object-position: center;
  object-fit: cover;
  display: block;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ borderColor }) => borderColor};
`;

export const TooltipHeader = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
  margin-bottom: 5px;
`;

export const TooltipName = styled(Typography).attrs(() => ({
  variant: "caption",
}))`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-weight: bold !important;
`;

export const TooltipStainType = styled(Typography).attrs(() => ({
  variant: "caption",
}))``;

export const TooltipContent = styled.div`
  table {
    width: 100%;
    border-collapse: collapse;
    td {
      vertical-align: middle;
    }

    td:first-child {
      width: 40%;
    }
  }
`;

export const TooltipItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
