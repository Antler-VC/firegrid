import { useState } from 'react';
import _uniq from 'lodash/uniq';
import { useFiregridContext } from 'contexts/FiregridContext';

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  IconButton,
  Button,
  TextField,
  Portal,
} from '@material-ui/core';
import { fade } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import MultiSelect from '@antlerengineering/multiselect';
import { Friction } from '@antlerengineering/components';
import FormModal from './FormModal';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& > * + *': {
        marginTop: theme.spacing(3),
      },
    },

    formSettingsHeader: { margin: theme.spacing(4, 0, -1) },
    deEm: { color: theme.palette.text.disabled },
    formKey: { userSelect: 'all' },

    iconButtons: {
      marginRight: theme.spacing(2.5),
      minWidth: 96 + theme.spacing(1),
    },
    deleteButton: {
      color: theme.palette.error.main,
      '&:hover': {
        backgroundColor: fade(
          theme.palette.error.main,
          theme.palette.action.hoverOpacity
        ),
      },
    },

    formFieldsHeader: {
      marginTop: theme.spacing(4),
      marginBottom: 'calc(var(--grid-gutter) * -1)',
    },
  })
);

export default function FormSelectors() {
  const classes = useStyles();

  const {
    forms,
    selectedForm,
    setSelectedFormId,
    updateSelectedForm,
    newForm,
    deleteForm,
    formPreview,
    setFormPreview,
  } = useFiregridContext();

  const [selectedApp, setSelectedApp] = useState(selectedForm?.app ?? '');
  const [showForm, setShowForm] = useState<'add' | 'edit' | false>(false);

  const handleSubmit = (values: Record<string, any>) => {
    if (showForm === 'add') newForm(values);
    if (showForm === 'edit') updateSelectedForm(values);

    setTimeout(() => window.scrollTo(0, 0));
  };

  return (
    <>
      <div className={classes.root}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm('add')}
        >
          Create New Form
        </Button>

        <Grid container spacing={1} wrap="nowrap" alignItems="center">
          <Grid item xs>
            <MultiSelect
              label="Platform"
              labelPlural="platforms"
              options={_uniq(forms.map((doc) => doc.app))}
              multiple={false}
              value={selectedApp}
              onChange={setSelectedApp as any}
              TextFieldProps={{ autoFocus: true }}
            />
          </Grid>

          <Grid item className={classes.iconButtons} />
        </Grid>

        <Grid container spacing={1} wrap="nowrap" alignItems="center">
          <Grid item xs>
            <MultiSelect
              label="Form"
              labelPlural="forms"
              options={forms
                .filter((doc) => doc.app === selectedApp)
                .map((doc) => ({ value: doc.id, label: doc.name }))}
              multiple={false}
              value={selectedForm?.app === selectedApp ? selectedForm?.id : ''}
              onChange={setSelectedFormId as any}
              disabled={!selectedApp}
            />
          </Grid>

          <Grid item className={classes.iconButtons} />
        </Grid>

        {selectedForm && (
          <>
            <Typography
              variant="overline"
              component="h2"
              color="textSecondary"
              className={classes.formSettingsHeader}
            >
              Form Settings
            </Typography>

            <Grid container spacing={1} wrap="nowrap" alignItems="center">
              <Grid item xs>
                <Typography variant="caption" className={classes.deEm}>
                  Form Key
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  className={classes.formKey}
                >
                  {selectedForm?.id}
                </Typography>
              </Grid>

              <Grid item className={classes.iconButtons}>
                <IconButton
                  color="secondary"
                  aria-label="Copy Form Key to clipboard"
                  onClick={() =>
                    navigator.clipboard.writeText(selectedForm?.id as string)
                  }
                >
                  <FileCopyOutlinedIcon />
                </IconButton>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={1}
              wrap="nowrap"
              alignItems="center"
              justify="space-between"
            >
              <Grid item xs>
                <TextField
                  label="Form Name"
                  value={selectedForm?.name}
                  fullWidth
                  inputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item className={classes.iconButtons}>
                <IconButton
                  color="secondary"
                  aria-label="Edit form"
                  onClick={() => setShowForm('edit')}
                >
                  <EditIcon />
                </IconButton>

                <Friction
                  message={{
                    title: 'Delete form?',
                    body: 'You cannot undo this action.',
                    confirm: 'Delete Form',
                  }}
                >
                  <IconButton
                    className={classes.deleteButton}
                    aria-label="Delete form"
                    onClick={() => deleteForm(selectedForm?.id)}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </Friction>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={1}
              wrap="nowrap"
              alignItems="center"
              justify="space-between"
              className={classes.formFieldsHeader}
            >
              <Grid item>
                <Typography
                  variant="overline"
                  component="h2"
                  color="textSecondary"
                >
                  Form Fields
                </Typography>
              </Grid>

              <Grid item>
                <Button
                  startIcon={
                    formPreview ? <VisibilityOffIcon /> : <VisibilityIcon />
                  }
                  onClick={() => setFormPreview((x) => !x)}
                >
                  {formPreview ? 'Hide Preview' : 'Preview Form'}
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </div>

      <Portal>
        <FormModal
          showForm={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      </Portal>
    </>
  );
}
