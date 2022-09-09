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
`;
