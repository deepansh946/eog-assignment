import React from 'react';
import Plot from 'react-plotly.js';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  plotArea: {
    width: '100%',
    height: '100%',
  },
});

export default (props: { data: Plotly.Data[] }) => {
  const classes = useStyles();
  const { data } = props;

  const tempPresent = data.filter(node => node.yaxis === 'y').length > 1;

  if (data.length > 1) {
    return (
      <Plot
        className={classes.plotArea}
        data={data}
        useResizeHandler={true}
        layout={{
          margin: { t: 85, b: 80 },
          autosize: true,
          xaxis: { domain: [0.1, 1], fixedrange: true },
          yaxis: {
            title: 'temperature (F)',
            showline: true,
            zeroline: false,
            ticks: 'outside',
            visible: tempPresent,
            fixedrange: true,
          },
          yaxis2: {
            title: 'pressure (PSI)',
            overlaying: 'y',
            anchor: 'free',
            position: -0.1,
            side: 'left',
            showline: true,
            zeroline: false,
            tickmode: 'auto',
            ticks: 'inside',
            ticklen: 20,
            tickcolor: '#b8b8b8',
            fixedrange: true,
          },
          yaxis3: {
            title: 'injection valve opening (%)',
            overlaying: 'y',
            side: 'right',
            showline: true,
            zeroline: false,
            ticks: 'outside',
            fixedrange: true,
          },
          legend: { orientation: 'h', y: 1.2 },
        }}
        config={{
          displayModeBar: false,
        }}
      />
    );
  } else {
    return null;
  }
};
