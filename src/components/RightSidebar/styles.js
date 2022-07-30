import { Collapse } from "@mui/material";
import styled from "styled-components";
import CollapseComponent from "../CollapseComponent";

export const RightContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 250px;
`

export const BottomContainer = styled.div`
  table {
    width: 100%;
    td {
      vertical-align: middle;
    }

    td:last-child {
      width: 60%;
    }
  }
`

export const TopContainer = styled.div`
`