import React, { ReactElement } from 'react';
import Chart from 'react-apexcharts';

export default (options: any, series: any, type: any): ReactElement => (
  <Chart options={options} series={series} type={type} />
);