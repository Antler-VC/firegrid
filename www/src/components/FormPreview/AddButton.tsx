import {
  makeStyles,
  createStyles,
  Button,
  ButtonProps,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddBoxIcon from '@material-ui/icons/AddBox';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
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

      '$root:hover &, $root:focus &': {
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

export interface IAddButtonProps extends Partial<ButtonProps> {
  addType?: 'field' | 'section';
}

export default function AddButton({
  addType = 'field',
  ...props
}: IAddButtonProps) {
  const classes = useStyles();

  return (
    <Button
      classes={{ root: classes.root, startIcon: classes.startIcon }}
      color="default"
      startIcon={addType === 'field' ? <AddCircleIcon /> : <AddBoxIcon />}
      {...props}
    >
      <span className={classes.label}>Add {addType}</span>
    </Button>
  );
}
