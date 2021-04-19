import {
  IFieldComponentProps,
  FieldLabel,
} from '@antlerengineering/form-builder';

import { makeStyles, createStyles, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      border: `1px dashed ${theme.palette.divider}`,
      height: 56,
      padding: theme.spacing(0, 2),
    },

    customFieldType: {
      cursor: 'default',
      color: theme.palette.text.disabled,
    },

    code: { fontFamily: theme.typography.fontFamilyMono },
  })
);

export default function CustomFieldType({
  type,
  label,
  disabled,
  required,
}: IFieldComponentProps) {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      wrap="nowrap"
      justify="center"
      className={classes.root}
    >
      <Grid item>
        <Typography variant="caption" className={classes.customFieldType}>
          Custom Field Type: <span className={classes.code}>{type}</span>
        </Typography>
        <FieldLabel error={false} disabled={!!disabled} required={!!required}>
          {label}
        </FieldLabel>
      </Grid>
    </Grid>
  );
}
