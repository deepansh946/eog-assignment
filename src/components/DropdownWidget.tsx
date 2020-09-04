import React from 'react';
import { makeStyles, useTheme, createStyles, Theme } from '@material-ui/core/styles';
import { Select, MenuItem, FormControl, InputLabel, Input } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      minWidth: 250,
      float: 'right',
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }),
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(input: string, selection: (string | undefined)[], theme: Theme) {
  return {
    fontWeight:
      selection.indexOf(input) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

export default (props: { metrics: string[]; selection: (string | undefined)[]; setSelection: Function }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { selection, setSelection, metrics } = props;

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelection(event.target.value as (string | undefined)[]);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel>Select metrics...</InputLabel>
      <Select multiple value={selection} onChange={handleChange} input={<Input />} MenuProps={MenuProps}>
        {metrics.map(metric => (
          <MenuItem key={metric} value={metric} style={getStyles(metric, selection, theme)}>
            {metric}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
