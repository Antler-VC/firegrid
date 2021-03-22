import React, { Suspense } from 'react'
import clsx from 'clsx'
import _findIndex from 'lodash/findIndex'
import { useDrag, useDrop } from 'react-dnd'
import { useFiregridContext } from 'contexts/FiregridContext'

import { makeStyles, createStyles, Grid, IconButton } from '@material-ui/core'
import { fade } from '@material-ui/core/styles'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import EditIcon from '@material-ui/icons/Edit'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'

import { Friction } from '@antlerengineering/components'
import { FieldSkeleton } from '@antlerengineering/form-builder'
import AddButton from './AddButton'

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
)

export interface IFieldWrapperProps {
  type: string
  name: string
  children: React.ReactNode
}

export default function FieldWrapper({
  type,
  name,
  children,
}: IFieldWrapperProps) {
  const classes = useStyles()

  const { reOrderField } = useFiregridContext()

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'FIELD',
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'FIELD',
      drop: ({ name: dragName }: any) => reOrderField(dragName, name),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [name]
  )

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

      <Grid item xs={12}>
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
            <Suspense fallback={<FieldSkeleton />}>{children}</Suspense>
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
                body: 'You cannot recover this field once it has been deleted.',
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
  )
}
