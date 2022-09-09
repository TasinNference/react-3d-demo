import { Typography } from "@mui/material";
import styled from "styled-components";

export const SidebarContainer = styled.div`
  width: ${({ open }) => (open ? "350px" : "0")};
  background-color: #fbfbfc;
  height: 100vh;
  position: relative;
  overflow-y: auto;
`;

export const SidebarSubContainer = styled.div`
  padding: 30px;
  position: absolute;
  top: 0;
  left: 0;
  min-width: 350px;
`;

export const SidebarHeader = styled.div`
  margin-bottom: 25px;
`;

export const LayersContainer = styled.div``;

export const LayersItem = styled.div`
  width: 100%;
  padding: 10px;
  transition: background-color 0.25s ease-in-out, box-shadow 0.25s ease-in-out,
    border 0.25s ease-in-out;
  border: ${({ hidden }) =>
    hidden ? "1px solid #e5e5e5" : "1px solid #ba51ff"};
  box-shadow: ${({ hidden }) =>
    hidden ? "none" : "0px 3px 4px rgba(0, 0, 0, 0.17)"};
  border-radius: 4px;
  background-color: ${({ hidden }) => (hidden ? "#fafafa" : "white")};
  margin-bottom: 10px;
  display: grid;
  row-gap: 5px;
  position: relative;
`;

export const ItemHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 10px;
  align-items: center;
`;

export const ItemName = styled(Typography).attrs(() => ({
  variant: "caption",
}))`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  font-weight: bold;
`;

export const ItemContent = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 20px;
`;

export const ItemImg = styled.img`
  width: 75px;
  height: 75px;
  object-position: center;
  object-fit: cover;
  display: block;
  border-radius: 4px;
`;

export const ItemIconsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 5px;
`;

export const ReferenceImgTxt = styled(Typography).attrs(() => ({
  variant: "caption",
}))`
  position: absolute;
  top: 50%;
  background-color: #2793ff;
  color: white;
  writing-mode: vertical-rl;
  transform: scale(-1) translate(100%, 50%);
  padding: 8px 3px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
`;

export const ItemAdjustmentContainer = styled.div`
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

export const CollapseIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 1000;
`;

export const HideBtn = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
