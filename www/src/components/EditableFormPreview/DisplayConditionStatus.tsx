import { useFormContext, useWatch } from 'react-hook-form';

import { makeStyles, createStyles, Tooltip, Grid } from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import ErrorIcon from '@material-ui/icons/Error';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const evaluateDisplayCondition = (
  displayCondition: string,
  values: Record<string, any>
) => {
  try {
    // eslint-disable-next-line no-new-func
    const displayConditionFunction = new Function(
      'values',
      '"use strict";\n' + displayCondition!
    );
    return displayConditionFunction(values);
  } catch (e) {
    return e.message;
  }
};

const useStyles = makeStyles((theme) =>
  createStyles({
    tooltip: {
      margin: 0,
      padding: theme.spacing(1.5, 2),

      ...theme.typography.body2,
      color: theme.palette.common.white,
    },
  })
);

export interface IDisplayConditionStatusProps {
  displayCondition: string;
}

export default function DisplayConditionStatus({
  displayCondition,
}: IDisplayConditionStatusProps) {
  const classes = useStyles();

  const { control } = useFormContext();
  const values = useWatch({ control });

  const displayConditionResult = evaluateDisplayCondition(
    displayCondition,
    values
  );

  return (
    <Tooltip
      title={
        <>
          <Grid container spacing={2} wrap="nowrap" alignItems="flex-start">
            <Grid item>
              <CodeIcon />
            </Grid>
            <Grid item xs>
              This field will be conditionally displayed depending on the values
              the user has entered into the form.
            </Grid>
          </Grid>

          {typeof displayConditionResult === 'boolean' ? (
            <Grid container spacing={2} wrap="nowrap" alignItems="flex-start">
              <Grid item>
                {displayConditionResult === true && <VisibilityIcon />}
                {displayConditionResult === false && <VisibilityOffIcon />}
              </Grid>
              <Grid item xs>
                Based on the values you have entered into this form preview,
                this field will {displayConditionResult === false && 'NOT'} be
                displayed.
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2} wrap="nowrap" alignItems="flex-start">
              <Grid item>
                <ErrorIcon />
              </Grid>
              <Grid item xs>
                The code used to conditionally display this field is invalid:
                <br />
                {displayConditionResult}
              </Grid>
            </Grid>
          )}
        </>
      }
      classes={classes}
    >
      {typeof displayConditionResult === 'string' ? (
        <ErrorIcon color="error" />
      ) : (
        <CodeIcon color="primary" />
      )}
    </Tooltip>
  );
}
