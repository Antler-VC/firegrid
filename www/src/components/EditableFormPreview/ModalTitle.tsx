import { useFiregridContext } from 'contexts/FiregridContext';

import { makeStyles, createStyles } from '@material-ui/core';
import { Grid, DialogTitle, Typography, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) =>
  createStyles({
    spacer: { boxSizing: 'content-box' },

    title: {
      ...theme.typography.h5,
      [theme.breakpoints.down('sm')]: theme.typography.h6,
    },
  })
);

export default function ModalTitle() {
  const classes = useStyles();

  const { selectedForm, modalFormModalRef } = useFiregridContext();
  if (!selectedForm || !selectedForm.modal) return null;

  return (
    <Grid container spacing={1} wrap="nowrap" alignItems="center">
      <Grid item className={classes.spacer} style={{ width: 36 }} />
      <Grid item className={classes.spacer} style={{ width: 40 }} />

      <Grid item xs>
        <DialogTitle disableTypography style={{ padding: 0 }}>
          <Typography
            className={classes.title}
            component="h2"
            color="textPrimary"
          >
            {selectedForm.modal.title}
          </Typography>
        </DialogTitle>
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
