import { MetricNode } from '../interfaces';

export const sixtyMinutesAgo = new Date(Date.now() - 60 * 60000).getTime();

export const inputQuery = (metrics: string[]) => {
  return metrics.map(metric => {
    return `{ metricName: "${metric}", after: ${sixtyMinutesAgo} }`;
  });
};

export const filterData = (data: Plotly.Data[], selection: (string | undefined)[]) => {
  let filteredData = data.filter(metricObj => {
    return selection.includes(metricObj.name);
  });

  const dummyObj: Plotly.Data = {
    x: [],
    y: [],
    name: '',
    yaxis: 'y',
    type: 'scatter',
    line: { color: '#ff0000' },
  };

  filteredData.push(dummyObj);

  return filteredData;
};

export const transformData = (data: MetricNode[]) => {
  const colors: string[] = ['#ff0000', '#0000dd', '#00ff00', '#00ffff', '#ffff00', '#00dddd'];
  const graphData: Plotly.Data[] = [];

  data.forEach(node => {
    let metricObj: Plotly.Data = {
      x: [],
      y: [],
      name: '',
      yaxis: '',
      type: 'scatter',
      line: { color: colors[data.indexOf(node)] },
    };

    node.measurements.forEach(measurement => {
      (metricObj.x as Plotly.Datum[]).push(new Date(measurement.at));
      (metricObj.y as Plotly.Datum[]).push(measurement.value);
    });
    metricObj.name = node.metric;
    switch (node.measurements[0].unit) {
      case 'PSI':
        metricObj.yaxis = 'y2';
        break;
      case 'F':
        metricObj.yaxis = 'y';
        break;
      case '%':
        metricObj.yaxis = 'y3';
    }
    graphData.push(metricObj);
  });
  return graphData;
};
