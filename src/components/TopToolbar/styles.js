import styled from "styled-components";

export const TopToolbarContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  box-shadow: 0px 2.73077px 3.64103px rgba(0,0,0,0.17);
  padding: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
`;

export const ToolbarGroup = styled.div`
  display: flex;
  column-gap: 5px;
  font-size: 18px;
`;

export const ToolbarIcon = styled.div`
  height: 25px;
  width: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({selected}) => selected ? '#e5e5e5' : 'white'};
  transition: background-color 0.25s ease-in-out;
  border-radius: 4px;

  &:hover {
    background-color: #efefef;
  }
`;

export const ToolbarDivider = styled.div`
  width: 1px;
  height: 20px;
  background-color: #e5e5e5;
  margin: 0 5px;
`;