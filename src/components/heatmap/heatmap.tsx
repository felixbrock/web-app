import { ApexOptions } from 'apexcharts';
import React, { ReactElement } from 'react';
import Chart from 'react-apexcharts';

const type = 'heatmap';
const options: ApexOptions = {
  colors: ['#2c25ff'],
  chart: {
    background: '#333333',
    animations: {  speed: 75 },
    toolbar: {
      show: false,
    },
  },
  theme: { mode: 'dark' },
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
        colors: [
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
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
    axisBorder: {
      show: false,
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
};
export default (series: any[]): ReactElement => (
  <Chart options={options} series={series} type={type} />
);
