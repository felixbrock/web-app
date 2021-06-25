import React, { ReactElement } from 'react';
import SampleSystems from './sample-systems';
import SystemComponent from '../../components/system/system';
import { Systems , SystemColumn, SystemRow, FloatingButton, IconAdd } from './systems-items';

function createRow(cards: ReactElement[]): ReactElement {
  return <SystemRow>{cards}</SystemRow>;
}

export default (): ReactElement => {
  let cards: ReactElement[] = [];
  const rows: ReactElement[] = [];

  let systemCounter = 0;
  SampleSystems.forEach((system) => {
    cards.push(
      <SystemColumn>
        {SystemComponent(
          system.id,
          system.name,
          system.hasMissedAlert,
          system.missedAlerts,
          system.numberOfSubscriptions
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

  return (<Systems>{rows}<FloatingButton><IconAdd/></FloatingButton></Systems>
    );
};
