import clsx from 'clsx'

import { makeStyles, createStyles, Tooltip } from '@material-ui/core'

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: 'absolute',
      top: 0,
      transform: 'translateX(-100%)',

      width: 20,
      height: 20,
      borderRadius: '50%',
      backgroundColor: theme.palette.grey[300],

      transition: theme.transitions.create('background-color'),
    },

    reached: { backgroundColor: theme.palette.primary.main },

    tooltip: {
      ...theme.typography.body2,
      padding: theme.spacing(1.5, 2),
      backgroundColor: theme.palette.grey[600],
      boxShadow: theme.shadows[6],
      whiteSpace: 'pre-line',

      '$reached&': { backgroundColor: theme.palette.grey[900] },
    },
  })
)

export interface IStepProps {
  reached: boolean
  value: number
  text: React.ReactNode
  incompleteText?: React.ReactNode
}

export default function Step({
  reached,
  value,
  text,
  incompleteText,
}: IStepProps) {
  const classes = useStyles()

  return (
    <Tooltip
      title={(reached ? text : incompleteText) as string}
      classes={{ tooltip: clsx(classes.tooltip, reached && classes.reached) }}
    >
      <div
        className={clsx(classes.root, reached && classes.reached)}
        style={{ left: `${value}%` }}
      />
    </Tooltip>
  )
}
