import React, { ReactElement, useState } from 'react';
import SampleSelectors from './sample-selectors';
import SelectorComponent from '../../components/selector/selector';
import {
  Selectors,
  SelectorColumn,
  SelectorRow,
  FloatingButton,
  IconAdd,
} from './selectors-items';
import { Input, FieldLabel } from '../../components/form/form-items';
import Modal from '../../components/modal/modal';
import Table from '../../components/table/table';
import Button from '../../components/button/button';

function createRow(cards: ReactElement[]): ReactElement {
  return <SelectorRow>{cards}</SelectorRow>;
}

function createRows(
  handleSubscribersState: (state: boolean) => void,
  handleAlertsState: (state: boolean) => void,
  handleSubscribeState: (state: boolean) => void,
  handleOptionsState: (state: boolean) => void
): ReactElement[] {
  let cards: ReactElement[] = [];
  const rows: ReactElement[] = [];

  let selectorCounter = 0;
  SampleSelectors.forEach((selector) => {
    cards.push(
      <SelectorColumn>
        {SelectorComponent(
          selector.id,
          selector.content,
          selector.hasMissedAlert,
          selector.missedAlerts,
          selector.numberOfSubscriptions,
          handleSubscribersState,
          handleAlertsState,
          handleSubscribeState,
          handleOptionsState
        )}
      </SelectorColumn>
    );
    selectorCounter += 1;
    if (selectorCounter === 4) {
      rows.push(createRow(cards));
      cards = [];
      selectorCounter = 0;
    }
  });

  if (cards !== undefined && cards.length !== 0) {
    rows.push(createRow(cards));
    cards = [];
  }

  return rows;
}

export default (): ReactElement => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showSubscribersModal, setShowSubscribersModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleRegistrationState = (state: boolean): void =>
    setShowRegistrationModal(state);
  const handleSubscribersState = (state: boolean): void =>
    setShowSubscribersModal(state);
  const handleAlertsState = (state: boolean): void => setShowAlertsModal(state);
  const handleSubscribeState = (state: boolean): void =>
    setShowSubscribeModal(state);
  const handleOptionsState = (state: boolean): void =>
    setShowOptionsModal(state);

  const onClick = () => handleRegistrationState(true);

  const subscriberTable: ReactElement = Table(
    ['Name', 'Id'],
    [
      ['AutomationName', 'XYZ-YYY-ZZZ'],
      ['AutomationName', 'XYZ-YYY-ZZZ'],
      ['AutomationName', 'XYZ-YYY-ZZZ'],
      ['AutomationName', 'XYZ-YYY-ZZZ'],
      ['AutomationName', 'XYZ-YYY-ZZZ'],
    ]
  );

  const alertTable: ReactElement = Table(
    ['Date', 'Time'],
    [
      ['01.07.21', '13:00:56'],
      ['01.07.21', '13:00:56'],
      ['01.07.21', '13:00:56'],
      ['01.07.21', '13:00:56'],
      ['01.07.21', '13:00:56'],
      ['01.07.21', '13:00:56'],
    ]
  );

  return (
    <Selectors>
      {createRows(
        handleSubscribersState,
        handleAlertsState,
        handleSubscribeState,
        handleOptionsState
      )}
      <FloatingButton onClick={onClick}>
        <IconAdd />
      </FloatingButton>
      {showRegistrationModal
        ? Modal(
            <form>
              <FieldLabel>Selector Content</FieldLabel>
              <Input type="text" placeholder="Enter selector content..." />
            </form>,
            'Register Selector',
            'Add',
            handleRegistrationState
          )
        : null}
      {showSubscribersModal
        ? Modal(
            subscriberTable,
            'Subscribed Automations',
            'Ok',
            handleSubscribersState
          )
        : null}
      {showAlertsModal
        ? Modal(alertTable, 'Missed Alerts', 'Ok', handleAlertsState)
        : null}
      {showSubscribeModal
        ? Modal(
            <form>
              <FieldLabel>Automation Id</FieldLabel>
              <Input
                type="text"
                placeholder="Enter the id of the automation to subscribe..."
              />
            </form>,
            'Subscribe Automation to Selector',
            'Subscribe',
            handleSubscribeState
          )
        : null}
      {showOptionsModal
        ? Modal(
            <Button>Delete Selector</Button>,
            'System Options',
            'Ok',
            handleOptionsState
          )
        : null}
    </Selectors>
  );
};
