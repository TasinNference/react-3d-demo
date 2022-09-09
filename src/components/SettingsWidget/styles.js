import styled from "styled-components";

export const SettingsContainer = styled.div`
  position: absolute;
  bottom: 50px;
  right: 50px;
  background-color: white;
  z-index: 1000;
  width: 200px;
  overflow: hidden;
  border-radius: 4px;
`;

export const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 15px;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  cursor: pointer;
`;

export const SettingsBody = styled.div`
  height: ${({ open }) => (open ? "auto" : 0)};
`;

export const SettingsContent = styled.div`
  padding: 10px 15px;
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
