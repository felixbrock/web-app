import React, { ReactElement } from 'react';
import { Input, FieldLabel } from '../../components/form/form-items';
import { HistoricalData } from './historical-data-items';
import Table from '../../components/table/table';

export default (): ReactElement => {
  const historicDataTable: ReactElement = Table(
    ['Date', 'Time', 'Type', 'System', 'System-Id', 'Selector-Content', 'Selector-Id', 'Automation-Id'],
    [
      [
        '30.06.21',
        '15:36:31',
        'Warning',
        'Word',
        '0841fd90-b372-4421-802d-4de909f8f950',
        '/Window[@ClassName=\\"Window\\"][@Name=\\"Some Desktop Application\\"]/Button[@ClassName=\\"Button\\"][@Name=\\"Errors Suck!\\"]',
        '6dad108e-21e9-4b68-8ba0-0b28ffd299bd',
        '0841fd90-b372-4421-802d-4de909f8f950',
      ],
      [
        '30.06.21',
        '13:00:01',
        'Alert',
        'Word',
        '0841fd90-b372-4421-802d-4de909f8f950',
        '/Window[@ClassName=\\"Window\\"][@Name=\\"Some Desktop Application\\"]/Button[@ClassName=\\"Button\\"][@Name=\\"Errors Suck!\\"]',
        '6dad108e-21e9-4b68-8ba0-0b28ffd299bd',
        '0841fd90-b372-4421-802d-4de909f8f950',
      ],
      [
        '30.06.21',
        '11:10:13',
        'Alert',
        'Excel',
        '0841fd90-b372-4421-802d-4de909f8f950',
        '/Window[@ClassName=\\"Window\\"][@Name=\\"Some Desktop Application\\"]/Button[@ClassName=\\"Button\\"][@Name=\\"Errors Suck!\\"]',
        '6dad108e-21e9-4b68-8ba0-0b28ffd299bd',
        '0841fd90-b372-4421-802d-4de909f8f950',
      ],
      [
        '30.06.21',
        '11:00:01',
        'Warning',
        'SAP',
        '0841fd90-b372-4421-802d-4de909f8f950',
        '/Window[@ClassName=\\"Window\\"][@Name=\\"Some Desktop Application\\"]/Button[@ClassName=\\"Button\\"][@Name=\\"Errors Suck!\\"]',
        '6dad108e-21e9-4b68-8ba0-0b28ffd299bd',
        '0841fd90-b372-4421-802d-4de909f8f950',
      ],
      [
        '30.06.21',
        '09:33:54',
        'Alert',
        'Chrome',
        '0841fd90-b372-4421-802d-4de909f8f950',
        '/Window[@ClassName=\\"Window\\"][@Name=\\"Some Desktop Application\\"]/Button[@ClassName=\\"Button\\"][@Name=\\"Errors Suck!\\"]',
        '6dad108e-21e9-4b68-8ba0-0b28ffd299bd',
        '0841fd90-b372-4421-802d-4de909f8f950',
      ],
      [
        '30.06.21',
        '09:00:08',
        'Alert',
        'SnippingTool',
        '0841fd90-b372-4421-802d-4de909f8f950',
        '/Window[@ClassName=\\"Window\\"][@Name=\\"Some Desktop Application\\"]/Button[@ClassName=\\"Button\\"][@Name=\\"Errors Suck!\\"]',
        '6dad108e-21e9-4b68-8ba0-0b28ffd299bd',
        '0841fd90-b372-4421-802d-4de909f8f950',
      ],
      [
        '30.06.21',
        '08:52:42',
        'Alert',
        'DemoDesktopApp',
        '0841fd90-b372-4421-802d-4de909f8f950',
        '/Window[@ClassName=\\"Window\\"][@Name=\\"Some Desktop Application\\"]/Button[@ClassName=\\"Button\\"][@Name=\\"Errors Suck!\\"]',
        '6dad108e-21e9-4b68-8ba0-0b28ffd299bd',
        '0841fd90-b372-4421-802d-4de909f8f950',
      ],
    ]
  );

  return (
    <HistoricalData>
      <FieldLabel>Choose Day to Query</FieldLabel>
      <Input type="Date" />
      <FieldLabel>Alerts of Chosen Day</FieldLabel>
      {historicDataTable}
    </HistoricalData>
  );
};
