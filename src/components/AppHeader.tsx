import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CardContent, Grid } from '@material-ui/core';

import { MetricTag } from './MetricTag';
import DropdownWidget from './DropdownWidget';
import { Measurement } from '../resources/interfaces';

const useStyles = makeStyles({
  taskBar: {
    backgroundColor: 'silver',
  },
});

export default (props: {
  latestData: Measurement[];
  selection: (string | undefined)[];
  setSelection: Function;
  metrics: string[];
}) => {
  const { metrics, selection, setSelection, latestData } = props;
  const classes = useStyles();
  return (
    <CardContent className={classes.taskBar}>
      <Grid container spacing={4} justify="space-between">
        <Grid item xs={12} sm={6}>
          {latestData.map(measurement => {
            return selection.includes(measurement.metric) ? (
              <MetricTag key={`${measurement.metric}: ${measurement.value}`} measurement={measurement} />
            ) : null;
          })}
        </Grid>
        <Grid item xs={12} sm={6}>
          <DropdownWidget metrics={metrics} selection={selection} setSelection={setSelection} />
        </Grid>
      </Grid>
    </CardContent>
  );
};
