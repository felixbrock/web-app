import React, { ReactElement } from 'react';
import './subscriptions.css';
import subscriptions from './subscription-items';

interface Target {
  selectorId: string;
  systemName: string;
}

interface Alert {
  date: string;
  message: string;
}

interface Subscription {
  name: string;
  id: string;
  targets: Target[];
  alerts: Alert[];
  warnings: Alert[];
  recentAlert: boolean;
  recentWarning: boolean;
}

function createAlertView(alerts: Alert[]): ReactElement {
  return (
    <div className="card">
      <h5>Alerts</h5>
      {alerts.map((alert) => (
        <div className="row">
          <div className="seperator"/>
          <div className="column">
            <div className="alert">{alert.date}</div>
          </div>
          <div className="column">
            <div className="alert">{alert.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function createWarningView(warnings: Alert[]): ReactElement {
  return (
    <div className="card">
      <h5>Warnings</h5>
      {warnings.map((warning) => (
        <div className="row">
          <div className="seperator"/>
          <div className="column">
            <div className="warning">{warning.date}</div>
          </div>
          <div className="column">
            <div className="warning">{warning.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function createTargetView(targets: Target[]): ReactElement {
  return (
    <div className="card">
      <h5>Subscription Targets</h5>
      <div className="row">
        <div className="column"><h6>Selector</h6></div>
        <div className="column"><h6>System</h6></div>
      </div>
      {targets.map((target) => (
        <div className="row">
          <div className="seperator"/>
          <div className="column">
            <div className="target">{target.selectorId}</div>
          </div>
          <div className="column">
            <div className="target">{target.systemName}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function createCard(subscription: Subscription): ReactElement {
  let status: ReactElement;
  if (subscription.recentAlert) status = <div className="recent" />;
  else if (subscription.recentWarning)
    status = <div className="recent-warning" />;
  else status = <div className="not-recent" />;

  return (
    <div className="column">
      <div className="card">
        {status}
        <h4>{subscription.name}</h4>
        <p>{subscription.id}</p>
        {createAlertView(subscription.alerts)}
        {createWarningView(subscription.warnings)}
        {createTargetView(subscription.targets)}
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
  subscriptions.forEach((subscription) => {
    cards.push(createCard(subscription));
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

  return <div className="systems">{rows}</div>;
};
