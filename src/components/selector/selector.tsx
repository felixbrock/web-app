import React, { ReactElement } from 'react';
import {
  Selector,
  Header,
  MissedAlertBubble,
  Title,
  OptionsIcon,
  // IdInfo,
  Text,
  StatsIcon,
  // CopyIdIcon,
  // AlertMap,
  Subtitle,
  Footer,
  Subscribe,
} from './selector-items';
// import {Heatmap} from '../heatmap/heatmap';
import Button from '../button/button';
import Label from '../label/label';
// import SampleData from '../heatmap/sample-heatmap-data';

export default (
  id: string,
  content: string,
  missedAlerts: number,
  setSelectorIdState: (systemId: string) => void,
  setSubscribersState: (state: boolean) => void,
  setOptionsState: (state: boolean) => void,
  setAlertsOverviewState: (state: boolean) => void,
  setAlertsClick: (state: boolean) => void,
  setSubscribeClick: (state: boolean) => void,
  ): ReactElement => {
    const handleSubscribersClick = () => {
    setSelectorIdState(id);
    setSubscribersState(true);
  };
  const handleOptionsClick = () => {
    setSelectorIdState(id);
    setOptionsState(true);
  };
  const handleAlertsOverviewClick = () => {
    setSelectorIdState(id);
    setAlertsOverviewState(true);
  };
  const handleAlertsClick = () => {
    setSelectorIdState(id);
    setAlertsClick(true);
  };
  const handleSubscribeClick = () => {
    setSelectorIdState(id);
    setSubscribeClick(true);
  };

  return (
    <Selector>
      <Header>
        {missedAlerts ? (
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
      {/* <Subtitle>Number of Alerts per Day</Subtitle>
      <AlertMap>{Heatmap(SampleData())}</AlertMap> */}
      <Footer>
        <Label onClick={handleSubscribersClick}>
          Subscribed Automations
        </Label>
        <Subscribe>
          <Button onClick={handleSubscribeClick}>Subscribe</Button>
        </Subscribe>
        <Button onClick={handleAlertsOverviewClick}>
          <StatsIcon />
        </Button>
      </Footer>
    </Selector>
  );
};
