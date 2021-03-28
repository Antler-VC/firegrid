import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import {
  makeStyles,
  createStyles,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogProps as MuiDialogProps,
  DialogTitle,
  Typography,
  IconButton,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Button,
  ButtonProps,
} from '@material-ui/core'
import { fade } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'

import FormFields from './FormFields'
import { getDefaultValues, getValidationSchema } from './utils'
import { Values, Fields, CustomComponents } from './types'
import { SlideTransitionMui } from './SlideTransition'

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '--spacing-modal': theme.spacing(3) + 'px',
      '--spacing-modal-contents': theme.spacing(3) + 'px',
      '--spacing-card': 'var(--spacing-modal-contents)',
      '--bg-paper': theme.palette.background.paper,

      [theme.breakpoints.down('sm')]: {
        '--spacing-modal': theme.spacing(2) + 'px',
      },
    },

    paper: {
      userSelect: 'none',
      overflowX: 'hidden',

      padding: 'var(--spacing-modal)',
      paddingBottom: 'var(--spacing-modal-contents)',

      backgroundColor: 'var(--bg-paper)',
    },

    titleRow: {
      padding: 0,
      paddingBottom: 'var(--spacing-modal)',

      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    title: {
      ...theme.typography.h5,
      [theme.breakpoints.down('sm')]: theme.typography.h6,
    },
    closeButton: {
      margin: theme.spacing(-1.5),
      marginLeft: 'var(--spacing-modal)',
    },

    content: {
      overflowX: 'hidden',

      padding: '0 var(--spacing-modal)',
      margin: '0 calc(var(--spacing-modal) * -1)',

      ...theme.typography.body1,

      // https://codepen.io/evank/pen/wWbRNO
      background: `
        linear-gradient(
          var(--bg-paper) 50%,
          ${fade(theme.palette.background.paper, 0)}
        ),
        linear-gradient(
          ${fade(theme.palette.background.paper, 0)},
          var(--bg-paper) 50%
        ) 0 100%,
        linear-gradient(
          to top, ${theme.palette.divider} 1px,
          ${fade(theme.palette.divider, 0)}
        ),
        linear-gradient(to top,
          ${theme.palette.divider} 1px,
          ${fade(theme.palette.divider, 0)}
        ) 0 calc(100% - 0.5px)`,
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'var(--bg-paper)',
      backgroundSize: '100% 2px, 100% 3px, 100% 1px, 100% 1px',
      backgroundAttachment: 'local, local, scroll, scroll',
    },

    actions: {
      paddingTop: 'var(--spacing-modal-contents)',
      '& button': { minWidth: 100 },
    },
  })
)

export interface IFormDialogProps {
  fields: Fields
  values?: Values
  onSubmit: (values: Values) => void
  customComponents?: CustomComponents

  open: boolean
  onClose: () => void
  title: React.ReactNode
  formHeader?: React.ReactNode
  formFooter?: React.ReactNode

  customActions?: React.ReactNode
  SubmitButtonProps?: Partial<ButtonProps>
  CancelButtonProps?: Partial<ButtonProps>
  DialogProps?: Partial<MuiDialogProps>
}

export default function FormDialog({
  fields,
  values,
  onSubmit,
  customComponents,

  open,
  onClose,
  title,
  formHeader,
  formFooter,

  customActions,
  SubmitButtonProps,
  CancelButtonProps,
  DialogProps,
}: IFormDialogProps) {
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))

  const defaultValues = {
    ...getDefaultValues(fields, customComponents),
    ...(values ?? {}),
  }

  const methods = useForm({
    mode: 'onBlur',
    defaultValues,
    resolver: yupResolver(getValidationSchema(fields)),
  })
  const { handleSubmit, control, errors, formState, reset } = methods

  const [closeConfirmation, setCloseConfirmation] = useState(false)
  const handleClose = () => {
    setCloseConfirmation(false)
    onClose()
    reset()
  }
  const confirmClose = () => {
    if (formState.isDirty) setCloseConfirmation(true)
    else handleClose()
  }

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmit(values)
        handleClose()
      })}
    >
      <Dialog
        open={open}
        onClose={confirmClose}
        fullScreen={isMobile}
        fullWidth
        TransitionComponent={SlideTransitionMui}
        // Must disablePortal so the dialog can be wrapped in FormikForm
        disablePortal
        aria-labelledby="form-dialog-title"
        {...DialogProps}
        classes={{
          root: classes.root,
          paper: classes.paper,
          ...DialogProps?.classes,
        }}
      >
        <DialogTitle
          id="modal-title"
          className={classes.titleRow}
          disableTypography
        >
          <Typography
            className={classes.title}
            component="h2"
            color="textPrimary"
          >
            {title}
          </Typography>

          <IconButton
            onClick={confirmClose}
            className={classes.closeButton}
            aria-label="Close"
            color="secondary"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className={classes.content}>
          {formHeader}
          <FormFields
            fields={fields}
            control={control}
            errors={errors}
            customComponents={customComponents}
            useFormMethods={methods}
          />
          {formFooter}
        </DialogContent>

        <Grid
          container
          spacing={2}
          justify="center"
          alignItems="center"
          className={classes.actions}
        >
          {customActions ?? (
            <>
              <Grid item>
                <Button
                  color="primary"
                  onClick={confirmClose}
                  {...(CancelButtonProps ?? {})}
                  children={CancelButtonProps?.children || 'Cancel'}
                />
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  {...(SubmitButtonProps ?? {})}
                  children={SubmitButtonProps?.children || 'Submit'}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Dialog>

      <Dialog
        open={open && closeConfirmation}
        disableBackdropClick
        disableEscapeKeyDown
        TransitionComponent={SlideTransitionMui}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Close form?</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You entered data in this form that will be lost.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setCloseConfirmation(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}
