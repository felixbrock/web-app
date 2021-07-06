import React, { ReactElement } from 'react';
import {
  Automation,
  Header,
  MissedAlertBubble,
  MissedWarningBubble,
  Title,
  OptionsIcon,
  IdInfo,
  Text,
  // CopyIdIcon,
  AlertMap,
  Subtitle,
  Footer,
} from './automation-items';
import Heatmap from '../heatmap/heatmap';
import Button from '../button/button';
import Label from '../label/label';
import SampleData from '../heatmap/sample-heatmap-data';

export default (
  id: string,
  name: string,
  hasMissedAlerts: boolean,
  missedAlerts: number,
  hasMissedWarnings: boolean,
  missedWarnings: number,
  subscriptionNumber: number,
  onSubscriptionsClick: (state: boolean) => void,
  onAlertsClick: (state: boolean) => void,
  onWarningsClick: (state: boolean) => void,
  onOptionsClick: (state: boolean) => void,
  ): ReactElement => {
  const handleSubscriptionsClick = () => onSubscriptionsClick(true);
  const handleAlertsClick = () => onAlertsClick(true);
  const handleWarningsClick = () => onWarningsClick(true);
  const handleOptionsClick = () => onOptionsClick(true);

  let bubble: ReactElement = <div />;
  if (hasMissedAlerts)
    bubble = (
      <MissedAlertBubble onClick={handleAlertsClick}>
        {missedAlerts}
      </MissedAlertBubble>
    );
  else if (hasMissedWarnings)
    bubble = (
      <MissedWarningBubble onClick={handleWarningsClick}>
        {missedWarnings}
      </MissedWarningBubble>
    );

  return (
    <Automation>
      <Header>
        {bubble}
        <Title>{name}</Title>
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
      <Subtitle>Number of Alerts per Day</Subtitle>
      <AlertMap>{Heatmap(SampleData)}</AlertMap>
      <Subtitle>Number of Warnings per Day</Subtitle>
      <AlertMap>{Heatmap(SampleData)}</AlertMap>
      <Footer>
        <Label onClick={handleSubscriptionsClick}>
          {subscriptionNumber} Subscriptions
        </Label>
        <div />
      </Footer>
    </Automation>
  );
};
