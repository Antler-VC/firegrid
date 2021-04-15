import clsx from 'clsx';
import { useDrop } from 'react-dnd';

import { makeStyles, createStyles, Grid, Button } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddBoxIcon from '@material-ui/icons/AddBox';

import { useFiregridContext } from 'contexts/FiregridContext';

const useStyles = makeStyles((theme) =>
  createStyles({
    dropArea: {
      height: 60,

      '& button': { transition: theme.transitions.create('opacity') },
    },
    droppable: {
      height: 80 + 60 + 60,
      transition: theme.transitions.create('height'),

      '& button': { opacity: 0 },
    },

    button: {
      margin: '0 auto',
      display: 'flex',

      minWidth: 44,
      color: theme.palette.antler.aGray[300],

      '&:hover, &:focus': { color: theme.palette.secondary.main },
    },

    startIcon: {
      margin: theme.spacing(0, -0.5),
      '&  > *:first-child': { fontSize: 24 },
    },

    label: {
      width: 0,
      opacity: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textAlign: 'center',

      transition: theme.transitions.create(['width', 'opacity'], {
        duration: theme.transitions.duration.short,
      }),

      '$button:hover &, $button:focus &': {
        width: 120,
        opacity: 1,
      },

      '&::before': {
        content: 'none',
        width: theme.spacing(1.5),
      },
    },
  })
);

export interface IAddRowProps {
  index: number;
  addType?: 'field' | 'section';
}

export default function AddRow({ index, addType = 'field' }: IAddRowProps) {
  const classes = useStyles();

  const { reOrderField, fieldModalRef, formPreview } = useFiregridContext();

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'FIELD',
      drop: ({ index: dragIndex }: any) =>
        reOrderField(dragIndex, index > dragIndex ? index - 1 : index),
      canDrop: ({ index: dragIndex }) =>
        !(dragIndex === index || index === dragIndex + 1),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [index]
  );

  if (formPreview) return null;

  return (
    <Grid
      item
      xs={12}
      ref={drop}
      className={clsx(classes.dropArea, isOver && canDrop && classes.droppable)}
    >
      <Button
        classes={{ root: classes.button, startIcon: classes.startIcon }}
        color="default"
        startIcon={addType === 'field' ? <AddCircleIcon /> : <AddBoxIcon />}
        onClick={() => fieldModalRef.current?.openFieldModal(index)}
      >
        <span className={classes.label}>Add {addType}</span>
      </Button>
    </Grid>
  );
}
