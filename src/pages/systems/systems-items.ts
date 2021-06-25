import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';

export const Systems = styled.div``;

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

export const FloatingButton = styled.button`
  position: fixed;
  width: 40px;
  height: 40px;
  bottom: 40px;
  right: 40px;
  background-color: #423cff;
  color: #fff;
  border-radius: 40px;
  text-align: center;
`;

export const IconAdd = styled(FaPlus)`
  vertical-align: middle;
`;
