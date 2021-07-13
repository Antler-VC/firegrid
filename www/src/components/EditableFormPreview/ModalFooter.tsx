import { useFiregridContext } from 'contexts/FiregridContext';
import { useFormContext } from 'react-hook-form';
import _isEmpty from 'lodash/isEmpty';

import { makeStyles, createStyles } from '@material-ui/core';
import { Grid, Button, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { SubmitError } from '@antlerengineering/form-builder';

const useStyles = makeStyles(() =>
  createStyles({
    spacer: { boxSizing: 'content-box' },
  })
);

export default function ModalFooter() {
  const classes = useStyles();

  const { selectedForm, modalFormModalRef } = useFiregridContext();
  const {
    formState: { errors },
  } = useFormContext();

  if (!selectedForm || !selectedForm.modal) return null;

  const {
    CancelButtonProps,
    SubmitButtonProps,
    hideCancelButton,
    hideSubmitError,
    SubmitErrorProps,
  } = selectedForm.modal ?? {};

  const hasErrors = errors
    ? (Object.values(errors).reduce(
        (a, c) => !!(a || !_isEmpty(c)),
        false
      ) as boolean)
    : false;

  return (
    <Grid container spacing={1} wrap="nowrap" alignItems="center">
      <Grid item className={classes.spacer} style={{ width: 36 }} />
      <Grid item className={classes.spacer} style={{ width: 40 }} />

      <Grid item xs>
        <Grid container spacing={2} justify="center" alignItems="center">
          {!hideCancelButton && (
            <Grid item>
              <Button
                color="primary"
                {...(CancelButtonProps ?? {})}
                children={CancelButtonProps?.children || 'Cancel'}
                style={{ minWidth: 100 }}
              />
            </Grid>
          )}
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={hasErrors}
              {...(SubmitButtonProps ?? {})}
              children={SubmitButtonProps?.children || 'Submit'}
              style={{ minWidth: 100 }}
            />
          </Grid>

          {!hideSubmitError && hasErrors && (
            <SubmitError
              {...SubmitErrorProps}
              style={{ marginTop: 0, ...SubmitErrorProps?.style }}
            />
          )}
        </Grid>
      </Grid>

      <Grid item className={classes.spacer} style={{ width: 84 }}>
        <IconButton
          color="secondary"
          aria-label="Edit Modal Form"
          onClick={() => modalFormModalRef.current?.open(true)}
        >
          <EditIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
