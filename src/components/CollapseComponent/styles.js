import styled from 'styled-components';

export const CollapseContainer = styled.div`
  box-shadow: 0px 2.73077px 3.64103px rgba(0, 0, 0, 0.17);
`

export const CollapseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 13px;
`

export const CollapseBtn = styled.div`
  cursor: pointer;
`

export const CollapseContent = styled.div`
  background-color: #fafafa;
  padding: ${({contentPadding}) => contentPadding ? '8px 13px' : '0'};
  ${({square}) => square && `aspect-ratio: 1/1;`}
`