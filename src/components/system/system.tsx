import React, { ReactElement } from 'react';
import {
  System,
  Header,
  MissedAlertBubble,
  Title,
  Options,
  IdInfo,
  Id,
  CopyId,
  AlertMap,
  AutomationNumber,
} from './system-items';
import Heatmap from '../heatmap/heatmap';

const testValues = {
  series: [
    {
      name: '',
      data: [
        {
          x: 'W1',
          y: 3,
        },
        {
          x: 'W2',
          y: 0,
        },
        {
          x: 'W3',
          y: 0,
        },
        {
          x: 'W4',
          y: 3,
        },
      ],
    },
    {
      name: 'Fri',
      data: [
        {
          x: 'W1',
          y: 9,
        },
        {
          x: 'W2',
          y: 1,
        },
        {
          x: 'W3',
          y: 3,
        },
        {
          x: 'W4',
          y: 15,
        },
      ],
    },
    {
      name: '',
      data: [
        {
          x: 'W1',
          y: 3,
        },
        {
          x: 'W2',
          y: 0,
        },
        {
          x: 'W3',
          y: 0,
        },
        {
          x: 'W4',
          y: 3,
        },
      ],
    },
    {
      name: 'Wed',
      data: [
        {
          x: 'W1',
          y: 3,
        },
        {
          x: 'W2',
          y: 7,
        },
        {
          x: 'W3',
          y: 0,
        },
        {
          x: 'W4',
          y: 0,
        },
      ],
    },
    {
      name: '',
      data: [
        {
          x: 'W1',
          y: 3,
        },
        {
          x: 'W2',
          y: 0,
        },
        {
          x: 'W3',
          y: 0,
        },
        {
          x: 'W4',
          y: 3,
        },
      ],
    },
    {
      name: 'Mon',
      data: [
        {
          x: 'W1',
          y: 0,
        },
        {
          x: 'W2',
          y: 5,
        },
        {
          x: 'W3',
          y: 2,
        },
        {
          x: 'W4',
          y: 1,
        },
      ],
    },
    {
      name: '',
      data: [
        {
          x: 'W1',
          y: 3,
        },
        {
          x: 'W2',
          y: 0,
        },
        {
          x: 'W3',
          y: 0,
        },
        {
          x: 'W4',
          y: 3,
        },
      ],
    },
  ],
  type: 'heatmap',
  options: {
    colors: ['#423CFF'],
    chart: {
      background: '#333333',
      toolbar: {
        show: false,
      },
    },
    theme: {mode: 'dark'},
    grid: { show: false },
    stroke: {
      colors: ['#333333'],
      curve: 'smooth',
      lineCap: 'round',
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: ['#7f7f7f', '#7f7f7f', '#7f7f7f', '#7f7f7f'],
        },
      },
      axisBorder: {
        show:false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: [
            '#7f7f7f',
            '#7f7f7f',
            '#7f7f7f',
            '#7f7f7f',
            '#7f7f7f',
            '#7f7f7f',
            '#7f7f7f',
          ],
        },
      },
    },
  },
};

export default (
  id: string,
  title: string,
  hasMissedAlerts: boolean,
  missedAlerts: number,
  numberOfAutomations: number
): ReactElement => (
  <System>
    <Header>
      {hasMissedAlerts ? (
        <MissedAlertBubble>{missedAlerts}</MissedAlertBubble>
      ) : (
        <div />
      )}
      <Title>{title}</Title>
      <Options />
    </Header>
    <IdInfo>
      <Id>{id}</Id>
      <CopyId />
    </IdInfo>
    <AutomationNumber>
      Number of Automations: {numberOfAutomations}
    </AutomationNumber>
    <AlertMap>
      {Heatmap(testValues.options, testValues.series, testValues.type)}
    </AlertMap>
  </System>
);
