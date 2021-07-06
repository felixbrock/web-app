import React, { ReactElement, useState, useEffect } from 'react';
import SystemComponent from '../../components/system/system';
import {
  Systems,
  SystemColumn,
  SystemRow,
  FloatingButton,
  IconAdd,
} from './systems-items';
import { Input, FieldLabel } from '../../components/form/form-items';
import Modal from '../../components/modal/modal';
import Button from '../../components/button/button';
import Table from '../../components/table/table';
import SystemDto from '../../system-api/system-dto';
import SystemApiRepository from '../../persistence/system-api-repository';

function createRow(cards: ReactElement[]): ReactElement {
  return <SystemRow>{cards}</SystemRow>;
}

const getSystems = async (): Promise<SystemDto[]> => {
  try {
    return await SystemApiRepository.getAll();
  } catch (error) {
    console.log(error);
  }
  return [];
};

const createRows = (
  handleSubscribersState: (state: boolean) => void,
  handleOptionsState: (state: boolean) => void,
  systems: SystemDto[]
): ReactElement[] => {
  let cards: ReactElement[] = [];
  const rows: ReactElement[] = [];

  let systemCounter = 0;

  systems.forEach((system) => {
    cards.push(
      <SystemColumn>
        {SystemComponent(
          system.id,
          system.name,
          true,
          3,
          4,
          handleSubscribersState,
          handleOptionsState
        )}
      </SystemColumn>
    );
    systemCounter += 1;
    if (systemCounter === 4) {
      rows.push(createRow(cards));
      cards = [];
      systemCounter = 0;
    }
  });

  if (cards !== undefined && cards.length !== 0) {
    rows.push(createRow(cards));
    cards = [];
  }

  return rows;
};

export default (): ReactElement => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showSubscribersModal, setShowSubscribersModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const [systems, setSystems] = useState<SystemDto[]>([]);

  const handleRegistrationState = (state: boolean): void =>
    setShowRegistrationModal(state);
  const handleSubscribersState = (state: boolean): void =>
    setShowSubscribersModal(state);
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

  useEffect(() => {
    getSystems()
      .then((systemDtos) => setSystems(systemDtos))
      .catch((error) => console.log(error));
  }, []);

  return (
    <Systems>
      {createRows(handleSubscribersState, handleOptionsState, systems)}
      <FloatingButton onClick={onClick}>
        <IconAdd />
      </FloatingButton>
      {showRegistrationModal
        ? Modal(
            <form>
              <FieldLabel>System Name</FieldLabel>
              <Input type="text" placeholder="Enter system name..." />
              <FieldLabel>Selector Content</FieldLabel>
              <Input
                type="text"
                placeholder="[optional] Enter selector content..."
              />
            </form>,
            'Register System',
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
      {showOptionsModal
        ? Modal(
            <Button>Delete System</Button>,
            'System Options',
            'Ok',
            handleOptionsState
          )
        : null}
    </Systems>
  );
};
