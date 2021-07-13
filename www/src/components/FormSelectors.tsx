import { useState, useEffect } from 'react';
import _sortedUniq from 'lodash/sortedUniq';
import _sortBy from 'lodash/sortBy';
import { useAppContext } from 'contexts/AppContext';
import { useFiregridContext } from 'contexts/FiregridContext';

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  IconButton,
  Button,
  Portal,
} from '@material-ui/core';
import { fade } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import MultiSelect from '@antlerengineering/multiselect';
import { Friction } from '@antlerengineering/components';
import FormModal from './FormModal';
import { Form } from 'types/Form';

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

  const { userClaims } = useAppContext();
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

  const [previewOnly, setPreviewOnly] = useState(false);
  useEffect(() => {
    setPreviewOnly(
      Boolean(
        !userClaims?.roles ||
          !userClaims?.roles.some((r) => {
            const allowedRoles = selectedForm?.editorRoles ?? [];
            return ['ADMIN', ...allowedRoles].includes(r);
          })
      )
    );
  }, [selectedForm, userClaims]);
  useEffect(() => {
    if (previewOnly) setFormPreview(previewOnly);
  }, [previewOnly, setFormPreview]);

  const [selectedApp, setSelectedApp] = useState(selectedForm?.app ?? '');
  const [showForm, setShowForm] = useState<'add' | 'edit' | false>(false);

  const handleSubmit = (values: Partial<Form>) => {
    // Set default modal.title to form name
    if (values.variant === 'modal' && !values.modal?.title)
      values.modal = { title: values.name! };

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
              options={_sortedUniq(forms.map((doc) => doc.app).sort())}
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
              options={_sortBy(
                forms
                  .filter((doc) => doc.app === selectedApp)
                  .map((doc) => ({ value: doc.id, label: doc.name })),
                'label'
              )}
              multiple={false}
              value={selectedForm?.app === selectedApp ? selectedForm?.id : ''}
              onChange={setSelectedFormId as any}
              disabled={!selectedApp}
            />
          </Grid>

          <Grid item className={classes.iconButtons}>
            <IconButton
              color="secondary"
              aria-label="Edit form"
              onClick={() => setShowForm('edit')}
              disabled={!selectedForm}
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
                onClick={() => deleteForm(selectedForm!.id)}
                disabled={!selectedForm}
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
            <Typography variant="overline" component="h2" color="textSecondary">
              Form Fields
            </Typography>
          </Grid>

          <Grid item>
            <Button
              startIcon={
                formPreview ? <VisibilityOffIcon /> : <VisibilityIcon />
              }
              disabled={previewOnly || !selectedForm}
              onClick={() => setFormPreview((x) => !x)}
            >
              {formPreview ? 'Hide Preview' : 'Preview Form'}
            </Button>
          </Grid>
        </Grid>
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
