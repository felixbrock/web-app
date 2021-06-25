// import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaRegCopy, FaEllipsisV } from 'react-icons/fa';

export const System = styled.div`
  text-align: center;
  border: 1px solid #333333;
  margin: 3px;
  background-color: #333333;
`;

const SystemRow = styled.div`
  display: flex;
  justify-content: space-between;
  vertical-align: middle;
  margin: 10px;
`;

export const Header = styled(SystemRow)``;

export const MissedAlertBubble = styled.circle`
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  font-size: 9pt;
  color: #fff;
  text-align: center;
  background: #fd0304;
`;

export const Title = styled.div`
  color: #bbbbbb;
`;

export const Options = styled(FaEllipsisV)`
  color: #bbbbbb;
`;

export const IdInfo = styled(SystemRow)``;

export const Id = styled.div`
  color: #7f7f7f;
`;

export const CopyId = styled(FaRegCopy)`
  color: #7f7f7f;
`;

export const AlertMap = styled.div`
display: inline-block;
width: 70%;

@media screen and (max-width: 1000px) {
  width: 40%;
}
`;

export const AutomationNumber = styled(SystemRow)`
  color: #7f7f7f;
  text-align: left;
`;
