import React, { ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import {
  System,
  Header,
  MissedAlertBubble,
  Title,
  OptionsIcon,
  IdInfo,
  Text,
  // CopyIdIcon,
  AlertMap,
  Subtitle,
  Footer,
} from './system-items';
import Heatmap from '../heatmap/heatmap';
import Button from '../button/button';
import Label from '../label/label';
import SampleData from '../heatmap/sample-heatmap-data';

export default (
  id: string,
  title: string,
  hasMissedAlerts: boolean,
  missedAlerts: number,
  subscriptionNumber: number,
  onSubscribersClick: (state: boolean) => void,
  onOptionsClick: (state: boolean) => void,
): ReactElement => {
  const history = useHistory();

  function handleDetailClick() {
    history.push(`/system/${id}`);
  }

  const handleSubscribersClick = () => onSubscribersClick(true);
  const handleOptionsClick = () => onOptionsClick(true);

  return (
    <System>
      <Header>
        {hasMissedAlerts ? (
          <MissedAlertBubble>{missedAlerts}</MissedAlertBubble>
        ) : (
          <div />
        )}
        <Button onClick={handleDetailClick}>
          <Title>{title}</Title>
        </Button>
        <Button onClick={handleOptionsClick}>
          <OptionsIcon />
        </Button>
      </Header>
      <IdInfo>
        <Text>{id}</Text>
        {/* <Button onClick={test}>
          <CopyIdIcon />
        </Button> */}
      </IdInfo>
      <Subtitle>Number of Warnings per Day</Subtitle>
      <AlertMap>{Heatmap(SampleData)}</AlertMap>
      <Footer>
        <Label onClick={handleSubscribersClick}>
          {subscriptionNumber} Automations
        </Label>
      </Footer>
    </System>
  );
};
