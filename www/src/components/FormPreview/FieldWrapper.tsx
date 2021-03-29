import React, { Suspense, useState } from 'react';
import clsx from 'clsx';
import _findIndex from 'lodash/findIndex';
import { useDrag, useDrop } from 'react-dnd';
import { useFiregridContext } from 'contexts/FiregridContext';

import {
  makeStyles,
  createStyles,
  useTheme,
  Grid,
  IconButton,
  Checkbox,
} from '@material-ui/core';
import { fade } from '@material-ui/core/styles';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import EditIcon from '@material-ui/icons/Edit';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import { Friction } from '@antlerengineering/components';
import {
  Field,
  IFormFieldsProps,
  FieldSkeleton,
  CustomComponent,
  getFieldProp,
} from 'form-builder';
import AddButton from './AddButton';

const useStyles = makeStyles((theme) =>
  createStyles({
    dragHandle: {
      margin: theme.spacing(0.5, 0),
      padding: theme.spacing(1.5),
      paddingLeft: 0,
      boxSizing: 'content-box',
    },

    iconButton: {
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },

    removeButton: {
      color: theme.palette.error.main,
      '&:hover': {
        backgroundColor: fade(
          theme.palette.error.main,
          theme.palette.action.hoverOpacity
        ),
      },
    },

    dropArea: { position: 'relative' },
    droppable: {
      '& button': { opacity: 0 },
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: '50%',
        left: 0,

        width: '100%',
        height: 2,
        marginTop: -1,

        backgroundColor: theme.palette.antler.green[500],
      },
    },
  })
);

export interface IFieldWrapperProps
  extends Field,
    Omit<IFormFieldsProps, 'fields'> {
  index: number;
}

export default function FieldWrapper({
  control,
  errors,
  type,
  customComponents,
  conditional,
  gridCols = 12,
  ...props
}: IFieldWrapperProps) {
  const classes = useStyles();
  const theme = useTheme();

  const [conditionalState, setConditionalState] = useState(false);

  const { reOrderField } = useFiregridContext();

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'FIELD',
    item: { name: props.name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'FIELD',
      drop: ({ name: dragName }: any) => reOrderField(dragName, props.name!),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [props.name]
  );

  if (!type) {
    console.error(`Invalid field type: ${type}`, props);
    return null;
  }

  let renderedField: React.ReactNode = null;
  let fieldComponent: CustomComponent;

  // Try to get fieldComponent from customComponents list
  if (
    !!customComponents &&
    Object.keys(customComponents).length > 0 &&
    type in customComponents
  ) {
    fieldComponent = customComponents[type].component;
  }
  // If not found in customComponents, try to get it from the built-in components
  else {
    fieldComponent = getFieldProp('component', type);

    // If not found in either, don’t display anything
    if (!fieldComponent) {
      console.error(`No matching field component for \`${type}\``);
      return null;
    }
  }

  if (!props.name) return null;

  renderedField = React.createElement(fieldComponent, {
    ...props,
    name: props.name!,
    label: props.label!,
    control,
    errorMessage: errors[props.name!]?.message,
    disabled: conditional ? !conditionalState : props.disabled,
  });

  if (conditional === 'check')
    renderedField = (
      <Grid container wrap="nowrap" alignItems="flex-start">
        <Grid item>
          <Checkbox
            checked={conditionalState}
            onChange={(e) => {
              setConditionalState(e.target.checked);
              props.useFormMethods.setValue(props.name!, undefined);
            }}
            inputProps={{ 'aria-label': `Enable field ${props.label}` }}
            style={{ margin: theme.spacing(1, 2, 1, -1.5) }}
          />
        </Grid>
        <Grid item xs key={`${props.name}-${conditionalState}`}>
          <Suspense fallback={<FieldSkeleton />}>{renderedField}</Suspense>
        </Grid>
      </Grid>
    );

  return (
    <>
      <Grid
        item
        xs={12}
        ref={drop}
        className={clsx(
          classes.dropArea,
          isOver && canDrop && classes.droppable
        )}
      >
        <AddButton />
      </Grid>

      <Grid item key={props.name!} id={`fieldWrapper-${props.name}`} xs={12}>
        <Grid
          container
          spacing={1}
          wrap="nowrap"
          alignItems="flex-start"
          style={{ opacity: isDragging ? 0.5 : 1 }}
          ref={dragPreview}
        >
          <Grid item ref={drag} style={{ cursor: 'grab' }}>
            <DragHandleIcon
              aria-label="Drag to reorder this field"
              className={classes.dragHandle}
            />
          </Grid>

          <Grid item xs>
            <Suspense fallback={<FieldSkeleton />}>{renderedField}</Suspense>
          </Grid>

          <Grid item>
            <IconButton
              aria-label="Edit field"
              color="secondary"
              className={classes.iconButton}
            >
              <EditIcon />
            </IconButton>

            <Friction
              message={{
                title: 'Are you sure you want to delete this field?',
                body: 'You cannot undo this action.',
                confirm: 'Delete Field',
              }}
            >
              <IconButton
                aria-label="Remove field"
                color="secondary"
                className={clsx(classes.iconButton, classes.removeButton)}
                edge="end"
              >
                <RemoveCircleIcon />
              </IconButton>
            </Friction>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
