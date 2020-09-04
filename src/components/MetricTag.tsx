import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { Measurement } from '../resources/interfaces';

const useStyles = makeStyles({
  chip: {
    minWidth: 250,
    margin: 3,
    fontSize: 15,
  },
});

export function MetricTag(props: { measurement: Measurement }) {
  const classes = useStyles();
  const { measurement } = props;

  return <Chip className={classes.chip} label={`${measurement.metric}: ${measurement.value}${measurement.unit}`} />;
}
