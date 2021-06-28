import { useState } from 'react';
import _sortBy from 'lodash/sortBy';
import { useListEditorContext } from 'contexts/ListEditorContext';

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

import MultiSelect from '@antlerengineering/multiselect';
import { Friction } from '@antlerengineering/components';
import ListModal from './ListModal';

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

export default function ListSelectors() {
  const classes = useStyles();

  const {
    lists,
    selectedList,
    setSelectedListId,
    updateSelectedList,
    newList,
    deleteList,
  } = useListEditorContext();

  const [showListModal, setShowListModal] = useState<'add' | 'edit' | false>(
    false
  );

  const handleSubmit = (values: Record<string, any>) => {
    if (showListModal === 'add') newList(values);
    if (showListModal === 'edit') updateSelectedList(values);

    setTimeout(() => window.scrollTo(0, 0));
  };

  return (
    <>
      <div className={classes.root}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowListModal('add')}
        >
          Create New List
        </Button>

        <Grid container spacing={1} wrap="nowrap" alignItems="center">
          <Grid item xs>
            <MultiSelect
              label="List"
              labelPlural="lists"
              options={_sortBy(
                lists.map((doc) => ({ value: doc.id, label: doc.name })),
                'label'
              )}
              multiple={false}
              value={selectedList?.id}
              onChange={setSelectedListId as any}
            />
          </Grid>

          <Grid item className={classes.iconButtons} />
        </Grid>

        {selectedList && (
          <>
            <Typography
              variant="overline"
              component="h2"
              color="textSecondary"
              className={classes.formSettingsHeader}
            >
              List Settings
            </Typography>

            <Grid container spacing={1} wrap="nowrap" alignItems="center">
              <Grid item xs>
                <Typography variant="caption" className={classes.deEm}>
                  List Key
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  className={classes.formKey}
                >
                  {selectedList?.id}
                </Typography>
              </Grid>

              <Grid item className={classes.iconButtons}>
                <IconButton
                  color="secondary"
                  aria-label="Copy List Key to clipboard"
                  onClick={() =>
                    navigator.clipboard.writeText(selectedList?.id as string)
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
                  label="List Name"
                  value={selectedList?.name}
                  fullWidth
                  inputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item className={classes.iconButtons}>
                <IconButton
                  color="secondary"
                  aria-label="Edit form"
                  onClick={() => setShowListModal('edit')}
                >
                  <EditIcon />
                </IconButton>

                <Friction
                  message={{
                    title: 'Delete form?',
                    body: 'You cannot undo this action.',
                    confirm: 'Delete List',
                  }}
                >
                  <IconButton
                    className={classes.deleteButton}
                    aria-label="Delete form"
                    onClick={() => deleteList(selectedList?.id)}
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
                  List Values
                </Typography>
              </Grid>
            </Grid>
          </>
        )}
      </div>

      <Portal>
        <ListModal
          showListModal={showListModal}
          onClose={() => setShowListModal(false)}
          onSubmit={handleSubmit}
        />
      </Portal>
    </>
  );
}
