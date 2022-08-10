import { ButtonBase } from "@mui/material";
import styled from "styled-components";

export const InputContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  border: 1px solid #a9b6d8;
  border-radius: 2px;
`;

export const InputBtn = styled(ButtonBase)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f5fd!important;

   svg {
    margin: 0 4px;
   }
`;

export const InputField = styled.input`
  min-width: 0;
  border: none;
  outline: none;
  text-align: center;
  border-left: 1px solid #a9b6d8;
  border-right: 1px solid #a9b6d8;
  padding: 5px 2px;

  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;
