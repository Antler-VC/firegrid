import { makeStyles, createStyles, LinearProgress } from '@material-ui/core'

import Step, { IStepProps } from './Step'

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: 'relative',
      height: 20,
      padding: '6px 0',
    },

    colorPrimary: {
      backgroundColor: theme.palette.grey[300],
      height: 8,
      borderRadius: 8,
    },
    bar: { borderRadius: 8 },
  })
)

export interface ISteppedProgressProps {
  value: number
  steps: Omit<IStepProps, 'reached'>[]
}

export default function SteppedProgress({
  value,
  steps,
}: ISteppedProgressProps) {
  const { root: rootClass, ...classes } = useStyles()

  return (
    <div className={rootClass}>
      <LinearProgress variant="determinate" value={value} classes={classes} />
      {steps.map((step) => (
        <Step key={step.value} reached={value >= step.value} {...step} />
      ))}
    </div>
  )
}
