import { Typography } from "@mui/material";
import styled from "styled-components";

export const SidebarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 350px;
  background-color: #fbfbfc;
  overflow-y: auto;
  height: 100vh;
  padding: 30px;
`;

export const SidebarHeader = styled.div`
  margin-bottom: 25px;
`;

export const LayersContainer = styled.div``;

export const LayersItem = styled.div`
  width: 100%;
  padding: 10px;
  border: 1px solid #ba51ff;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.17);
  border-radius: 4px;
  background-color: white;
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

export const ItemName = styled(Typography).attrs(() => ({variant: 'caption'}))`
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
  width: 100px;
  height: 100px;
  object-position: center;
  object-fit: cover;
  display: block;
`;

export const ItemIconsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 5px;
`;

export const ReferenceImgTxt = styled(Typography).attrs(() => ({variant: 'caption'}))`
  position: absolute;
  top: 50%;
  background-color: #2793ff;
  color: white;
  writing-mode: vertical-rl;
  transform:scale(-1) translate(100%,50%);
  padding: 8px 3px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
`

export const ItemAdjustmentContainer = styled.div`
  display: grid;
  row-gap: 10px;
`