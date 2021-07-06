import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';

export const Automations = styled.div``;

export const AutomationRow = styled.div`
  margin: 0 -5px;
`;

export const AutomationColumn = styled.div`
  float: left;
  width: 25%;
  padding: 0 5px;

  @media screen and (max-width: 1000px) {
    width: 50%;
  }
`;

export const FloatingButton = styled.button`
  position: fixed;
  width: 40px;
  height: 40px;
  bottom: 40px;
  right: 40px;
  background-color: #2c25ff;
  color: #fff;
  border-radius: 40px;
  border: 0px;
  text-align: center;

  &:hover {
    background-color: #000;
    color: #2c25ff;
    text-decoration: none;
    cursor: pointer;
  }
`;

export const IconAdd = styled(FaPlus)`
  vertical-align: middle;
`;

export const InputText = styled.input`
width: 100%;
margin: 10px;
background-color: #bbbbbb;
color: #333333;
border: none;
border-radius: 3px;
`;

export const FieldLabel = styled.p`
margin-left: 10px;
`;
