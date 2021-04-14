import React, { Suspense, useRef, useState } from 'react';
import clsx from 'clsx';
import { Controller } from 'react-hook-form';
import { useDrag } from 'react-dnd';
import { useFiregridContext } from 'contexts/FiregridContext';

import {
  makeStyles,
  createStyles,
  useTheme,
  Grid,
  Typography,
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
} from '@antlerengineering/form-builder';
import AddRow from './AddRow';
import DisplayConditionStatus from './DisplayConditionStatus';

const useStyles = makeStyles((theme) =>
  createStyles({
    row: {
      '&:active $order': { opacity: 0 },
    },

    order: {
      color: theme.palette.text.secondary,
      cursor: 'default',

      display: 'block',
      width: 24,
      marginRight: theme.spacing(1.5),
      lineHeight: '56px',
    },

    dragHandle: {
      height: 56,
      boxSizing: 'content-box',

      '& svg': {
        height: '100%',
        paddingRight: theme.spacing(2),
      },
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

    dropArea: {
      height: 60,
      transition: theme.transitions.create('height'),

      '& button': { transition: theme.transitions.create('opacity') },
    },
    droppable: {
      height: 80 + 60 + 60,

      '& button': { opacity: 0 },
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
  name,
  label,
  type,
  customComponents,
  conditional,
  displayCondition,
  gridCols = 12,
  ...props
}: IFieldWrapperProps) {
  const classes = useStyles();
  const theme = useTheme();

  const ref = useRef<any>(null);
  const [conditionalState, setConditionalState] = useState(false);

  const { deleteField, fieldModalRef } = useFiregridContext();

  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: 'FIELD',
      item: { index: props.index },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [props.index]
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

  if (!name) return null;

  renderedField = (
    <Controller
      control={control}
      name={name!}
      render={(renderProps) =>
        React.createElement(fieldComponent, {
          ...props,
          ...renderProps,
          ref,
          name: name!, // Fix TypeScript error
          label: label!, // Fix TypeScript error
          errorMessage: errors[name!]?.message,
          defaultValue: undefined, // Prevent field being both controlled and uncontrolled
        })
      }
      onFocus={() => {
        if (ref.current) {
          ref.current.scrollIntoView({ behavior: 'smooth' });
          ref.current.focus();
        }
      }}
    />
  );

  // If it’s a content field, don’t wrap with Controller
  if (getFieldProp('group', type) === 'content')
    renderedField = React.createElement(fieldComponent, {
      ...props,
      // Stub Controller render props
      onChange: () => {},
      value: undefined,
      onBlur: () => {},
      disabled: true,
      ref: undefined as any,
      name: name!, // Fix TypeScript error
      label: label!, // Fix TypeScript error
    });

  // If it’s a conditional field and the user hasn’t ticked, make sure the
  // Controller doesn’t register the field and there is no value for this field
  if (conditional === 'check')
    renderedField = (
      <Grid container wrap="nowrap" alignItems="flex-start">
        <Grid item>
          <Checkbox
            checked={conditionalState}
            onChange={(e) => {
              setConditionalState(e.target.checked);
            }}
            inputProps={{ 'aria-label': `Enable field ${label}` }}
            style={{ margin: theme.spacing(7 / 8, 2, 7 / 8, -1.5) }}
          />
        </Grid>
        <Grid item xs>
          {conditionalState
            ? renderedField
            : React.createElement(fieldComponent, {
                ...props,
                // Stub Controller render props
                onChange: () => {},
                value: undefined,
                onBlur: () => {},
                disabled: true,
                ref: undefined as any,
                name: name!, // Fix TypeScript error
                label: label!, // Fix TypeScript error
                errorMessage: errors[name!]?.message,
                defaultValue: undefined, // Prevent field being both controlled and uncontrolled
              })}
        </Grid>
      </Grid>
    );

  return (
    <>
      <AddRow index={props.index} />

      <Grid
        item
        key={name!}
        id={`fieldWrapper-${name}`}
        xs={12}
        ref={dragPreview}
      >
        <Grid
          container
          spacing={1}
          wrap="nowrap"
          alignItems="flex-start"
          className={classes.row}
          style={{ opacity: isDragging ? 0.5 : 1 }}
        >
          <Grid item>
            <Typography variant="overline" className={classes.order}>
              {props.index + 1}
            </Typography>
          </Grid>

          <Grid
            item
            ref={drag}
            style={{ cursor: 'grab' }}
            className={classes.dragHandle}
          >
            <DragHandleIcon aria-label="Drag to reorder this field" />
          </Grid>

          {typeof displayCondition === 'string' && displayCondition.length > 0 && (
            <Grid item className={classes.dragHandle}>
              <DisplayConditionStatus displayCondition={displayCondition} />
            </Grid>
          )}

          <Grid item xs>
            <Suspense fallback={<FieldSkeleton />}>{renderedField}</Suspense>
          </Grid>

          <Grid item>
            <IconButton
              aria-label="Edit field"
              color="secondary"
              className={classes.iconButton}
              onClick={() => fieldModalRef.current?.openFieldModal(name!)}
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
                onClick={() => deleteField(name!)}
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
