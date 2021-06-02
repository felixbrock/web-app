import React, { ReactElement } from 'react';
import './systems.css';
import systems from './system-items';

type System = {
  name: string;
  id: string;
  numOfsubscriptions: number;
  recentAlert: boolean;
};



function createCard(system: System): ReactElement {
  const status: ReactElement = system.recentAlert ? (
    <div className="recent" />
  ) : (
    <div className="not-recent" />
  );
  const url = `/systems/${system.id}`;
  return (
    <div className="column">
      <a href={url}>
      <div className="card">
        {status}
        <h4>{system.name}</h4>
        <p>{system.id}</p>
        <h5>Number of Subscriptions</h5>
        <div className="subscription-number">{system.numOfsubscriptions}</div>
      </div>
      </a>
    </div>
  );
}

function createRow(cards: ReactElement[]): ReactElement {
  return <div className="row">{cards}</div>;
}

export default (): ReactElement => {
  let cards: ReactElement[] = [];
  const rows: ReactElement[] = [];

  let systemCounter = 0;
  systems.forEach((system) => {
    cards.push(createCard(system));
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

  return <div className='systems'>{rows}</div>;
};
