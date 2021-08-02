import React, { ReactElement, useState } from 'react';
import SampleAutomations from './sample-automations';
import AutomationComponent from '../../components/automation/automation';
import {
  Automations,
  AutomationColumn,
  AutomationRow,
  FloatingButton,
  IconAdd,
  InputText,
  FieldLabel,
} from './automations-items';
import Modal from '../../components/modal/modal';
import Table from '../../components/table/table';
import Button from '../../components/button/button';

function buildRow(cards: ReactElement[]): ReactElement {
  return <AutomationRow>{cards}</AutomationRow>;
}

function buildRows(
  handleSubscriptionState: (state: boolean) => void,
  handleAlertsState: (state: boolean) => void,
  handleWarningsState: (state: boolean) => void,
  handleOptionsState: (state: boolean) => void
): ReactElement[] {
  let cards: ReactElement[] = [];
  const rows: ReactElement[] = [];

  let automationCounter = 0;
  SampleAutomations.forEach((automation) => {
    cards.push(
      <AutomationColumn>
        {AutomationComponent(
          automation.id,
          automation.name,
          automation.hasMissedAlert,
          automation.missedAlerts,
          automation.hasMissedWarning,
          automation.missedWarnings,
          automation.numberOfSubscriptions,
          handleSubscriptionState,
          handleAlertsState,
          handleWarningsState,
          handleOptionsState
        )}
      </AutomationColumn>
    );
    automationCounter += 1;
    if (automationCounter === 4) {
      rows.push(buildRow(cards));
      cards = [];
      automationCounter = 0;
    }
  });

  if (cards !== undefined && cards.length !== 0) {
    rows.push(buildRow(cards));
    cards = [];
  }

  return rows;
}

export default (): ReactElement => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showWarningsModal, setShowWarningsModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleRegistrationState = (state: boolean): void =>
    setShowRegistrationModal(state);
  const handleSubscriptionState = (state: boolean): void =>
    setShowSubscriptionModal(state);
  const handleAlertsState = (state: boolean): void => setShowAlertsModal(state);
  const handleWarningsState = (state: boolean): void =>
    setShowWarningsModal(state);
    const handleOptionsState = (state: boolean): void =>
    setShowOptionsModal(state);

  const onClick = () => handleRegistrationState(true);

  const selectorTable: ReactElement = Table(
    ['System', 'System-Id', 'Selector', 'Selector-Id', 'Subscribed'],
    [
      [
        'Word',
        'XYZ-YYY-ZZZ',
        '/Window[@ClassName=\\"Window\\"][@Name=\\"Some Desktop Application\\"]/Button[@ClassName=\\"Button\\"][@Name=\\"Errors Suck!\\"]',
        'YYY-ZZZ-XXX',
        <Button>true</Button>
      ],
      [
        'Word',
        'XYZ-YYY-ZZZ',
        '/Window[@ClassName=\\"Window\\"][@Name=\\"Some Desktop Application\\"]/Button[@ClassName=\\"Button\\"][@Name=\\"Errors Suck!\\"]',
        'YYY-ZZZ-XXX',
        <Button>true</Button>
      ],
      [
        'Word',
        'XYZ-YYY-ZZZ',
        '/Window[@ClassName=\\"Window\\"][@Name=\\"Some Desktop Application\\"]/Button[@ClassName=\\"Button\\"][@Name=\\"Errors Suck!\\"]',
        'YYY-ZZZ-XXX',
        <Button>true</Button>
      ],
      [
        'Word',
        'XYZ-YYY-ZZZ',
        '/Window[@ClassName=\\"Window\\"][@Name=\\"Some Desktop Application\\"]/Button[@ClassName=\\"Button\\"][@Name=\\"Errors Suck!\\"]',
        'YYY-ZZZ-XXX',
        <Button>true</Button>
      ],
      [
        'Word',
        'XYZ-YYY-ZZZ',
        '/Window[@ClassName=\\"Window\\"][@Name=\\"Some Desktop Application\\"]/Button[@ClassName=\\"Button\\"][@Name=\\"Errors Suck!\\"]',
        'YYY-ZZZ-XXX',
        <Button>true</Button>
      ],
      [
        'Word',
        'XYZ-YYY-ZZZ',
        '/Window[@ClassName=\\"Window\\"][@Name=\\"Some Desktop Application\\"]/Button[@ClassName=\\"Button\\"][@Name=\\"Errors Suck!\\"]',
        'YYY-ZZZ-XXX',
        <Button>true</Button>
      ],
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
    <Automations>
      {buildRows(
        handleSubscriptionState,
        handleAlertsState,
        handleWarningsState,
        handleOptionsState
      )}
      <FloatingButton onClick={onClick}>
        <IconAdd />
      </FloatingButton>
      {showRegistrationModal
        ? Modal(
            <form>
              <FieldLabel>Automation Name</FieldLabel>
              <InputText type="text" placeholder="Enter automation name..." />
              <FieldLabel>Owner Id</FieldLabel>
              <InputText
                type="text"
                placeholder="Enter your or someone else's account id..."
              />
            </form>,
            'Register Automation',
            'Add',
            handleRegistrationState,
            () => {}
          )
        : null}
      {showSubscriptionModal
        ? Modal(
            selectorTable,
            'Selector Subscriptions',
            'Ok',
            handleSubscriptionState,
            () => {}
          )
        : null}
      {showAlertsModal
        ? Modal(alertTable, 'Missed Alerts', 'Ok', handleAlertsState, () => {})
        : null}
      {showWarningsModal
        ? Modal(alertTable, 'Missed Warnings', 'Ok', handleWarningsState, () => {})
        : null}
      {showOptionsModal
        ? Modal(
            <Button>Delete Automation</Button>,
            'Automation Options',
            'Ok',
            handleOptionsState,
            () => {}
          )
        : null}
    </Automations>
  );
};
