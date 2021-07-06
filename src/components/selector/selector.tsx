import React, { ReactElement } from 'react';
import {
  Selector,
  Header,
  MissedAlertBubble,
  Title,
  OptionsIcon,
  // IdInfo,
  Text,
  // CopyIdIcon,
  AlertMap,
  Subtitle,
  Footer,
  Subscribe,
} from './selector-items';
import Heatmap from '../heatmap/heatmap';
import Button from '../button/button';
import Label from '../label/label';
import SampleData from '../heatmap/sample-heatmap-data';

export default (
  id: string,
  content: string,
  hasMissedAlerts: boolean,
  missedAlerts: number,
  subscriptionNumber: number,
  onSubscribersClick: (state: boolean) => void,
  onAlertsClick: (state: boolean) => void,
  onSubscribeClick: (state: boolean) => void,
  onOptionsClick: (state: boolean) => void,
  ): ReactElement => {
  const handleSubscribersClick = () => onSubscribersClick(true);
  const handleAlertsClick = () => onAlertsClick(true);
  const handleSubscribeClick = () => onSubscribeClick(true);
  const handleOptionsClick = () => onOptionsClick(true);


  return (
    <Selector>
      <Header>
        {hasMissedAlerts ? (
          <MissedAlertBubble onClick={handleAlertsClick}>{missedAlerts}</MissedAlertBubble>
        ) : (
          <div />
        )}
        <Title>Selector</Title>
        <Button onClick={handleOptionsClick}>
          <OptionsIcon />
        </Button>
      </Header>
        <Text>{id}</Text>
      {/* <IdInfo> */}
        {/* <Button onClick={test}>
          <CopyIdIcon />
        </Button> */}
      {/* </IdInfo> */}
      <Subtitle>Content</Subtitle>
      <Text>{content}</Text>
      <Subtitle>Number of Alerts per Day</Subtitle>
      <AlertMap>{Heatmap(SampleData)}</AlertMap>
      <Footer>
        <Label onClick={handleSubscribersClick}>
          {subscriptionNumber} Subscribers
        </Label>
        <Subscribe>
          <Button onClick={handleSubscribeClick}>Subscribe</Button>
        </Subscribe>
      </Footer>
    </Selector>
  );
};
