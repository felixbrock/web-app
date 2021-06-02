import React, { ReactElement } from 'react';
import './demo-system.css';
import selectors from './selectors';

type Selector = {
  id: string;
  content: string;
  recentAlert: boolean;
  alerts: string[];
  subscriptions: string[];
};

function createAlertView(alerts: string[]): ReactElement {
  return (
    <div className="column">
      <div className="card">
        <h5>Alerts</h5>
        {alerts.map((alert) => (
          <div className="alert">{alert}</div>
        ))}
      </div>
    </div>
  );
}

function createSubscriptionView(subscriptions: string[]): ReactElement {
  return (
    <div className="column">
      <div className="card">
        <h5>Subscriptions</h5>
        {subscriptions.map((subscription) => (
          <div className="subscription">{subscription}</div>
        ))}
      </div>
    </div>
  );
}

function createCard(selector: Selector): ReactElement {
  const status: ReactElement = selector.recentAlert ? (
    <div className="recent" />
  ) : (
    <div className="not-recent" />
  );
  return (
    <div className="column">
      <div className="card">
        {status}
        <h5>Selector</h5>
        <p>{selector.id}</p>
        <h5>Selector Content</h5>
        <p>{selector.content}</p>
        <div className="row">
          {createAlertView(selector.alerts)}
          {createSubscriptionView(selector.subscriptions)}
        </div>
      </div>
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
  selectors.forEach((selector) => {
    cards.push(createCard(selector));
    systemCounter += 1;
    if (systemCounter === 2) {
      rows.push(createRow(cards));
      cards = [];
      systemCounter = 0;
    }
  });
  if (cards !== undefined && cards.length !== 0) {
    rows.push(createRow(cards));
    cards = [];
  }

  return (
    <div className="systems">
      <div className="row">
        <h3>DummyDesktopApp1</h3>
      </div>
      <div className="seperator" />
      {rows}
    </div>
  );
};
