import styled from 'styled-components';

export const Systems = styled.div`

`;

export const SystemRow = styled.div`
  margin: 0 -5px;
`;

export const SystemColumn = styled.div`
  float: left;
  width: 25%;
  padding: 0 5px;

  @media screen and (max-width: 1000px) {
    width: 100%;
    display: block;
    margin-bottom: 20px;
  }
`;
