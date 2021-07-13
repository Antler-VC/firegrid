import React from 'react';
import { format } from 'fecha';
import { useDrag, useDrop } from 'react-dnd';

import {
  makeStyles,
  createStyles,
  Grid,
  IconButton,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import CancelIcon from '@material-ui/icons/Cancel';
import AttachmentIcon from '@material-ui/icons/Attachment';

import { Friction } from '@antlerengineering/components';
import { FileRecord } from 'hooks/useFirebaseUploader';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,

      margin: 0,
      width: '100%',

      paddingLeft: theme.spacing(1.5),
    },

    drag: {
      padding: theme.spacing(1.5, 1),
      marginLeft: theme.spacing(-1.5),
    },
    dragIcon: { display: 'block' },

    imageWrapper: {
      padding: theme.spacing(1, 0),
    },

    progress: {
      display: 'block',
      padding: theme.spacing(1.5),
      boxSizing: 'content-box',
    },

    frictionFileTimestamp: { color: theme.palette.text.disabled },
  })
);

export interface IImageWrapperProps {
  name: string;
  index: number;
  disabled: boolean;
  multiple?: boolean;
  children?: React.ReactNode;
  file?: FileRecord;
  progress?: number;
  onDelete?: () => void;
  onSwap?: (from: number, to: number) => void;
  // onCancel?: () => void
}

export default function ImageWrapper({
  name,
  index,
  disabled,
  multiple = false,
  children,
  file,
  progress,
  onDelete,
  onSwap,
}: // onCancel,
IImageWrapperProps) {
  const classes = useStyles();

  const [, drag, dragPreview] = useDrag(
    () => ({
      type: name,
      item: { index },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [index]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: name,
      drop: ({ index: fromIndex }: any) => {
        if (onSwap && !disabled) onSwap(fromIndex, index);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [index]
  );

  return (
    <div
      ref={disabled ? null : drop}
      style={isOver ? { opacity: 0.1 } : undefined}
    >
      <Grid
        container
        direction="row"
        alignItems="center"
        wrap="nowrap"
        className={classes.root}
        ref={disabled ? null : dragPreview}
      >
        {multiple && (
          <Grid
            item
            className={classes.drag}
            style={{
              cursor: progress === undefined && !disabled ? 'grab' : 'default',
            }}
            ref={progress === undefined && !disabled ? drag : null}
          >
            <DragIndicatorIcon
              className={classes.dragIcon}
              color={
                progress === undefined && !disabled ? 'secondary' : 'disabled'
              }
            />
          </Grid>
        )}

        <Grid item className={classes.imageWrapper}>
          {children}
        </Grid>

        <Grid item>
          {progress === undefined && !!file ? (
            <Friction
              message={{
                title: 'Delete image?',
                customBody: (
                  <Grid container spacing={2} wrap="nowrap">
                    <Grid item>
                      <AttachmentIcon />
                    </Grid>

                    <Grid item xs>
                      <Typography color="textPrimary">{file.name}</Typography>
                      <Typography className={classes.frictionFileTimestamp}>
                        Last updated:{' '}
                        {format(new Date(file.lastModifiedTS), 'D MMM YYYY')}
                      </Typography>
                    </Grid>
                  </Grid>
                ),
                confirm: 'Delete',
              }}
            >
              <IconButton
                aria-label="Delete image"
                onClick={onDelete}
                color="secondary"
                disabled={disabled}
              >
                <CancelIcon />
              </IconButton>
            </Friction>
          ) : (
            <CircularProgress
              size={24}
              color="inherit"
              thickness={3}
              variant={progress! > 0 ? 'determinate' : 'indeterminate'}
              value={progress!}
              className={classes.progress}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
}
